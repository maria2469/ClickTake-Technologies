import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo, useRef, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { motion, AnimatePresence } from "framer-motion";
import { Editor } from '@tinymce/tinymce-react';
import {
    Plus,
    Trash2,
    Save,
    Upload,
    FileText,
    Image as ImageIcon,
    Inbox,
    Check,
    ChevronUp,
    ChevronDown,
    Search,
    X,
    AlertCircle,
    Edit3
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/cms")({
    head: () => ({
        meta: [
            { title: "CMS Management — ClickTake Admin Portal" },
            { name: "description", content: "Manage pages, layout blocks, media assets, and navigation menus." },
        ],
    }),
    component: AdminCMS,
});

/* ───────────────── DATA TYPES ───────────────── */

interface PageBlock {
    id: string;
    type: "header" | "text" | "media" | "button";
    content: string;
    meta?: string;
}

interface CMSPage {
    id: string;
    name: string;
    path: string;
    blocks: PageBlock[];
}

interface MediaFile {
    id: string;
    name: string;
    type: "image" | "pdf" | "video";
    size: string;
    url: string;
}

interface BlogPost {
    id: string;
    title: string;
    author: string;
    date: string;
    status: "Published" | "Draft";
    content?: string;
}

/* ───────────────── COMPONENT ───────────────── */

function AdminCMS() {
    // Pages State
    const [pages, setPages] = useState<CMSPage[]>([]);
    const [savedPages, setSavedPages] = useState<CMSPage[]>([]);
    const [selectedPageId, setSelectedPageId] = useState<string>("");

    // Media Library State
    const [mediaList, setMediaList] = useState<MediaFile[]>([]);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Blog & Navigation States
    const [blogList, setBlogList] = useState<BlogPost[]>([]);
    const [newBlogTitle, setNewBlogTitle] = useState("");
    const [headerLinks, setHeaderLinks] = useState<{ id: string; label: string; to_path: string }[]>([]);
    const [newNavLink, setNewNavLink] = useState({ label: "", to_path: "" });
    const [editingBlogId, setEditingBlogId] = useState<string | null>(null);
    const [blogContent, setBlogContent] = useState("");

    // Modals & Feedback UI States
    const [isCreatePageModalOpen, setIsCreatePageModalOpen] = useState(false);
    const [newPageName, setNewPageName] = useState("");
    const [newPagePath, setNewPagePath] = useState("");
    const [showSavedFeedback, setShowSavedFeedback] = useState(false);

    // Search Filter States
    const [pageSearchText, setPageSearchText] = useState("");
    const [mediaSearchText, setMediaSearchText] = useState("");

    useEffect(() => {
        const fetchInitialData = async () => {
            const { data: pagesData } = await supabase.from('cms_pages').select('*');
            if (pagesData && pagesData.length > 0) {
                setPages(pagesData);
                setSavedPages(pagesData);
                setSelectedPageId(pagesData[0].id);
            }

            const { data: mediaData } = await supabase.from('cms_media').select('*').order('created_at', { ascending: false });
            if (mediaData) setMediaList(mediaData);

            const { data: blogsData } = await supabase.from('cms_blogs').select('*').order('created_at', { ascending: false });
            if (blogsData) setBlogList(blogsData);

            const { data: navData } = await supabase.from('cms_nav_links').select('*').order('created_at', { ascending: true });
            if (navData) setHeaderLinks(navData);
        };
        fetchInitialData();

        const channel = supabase.channel('cms-sync')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'cms_pages' }, fetchInitialData)
            .on('postgres_changes', { event: '*', schema: 'public', table: 'cms_media' }, fetchInitialData)
            .on('postgres_changes', { event: '*', schema: 'public', table: 'cms_blogs' }, fetchInitialData)
            .on('postgres_changes', { event: '*', schema: 'public', table: 'cms_nav_links' }, fetchInitialData)
            .subscribe();

        return () => { supabase.removeChannel(channel); };
    }, []);

    // Selected Page Derived
    const selectedPage = useMemo(() => {
        return pages.find((p) => p.id === selectedPageId) || pages[0];
    }, [pages, selectedPageId]);

    // Unsaved Changes Count Computation (compared to savedPages state)
    const unsavedChangesCount = useMemo(() => {
        let count = 0;
        
        pages.forEach((p) => {
            const saved = savedPages.find((sp) => sp.id === p.id);
            if (!saved) {
                count++; // New page
            } else {
                if (saved.name !== p.name || saved.path !== p.path) {
                    count++;
                } else {
                    if (saved.blocks.length !== p.blocks.length) {
                        count++;
                    } else {
                        let blocksDiff = false;
                        for (let i = 0; i < p.blocks.length; i++) {
                            const cb = p.blocks[i];
                            const sb = saved.blocks[i];
                            if (!sb || cb.id !== sb.id || cb.type !== sb.type || cb.content !== sb.content || cb.meta !== sb.meta) {
                                blocksDiff = true;
                                break;
                            }
                        }
                        if (blocksDiff) count++;
                    }
                }
            }
        });

        savedPages.forEach((sp) => {
            if (!pages.some((p) => p.id === sp.id)) {
                count++; // Deleted page
            }
        });

        return count;
    }, [pages, savedPages]);

    // Page Search Filtering
    const filteredPages = useMemo(() => {
        return pages.filter(
            (p) =>
                p.name.toLowerCase().includes(pageSearchText.toLowerCase()) ||
                p.path.toLowerCase().includes(pageSearchText.toLowerCase())
        );
    }, [pages, pageSearchText]);

    // Media Search Filtering
    const filteredMediaList = useMemo(() => {
        return mediaList.filter((m) =>
            m.name.toLowerCase().includes(mediaSearchText.toLowerCase())
        );
    }, [mediaList, mediaSearchText]);

    // Update Block Handlers
    const handleUpdateBlockContent = (blockId: string, newText: string) => {
        setPages(
            pages.map((p) =>
                p.id === selectedPageId
                    ? { ...p, blocks: p.blocks.map((b) => (b.id === blockId ? { ...b, content: newText } : b)) }
                    : p
            )
        );
    };

    const handleUpdateBlockMeta = (blockId: string, newMeta: string) => {
        setPages(
            pages.map((p) =>
                p.id === selectedPageId
                    ? { ...p, blocks: p.blocks.map((b) => (b.id === blockId ? { ...b, meta: newMeta } : b)) }
                    : p
            )
        );
    };

    // Save All Pages Layouts
    const handleSavePage = async () => {
        for (const page of pages) {
            const { error } = await supabase
                .from('cms_pages')
                .upsert({ id: page.id, name: page.name, path: page.path, blocks: page.blocks }, { onConflict: 'id' });
            if (error) {
                toast.error(`Failed to save page ${page.name}`);
                return;
            }
        }
        
        // Handle deletions
        for (const sp of savedPages) {
            if (!pages.some(p => p.id === sp.id)) {
                await supabase.from('cms_pages').delete().eq('id', sp.id);
            }
        }

        setSavedPages(pages);
        setShowSavedFeedback(true);
        toast.success(`Published layouts for all ${pages.length} pages to production!`);
        setTimeout(() => {
            setShowSavedFeedback(false);
        }, 2000);
    };

    // Page Creation Form Submit
    const handleCreatePageSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const trimmedName = newPageName.trim();
        let trimmedPath = newPagePath.trim();

        if (!trimmedName || !trimmedPath) return;
        if (!trimmedPath.startsWith("/")) trimmedPath = "/" + trimmedPath;

        if (pages.some((p) => p.path.toLowerCase() === trimmedPath.toLowerCase())) {
            toast.error(`A page with route path "${trimmedPath}" already exists.`);
            return;
        }

        const newId = trimmedName.toLowerCase().replace(/[^a-z0-9]/g, "-") || `page-${Date.now()}`;
        if (pages.some((p) => p.id === newId)) {
            toast.error(`A page with name "${trimmedName}" already exists.`);
            return;
        }

        const newPage: CMSPage = {
            id: newId,
            name: trimmedName,
            path: trimmedPath,
            blocks: [
                { id: `b-h-${Date.now()}`, type: "header", content: `Welcome to ${trimmedName}` },
                { id: `b-t-${Date.now()}`, type: "text", content: "This is a brand new page. Customize your text here." }
            ]
        };

        const { error } = await supabase.from('cms_pages').insert(newPage);
        if (error) {
            toast.error("Failed to create page on server");
            return;
        }

        setPages([...pages, newPage]);
        setSelectedPageId(newId);
        setIsCreatePageModalOpen(false);
        setNewPageName("");
        setNewPagePath("");
        toast.success(`Created page "${trimmedName}" successfully!`);
    };

    // Page Deletion Action
    const handleDeletePage = async (pageId: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (pages.length <= 1) {
            toast.error("Cannot delete the only page in the CMS.");
            return;
        }

        const { error } = await supabase.from('cms_pages').delete().eq('id', pageId);
        if (error) {
            toast.error("Failed to delete page");
            return;
        }

        const deletedPageName = pages.find((p) => p.id === pageId)?.name || "Page";
        const updatedPages = pages.filter((p) => p.id !== pageId);
        setPages(updatedPages);

        if (selectedPageId === pageId) {
            setSelectedPageId(updatedPages[0].id);
        }

        toast.error(`Deleted page "${deletedPageName}"`);
    };

    // Block Creation
    const handleAddBlock = (type: "header" | "text" | "button" | "media") => {
        let content = "";
        let meta = undefined;

        switch (type) {
            case "header": content = "New Section Header"; break;
            case "text": content = "Write your paragraph text details here."; break;
            case "button": content = "Click Action"; meta = "#"; break;
            case "media": content = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80"; break;
        }

        const newBlock: PageBlock = {
            id: `b-${type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            type,
            content,
            meta
        };

        setPages(
            pages.map((p) =>
                p.id === selectedPageId
                    ? { ...p, blocks: [...p.blocks, newBlock] }
                    : p
            )
        );
        toast.success(`Added ${type.toUpperCase()} block. Remember to save layout.`);
    };

    // Block Reordering (Up/Down)
    const handleMoveBlock = (blockId: string, direction: "up" | "down", e: React.MouseEvent) => {
        e.stopPropagation();
        const currentPage = pages.find((p) => p.id === selectedPageId);
        if (!currentPage) return;

        const index = currentPage.blocks.findIndex((b) => b.id === blockId);
        if (index === -1) return;

        const targetIndex = direction === "up" ? index - 1 : index + 1;
        if (targetIndex < 0 || targetIndex >= currentPage.blocks.length) return;

        const newBlocks = [...currentPage.blocks];
        const temp = newBlocks[index];
        newBlocks[index] = newBlocks[targetIndex];
        newBlocks[targetIndex] = temp;

        setPages(
            pages.map((p) =>
                p.id === selectedPageId ? { ...p, blocks: newBlocks } : p
            )
        );
    };

    // Block Deletion
    const handleDeleteBlock = (blockId: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setPages(
            pages.map((p) =>
                p.id === selectedPageId
                    ? { ...p, blocks: p.blocks.filter((b) => b.id !== blockId) }
                    : p
            )
        );
    };

    // Convert Image to WebP (Simple Client-side)
    const convertToWebP = async (file: File): Promise<File> => {
        if (!file.type.startsWith('image/') || file.type === 'image/webp') return file;
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext('2d');
                ctx?.drawImage(img, 0, 0);
                canvas.toBlob((blob) => {
                    if (blob) {
                        resolve(new File([blob], file.name.replace(/\.[^/.]+$/, "") + ".webp", { type: 'image/webp' }));
                    } else resolve(file);
                }, 'image/webp', 0.8);
            };
            img.src = URL.createObjectURL(file);
        });
    };

    // File Upload Handler (Supabase Storage)
    const handleFilesSelected = async (files: FileList) => {
        toast.info(`Uploading ${files.length} file(s)...`);
        
        for (const rawFile of Array.from(files)) {
            let file = rawFile;
            
            // WebP Conversion for images
            if (file.type.startsWith('image/')) {
                file = await convertToWebP(file);
            }

            let type: "image" | "pdf" | "video" = "image";
            if (file.type.startsWith("video/")) type = "video";
            else if (file.type === "application/pdf") type = "pdf";

            const fileExt = file.name.split('.').pop();
            const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
            const filePath = `cms-uploads/${fileName}`;

            // Upload to Supabase Storage Bucket 'media'
            const { error: uploadError } = await supabase.storage.from('media').upload(filePath, file);
            
            if (uploadError) {
                toast.error(`Upload failed for ${file.name}: ${uploadError.message}`);
                continue;
            }

            const { data: { publicUrl } } = supabase.storage.from('media').getPublicUrl(filePath);

            let sizeStr = "";
            const bytes = file.size;
            if (bytes < 1024) sizeStr = `${bytes} B`;
            else if (bytes < 1024 * 1024) sizeStr = `${(bytes / 1024).toFixed(1)} KB`;
            else sizeStr = `${(bytes / (1024 * 1024)).toFixed(1)} MB`;

            const newMedia = {
                id: `m-${Date.now()}`,
                name: file.name,
                type,
                size: sizeStr,
                url: publicUrl
            };

            await supabase.from('cms_media').insert(newMedia);
        }
        toast.success(`Uploads complete`);
    };

    const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); };
    const handleDragLeave = () => { setIsDragging(false); };
    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault(); setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleFilesSelected(e.dataTransfer.files);
        }
    };

    const handleDeleteMedia = async (id: string, url: string) => {
        // Extract filePath from URL if needed to delete from storage, but for now just delete DB record
        await supabase.from('cms_media').delete().eq('id', id);
        toast.success("Asset deleted");
    };

    // Blog Management
    const handleAddBlogPost = async () => {
        if (!newBlogTitle.trim()) return;
        const newPost = {
            id: `b-${Date.now()}`,
            title: newBlogTitle.trim(),
            author: "Admin",
            date: new Date().toISOString().split("T")[0],
            status: "Draft" as const,
            content: "<p>Start writing your blog post...</p>"
        };
        const { error } = await supabase.from('cms_blogs').insert(newPost);
        if (error) { toast.error("Failed to create blog post"); return; }
        
        setNewBlogTitle("");
        toast.success(`Draft "${newPost.title}" created`);
        setEditingBlogId(newPost.id);
        setBlogContent(newPost.content);
    };

    const handleDeleteBlog = async (id: string) => {
        await supabase.from('cms_blogs').delete().eq('id', id);
        if (editingBlogId === id) setEditingBlogId(null);
        toast.error(`Blog post deleted`);
    };

    const handleSaveBlogContent = async () => {
        if (!editingBlogId) return;
        const { error } = await supabase.from('cms_blogs').update({ content: blogContent }).eq('id', editingBlogId);
        if (error) { toast.error("Failed to save content"); return; }
        toast.success("Blog content saved successfully");
    };

    // Nav Links Management
    const handleAddNavLink = async () => {
        if (!newNavLink.label || !newNavLink.to_path) return;
        const newLink = {
            id: `n-${Date.now()}`,
            label: newNavLink.label,
            to_path: newNavLink.to_path,
        };
        await supabase.from('cms_nav_links').insert(newLink);
        toast.success(`Link "${newNavLink.label}" added`);
        setNewNavLink({ label: "", to_path: "" });
    };

    const handleDeleteNavLink = async (id: string) => {
        await supabase.from('cms_nav_links').delete().eq('id', id);
        toast.error(`Link removed`);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
        >
            <div className="flex items-center justify-between gap-4">
                <div>
                    <h1 className="font-display text-2xl font-bold tracking-tight">CMS Website Engine (Realtime)</h1>
                    <p className="text-xs text-muted-foreground mt-1">
                        Manage pages, layout blocks, assets, and navigation menus effortlessly.
                    </p>
                </div>
                <div className="hidden sm:flex items-center gap-1.5 rounded-full bg-white/5 border border-white/5 px-3 py-1.5 text-[10px] font-bold text-muted-foreground">
                    <FileText className="h-3.5 w-3.5" />
                    {pages.length} Pages Live
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-4">
                {/* Sidebar */}
                <div className="space-y-4">
                    {/* Page Manager */}
                    <div className="rounded-2xl border border-white/10 bg-card/40 p-4 backdrop-blur-xl">
                        <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 flex items-center justify-between">
                            <span>Active Pages</span>
                            <button
                                onClick={() => setIsCreatePageModalOpen(true)}
                                className="flex items-center justify-center p-1 rounded hover:bg-white/5 text-brand-magenta transition-colors cursor-pointer"
                                title="Create Page"
                            >
                                <Plus className="h-4 w-4" />
                            </button>
                        </div>
                        <div className="relative mb-3">
                            <Search className="absolute left-2.5 top-1/2 h-3 w-3 -translate-y-1/2 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="Search pages..."
                                value={pageSearchText}
                                onChange={(e) => setPageSearchText(e.target.value)}
                                className="w-full rounded-lg border border-border bg-background/50 pl-8 pr-2.5 py-1 text-[11px] focus:outline-none text-foreground"
                            />
                        </div>
                        <div className="space-y-1.5 max-h-[220px] overflow-y-auto pr-1">
                            {filteredPages.map((p) => (
                                <div key={p.id} className="group relative w-full">
                                    <button
                                        onClick={() => setSelectedPageId(p.id)}
                                        className={`w-full flex items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold transition-all cursor-pointer ${
                                            selectedPageId === p.id
                                                ? "bg-white/10 text-foreground border-l-2 border-brand-magenta"
                                                : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                                        }`}
                                    >
                                        <span className="truncate pr-5">{p.name}</span>
                                        <span className="text-[9px] font-mono text-muted-foreground opacity-60 group-hover:opacity-0 transition-opacity truncate shrink-0">
                                            {p.path}
                                        </span>
                                    </button>
                                    <button
                                        onClick={(e) => handleDeletePage(p.id, e)}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-muted-foreground hover:text-rose-400 bg-card/90 backdrop-blur-sm border border-white/5 transition-opacity cursor-pointer shadow"
                                        title="Delete Page"
                                    >
                                        <Trash2 className="h-3 w-3" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Blog posts list manager */}
                    <div className="rounded-2xl border border-white/10 bg-card/40 p-4 backdrop-blur-xl">
                        <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
                            Blog & News Feed
                        </div>
                        <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1">
                            {blogList.map((blog) => (
                                <div key={blog.id} className="flex items-center justify-between rounded-xl bg-white/5 p-2.5 text-[11px]">
                                    <div className="overflow-hidden mr-2">
                                        <p className="font-semibold truncate leading-snug text-foreground">{blog.title}</p>
                                        <span className="text-[9px] text-muted-foreground">{blog.date} • {blog.status}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <button onClick={() => { setEditingBlogId(blog.id); setBlogContent(blog.content || ""); }} className="text-muted-foreground hover:text-brand-cyan p-1 shrink-0 cursor-pointer">
                                            <Edit3 className="h-3.5 w-3.5" />
                                        </button>
                                        <button onClick={() => handleDeleteBlog(blog.id)} className="text-muted-foreground hover:text-rose-400 p-1 shrink-0 cursor-pointer">
                                            <Trash2 className="h-3.5 w-3.5" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-3 flex gap-2">
                            <input
                                type="text"
                                placeholder="New post title..."
                                value={newBlogTitle}
                                onChange={(e) => setNewBlogTitle(e.target.value)}
                                className="flex-1 rounded-lg border border-border bg-background px-2.5 py-1.5 text-[11px] text-foreground focus:outline-none focus:border-brand-magenta transition-colors"
                            />
                            <button
                                onClick={handleAddBlogPost}
                                className="rounded-lg bg-brand-magenta text-white px-3 text-[11px] font-bold hover:opacity-90 transition cursor-pointer"
                            >
                                Add
                            </button>
                        </div>
                    </div>
                </div>

                {/* Editor Area */}
                <div className="lg:col-span-2 space-y-6">
                    {editingBlogId ? (
                        <div className="rounded-2xl border border-white/10 bg-card/40 p-5 backdrop-blur-xl">
                            <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-3">
                                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                    Rich Text Editor (Blog)
                                </h3>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => setEditingBlogId(null)}
                                        className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-white/10 text-muted-foreground hover:bg-white/5"
                                    >
                                        Close
                                    </button>
                                    <button
                                        onClick={handleSaveBlogContent}
                                        className="flex items-center gap-1.5 text-xs font-semibold px-4 py-1.5 rounded-lg bg-brand-magenta text-white hover:opacity-90"
                                    >
                                        <Save className="h-3.5 w-3.5" /> Save Post
                                    </button>
                                </div>
                            </div>
                            <div className="bg-white rounded-lg overflow-hidden">
                                <Editor
                                    apiKey="no-api-key"
                                    value={blogContent}
                                    onEditorChange={(newContent) => setBlogContent(newContent)}
                                    init={{
                                        height: 400,
                                        menubar: false,
                                        plugins: [
                                            'advlist autolink lists link image charmap print preview anchor',
                                            'searchreplace visualblocks code fullscreen',
                                            'insertdatetime media table paste code help wordcount'
                                        ],
                                        toolbar: 'undo redo | formatselect | bold italic backcolor | \
                                        alignleft aligncenter alignright alignjustify | \
                                        bullist numlist outdent indent | removeformat | help'
                                    }}
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="rounded-2xl border border-white/10 bg-card/40 p-5 backdrop-blur-xl">
                            <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-3 gap-2">
                                <div>
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                            Visual Editor Canvas
                                        </h3>
                                        {unsavedChangesCount > 0 && (
                                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20 animate-pulse">
                                                <span className="h-1 w-1 rounded-full bg-amber-400"></span>
                                                {unsavedChangesCount} unsaved
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-[10px] text-muted-foreground mt-0.5">
                                        Selected page: <span className="text-foreground font-semibold">{selectedPage?.name || ""}</span>
                                    </p>
                                </div>
                                <button
                                    onClick={handleSavePage}
                                    className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-semibold text-white shadow-md transition-all cursor-pointer ${
                                        showSavedFeedback ? "bg-emerald-600" : "bg-linear-to-r from-brand-magenta to-brand-blue hover:scale-[1.02]"
                                    }`}
                                >
                                    {showSavedFeedback ? <><Check className="h-3.5 w-3.5" /> Saved!</> : <><Save className="h-3.5 w-3.5" /> Save layout</>}
                                </button>
                            </div>

                            <div className="border border-white/5 bg-background/50 rounded-xl p-4 space-y-4 max-h-[380px] overflow-y-auto min-h-[300px]">
                                {selectedPage?.blocks?.map((block, index) => (
                                    <div key={block.id} className="group relative border border-dashed border-white/10 hover:border-brand-magenta/40 p-4 rounded-xl transition">
                                        <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition flex items-center gap-1.5 z-10 bg-card/90 backdrop-blur-sm p-1 rounded-lg border border-white/10 shadow">
                                            <button disabled={index === 0} onClick={(e) => handleMoveBlock(block.id, "up", e)} className="text-muted-foreground hover:text-foreground disabled:opacity-30 p-1 cursor-pointer"><ChevronUp className="h-3.5 w-3.5" /></button>
                                            <button disabled={index === (selectedPage.blocks.length - 1)} onClick={(e) => handleMoveBlock(block.id, "down", e)} className="text-muted-foreground hover:text-foreground disabled:opacity-30 p-1 cursor-pointer"><ChevronDown className="h-3.5 w-3.5" /></button>
                                            <button onClick={(e) => handleDeleteBlock(block.id, e)} className="text-muted-foreground hover:text-rose-400 p-1 cursor-pointer"><Trash2 className="h-3.5 w-3.5" /></button>
                                            <span className="text-[9px] uppercase font-mono bg-white/10 px-1.5 py-0.5 rounded text-muted-foreground">{block.type}</span>
                                        </div>

                                        {block.type === "header" && <h2 className="font-display text-xl font-bold tracking-tight text-gradient">{block.content}</h2>}
                                        {block.type === "text" && <div className="text-xs text-muted-foreground leading-relaxed" dangerouslySetInnerHTML={{ __html: block.content }} />}
                                        {block.type === "button" && (
                                            <div className="pt-2">
                                                <span className="inline-flex rounded-full bg-gradient-brand px-4 py-1.5 text-[11px] font-bold text-white shadow">{block.content}</span>
                                                <span className="ml-2 text-[9px] text-muted-foreground font-mono">({block.meta})</span>
                                            </div>
                                        )}
                                        {block.type === "media" && (
                                            <div className="my-2 rounded-lg overflow-hidden border border-white/5 bg-black/20 max-h-48 flex items-center justify-center p-2">
                                                {block.content ? <img src={block.content} className="max-h-40 object-contain rounded" alt="CMS Media Block" /> : <div className="p-8 text-xs text-muted-foreground flex items-center gap-1.5"><AlertCircle className="h-3.5 w-3.5" /> No image source URL</div>}
                                            </div>
                                        )}

                                        <div className="mt-3 hidden group-hover:block border-t border-white/5 pt-3">
                                            {block.type === "text" ? (
                                                <div className="bg-white rounded-lg overflow-hidden mt-2">
                                                    <Editor
                                                        apiKey="no-api-key"
                                                        value={block.content}
                                                        onEditorChange={(newContent) => handleUpdateBlockContent(block.id, newContent)}
                                                        init={{ height: 200, menubar: false, plugins: ['link textcolor'], toolbar: 'bold italic underline | link' }}
                                                    />
                                                </div>
                                            ) : (
                                                <>
                                                    <label className="block text-[10px] text-muted-foreground mb-1 uppercase tracking-wider">{block.type === "media" ? "Media URL" : "Edit Content"}</label>
                                                    <input type="text" value={block.content} onChange={(e) => handleUpdateBlockContent(block.id, e.target.value)} className="w-full rounded-lg border border-border bg-card px-3 py-1.5 text-xs text-foreground focus:outline-none focus:border-brand-magenta transition-colors" />
                                                </>
                                            )}
                                            {block.type === "button" && (
                                                <div className="mt-2">
                                                    <label className="block text-[10px] text-muted-foreground mb-1 uppercase tracking-wider">Button Link (to)</label>
                                                    <input type="text" value={block.meta || ""} onChange={(e) => handleUpdateBlockMeta(block.id, e.target.value)} className="w-full rounded-lg border border-border bg-card px-3 py-1.5 text-xs text-foreground focus:outline-none focus:border-brand-magenta transition-colors" />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                                {(!selectedPage || !selectedPage.blocks || selectedPage.blocks.length === 0) && (
                                    <div className="flex flex-col items-center justify-center text-center py-12 text-muted-foreground">
                                        <Inbox className="h-8 w-8 mb-2 opacity-40" />
                                        <p className="text-xs font-semibold">No blocks on this page layout</p>
                                    </div>
                                )}
                            </div>

                            <div className="mt-4 border-t border-white/5 pt-4">
                                <span className="block text-[10px] uppercase font-bold text-muted-foreground mb-2.5 tracking-wider">Insert Layout Block</span>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                    {['header', 'text', 'button', 'media'].map(type => (
                                        <button key={type} onClick={() => handleAddBlock(type as any)} className="flex items-center justify-center gap-1.5 rounded-xl border border-white/10 hover:border-brand-magenta/40 bg-white/5 hover:bg-white/10 px-3 py-2 text-xs font-semibold text-foreground transition cursor-pointer capitalize">
                                            <Plus className="h-3.5 w-3.5 text-brand-magenta" /> {type}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Media Library & Menus */}
                <div className="space-y-4">
                    <div className="rounded-2xl border border-white/10 bg-card/40 p-4 backdrop-blur-xl flex flex-col">
                        <div className="flex items-center justify-between mb-3 gap-2">
                            <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Media Library</div>
                            <button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-1.5 rounded-lg bg-white/5 border border-white/5 px-2.5 py-1 text-[10px] hover:bg-white/10 font-bold transition cursor-pointer shrink-0">
                                <Upload className="h-3 w-3 text-brand-cyan" /> Upload
                            </button>
                            <input type="file" ref={fileInputRef} onChange={(e) => { if (e.target.files) handleFilesSelected(e.target.files); }} multiple accept="image/*,application/pdf,video/*" className="hidden" />
                        </div>

                        <div className="relative mb-3">
                            <Search className="absolute left-2.5 top-1/2 h-3 w-3 -translate-y-1/2 text-muted-foreground" />
                            <input type="text" placeholder="Search library..." value={mediaSearchText} onChange={(e) => setMediaSearchText(e.target.value)} className="w-full rounded-lg border border-border bg-background/50 pl-8 pr-2.5 py-1 text-[11px] focus:outline-none text-foreground" />
                        </div>

                        <div onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop} className={`border border-dashed rounded-xl p-3 mb-3 text-center transition-all flex flex-col items-center justify-center min-h-[90px] ${isDragging ? "border-brand-magenta bg-brand-magenta/10 scale-[0.98]" : "border-white/10 hover:border-brand-magenta/30 bg-background/20"}`}>
                            <Upload className={`h-5 w-5 mb-1.5 ${isDragging ? "animate-bounce text-brand-magenta" : "text-muted-foreground"}`} />
                            <p className="text-[10px] font-semibold">{isDragging ? "Drop to upload!" : "Drag files here (WebP auto-convert)"}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto pr-1">
                            {filteredMediaList.map((file) => (
                                <div key={file.id} className="relative group rounded-lg border border-white/5 overflow-hidden bg-background">
                                    {file.type === "image" ? <img src={file.url} className="h-16 w-full object-cover" alt="" /> : <div className="h-16 w-full flex items-center justify-center bg-white/5 text-[10px] font-bold text-muted-foreground">{file.type.toUpperCase()}</div>}
                                    <div className="absolute inset-0 bg-black/75 opacity-0 group-hover:opacity-100 flex flex-col justify-between p-1 transition-all">
                                        <span className="text-[8px] text-white truncate font-semibold">{file.name}</span>
                                        {file.url && (
                                            <button onClick={() => { navigator.clipboard.writeText(file.url); toast.success("Copied!"); }} className="bg-brand-blue text-white rounded px-1.5 py-0.5 text-[8px] mx-auto cursor-pointer">
                                                Copy Link
                                            </button>
                                        )}
                                        <div className="flex items-center justify-between mt-auto">
                                            <span className="text-[7px] text-white/70">{file.size}</span>
                                            <Trash2 className="h-3 w-3 text-rose-400 cursor-pointer" onClick={() => handleDeleteMedia(file.id, file.url)} />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-card/40 p-4 backdrop-blur-xl">
                        <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">Header Navigation Menu</div>
                        <div className="space-y-1.5 max-h-36 overflow-y-auto mb-3 pr-1">
                            {headerLinks.map((link) => (
                                <div key={link.id} className="flex items-center justify-between rounded-xl bg-white/5 px-3 py-1.5 text-[11px]">
                                    <span className="font-semibold">{link.label}</span>
                                    <span className="font-mono text-muted-foreground text-[9px]">{link.to_path}</span>
                                    <Trash2 className="h-3 w-3 text-muted-foreground hover:text-rose-400 cursor-pointer" onClick={() => handleDeleteNavLink(link.id)} />
                                </div>
                            ))}
                        </div>
                        <div className="space-y-2 border-t border-white/5 pt-3">
                            <div className="grid grid-cols-2 gap-1.5">
                                <input type="text" placeholder="Label" value={newNavLink.label} onChange={(e) => setNewNavLink({ ...newNavLink, label: e.target.value })} className="rounded-lg border bg-background px-2 py-1 text-[10px] focus:outline-none" />
                                <input type="text" placeholder="Route" value={newNavLink.to_path} onChange={(e) => setNewNavLink({ ...newNavLink, to_path: e.target.value })} className="rounded-lg border bg-background px-2 py-1 text-[10px] focus:outline-none" />
                            </div>
                            <button onClick={handleAddNavLink} className="w-full rounded-lg bg-brand-blue text-white py-1.5 text-[10px] font-bold hover:opacity-90">Add Navigation Link</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Create Page Modal */}
            <AnimatePresence>
                {isCreatePageModalOpen && (
                    <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-card border border-white/10 rounded-2xl p-6 max-w-sm w-full shadow-elegant space-y-4">
                            <div className="flex items-center justify-between border-b border-white/5 pb-3">
                                <h3 className="font-display font-bold text-sm tracking-tight">Create New CMS Page</h3>
                                <button onClick={() => setIsCreatePageModalOpen(false)} className="text-muted-foreground hover:text-foreground"><X className="h-4 w-4" /></button>
                            </div>
                            <form onSubmit={handleCreatePageSubmit} className="space-y-4">
                                <div><label className="block text-[10px] font-bold text-muted-foreground mb-1.5 uppercase">Page Name</label><input type="text" value={newPageName} onChange={(e) => setNewPageName(e.target.value)} className="w-full rounded-xl border bg-background px-3.5 py-2 text-xs focus:outline-none" required /></div>
                                <div><label className="block text-[10px] font-bold text-muted-foreground mb-1.5 uppercase">Page Path</label><input type="text" value={newPagePath} onChange={(e) => setNewPagePath(e.target.value)} className="w-full rounded-xl border bg-background px-3.5 py-2 text-xs focus:outline-none" required /></div>
                                <div className="flex items-center gap-2 pt-2">
                                    <button type="button" onClick={() => setIsCreatePageModalOpen(false)} className="flex-1 rounded-xl border border-white/10 py-2.5 text-xs font-semibold">Cancel</button>
                                    <button type="submit" className="flex-1 rounded-xl bg-brand-magenta text-white py-2.5 text-xs font-semibold">Create Page</button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}