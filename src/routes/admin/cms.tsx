import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo, useRef, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { logAudit } from "@/lib/logAudit";
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
    Edit3,
    Globe,
    Layers,
    Monitor,
    Tablet,
    Smartphone,
    RotateCcw,
    Copy,
    Tag,
    Compass,
    Settings,
    BookOpen,
    Folder,
    ExternalLink,
    Archive
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
    title: string;
    slug: string;
    is_published: boolean;
    blocks: PageBlock[];
    meta_title?: string;
    meta_description?: string;
    canonical_url?: string;
    og_image_url?: string;
    show_in_nav?: boolean;
    nav_order?: number;
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
    category?: string;
    tags?: string;
}

interface BackgroundConfig {
    id: string;
    section: string;
    bg_type: string;
    solid_color: string;
    gradient_direction: string;
    gradient_color_1: string;
    gradient_color_2: string;
    image_desktop: string;
    image_tablet: string;
    image_mobile: string;
    video_desktop: string;
    video_tablet: string;
    video_mobile: string;
    overlay_color: string;
    overlay_opacity: number;
    overlay_blend_mode: string;
    parallax: boolean;
    attachment: string;
    sizing: string;
    custom_position: string;
    pattern_type: string;
    is_active: boolean;
    created_at?: string;
    updated_at?: string;
}

/* ───────────────── COMPONENT ───────────────── */

function AdminCMS() {
    // Premium Tab State
    const [activeTab, setActiveTab] = useState<'pages' | 'blog' | 'navigation' | 'media' | 'backgrounds'>('pages');

    const [pages, setPages] = useState<CMSPage[]>([]);
    const [savedPages, setSavedPages] = useState<CMSPage[]>([]);
    const [selectedPageId, setSelectedPageId] = useState<string>("");
    const [expandedSeoPageId, setExpandedSeoPageId] = useState<string | null>(null);
    const [dbWarning, setDbWarning] = useState<boolean>(false);
    const [pageStatusTab, setPageStatusTab] = useState<'all' | 'active' | 'draft' | 'archived'>('all');
    
    // Page Manager Handlers
    const handleTogglePublish = async (pageId: string, currentStatus: boolean, e: React.MouseEvent) => {
        e.stopPropagation();
        try {
            const { error } = await supabase.from('pages').update({ is_published: !currentStatus }).eq('id', pageId);
            if (error) throw error;
            await logAudit(`Changed page publish status to ${!currentStatus}`, "page", pageId);
            toast.success(`Page ${!currentStatus ? 'published' : 'unpublished'}`);
            setPages(pages.map(p => p.id === pageId ? { ...p, is_published: !currentStatus } : p));
            setSavedPages(savedPages.map(p => p.id === pageId ? { ...p, is_published: !currentStatus } : p));
        } catch (err: any) {
            toast.error(`Failed to update publish status: ${err.message}`);
        }
    };

    const handleToggleArchive = async (pageId: string, currentArchiveStatus: boolean, e: React.MouseEvent) => {
        e.stopPropagation();
        try {
            const { error } = await supabase.from('pages').update({ is_archived: !currentArchiveStatus }).eq('id', pageId);
            if (error) throw error;
            toast.success(`Page ${!currentArchiveStatus ? 'archived' : 'restored'}`);
            setPages(pages.map(p => p.id === pageId ? { ...p, is_archived: !currentArchiveStatus } : p));
            setSavedPages(savedPages.map(p => p.id === pageId ? { ...p, is_archived: !currentArchiveStatus } : p));
        } catch (err: any) {
            toast.error(`Failed to update archive status: ${err.message}`);
        }
    };

    // Duplicate Page
    const handleDuplicatePage = async (page: CMSPage, e: React.MouseEvent) => {
        e.stopPropagation();
        try {
            const timestamp = Date.now().toString().slice(-4);
            const rawSlug = page.slug.replace(/^\//, '');
            const newSlug = `/${rawSlug}-copy-${timestamp}`;
            const newTitle = `${page.title} (Copy)`;
            
            const newPageData = {
                title: newTitle,
                slug: newSlug,
                is_published: false,
                blocks: page.blocks,
                meta_title: page.meta_title ? `${page.meta_title} (Copy)` : null,
                meta_description: page.meta_description,
                canonical_url: page.canonical_url,
                og_image_url: page.og_image_url
            };

            const { data, error } = await supabase.from('pages').insert(newPageData).select().single();
            if (error) throw error;

            const createdPage = { ...data, blocks: data.blocks || page.blocks };
            setPages(prev => [...prev, createdPage]);
            setSelectedPageId(createdPage.id);
            toast.success(`Duplicated page as "${newTitle}"`);
            await logAudit(`Duplicated page ${page.title} as ${newTitle}`, "page", createdPage.id);
        } catch (err: any) {
            toast.error(`Failed to duplicate page: ${err.message}`);
        }
    };

    // Media Library State
    const [mediaList, setMediaList] = useState<MediaFile[]>([]);
    const [isDragging, setIsDragging] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [autoConvertToWebP, setAutoConvertToWebP] = useState(true);
    const [mediaTypeFilter, setMediaTypeFilter] = useState<'all' | 'image' | 'video' | 'pdf'>('all');
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Blog & Navigation States
    const [blogList, setBlogList] = useState<BlogPost[]>([]);
    const [newBlogTitle, setNewBlogTitle] = useState("");
    const [editingBlogId, setEditingBlogId] = useState<string | null>(null);
    const [blogContent, setBlogContent] = useState("");
    const [blogCategory, setBlogCategory] = useState("General");
    const [blogTags, setBlogTags] = useState("");
    const [blogStatus, setBlogStatus] = useState<"Published" | "Draft">("Draft");

    // Nav Links (Header vs Footer)
    const [navLinks, setNavLinks] = useState<{ id: string; label: string; to_path: string; position?: string }[]>([]);
    const [newNavLink, setNewNavLink] = useState({ label: "", to_path: "", position: "header" });
    const [showLabelDropdown, setShowLabelDropdown] = useState(false);
    const labelDropdownRef = useRef<HTMLDivElement>(null);

    // Modals & Feedback UI States
    const [isCreatePageModalOpen, setIsCreatePageModalOpen] = useState(false);
    const [newPageTitle, setNewPageTitle] = useState("");
    const [newPageSlug, setNewPageSlug] = useState("");
    const [showSavedFeedback, setShowSavedFeedback] = useState(false);

    // Background State
    const [backgrounds, setBackgrounds] = useState<BackgroundConfig[]>([]);

    // Search Filter States
    const [pageSearchText, setPageSearchText] = useState("");
    const [mediaSearchText, setMediaSearchText] = useState("");
    const [blogSearchText, setBlogSearchText] = useState("");

    // Fetch All Data
    const fetchInitialData = async () => {
        try {
            const { data: pagesData } = await supabase.from('pages').select('*');
            if (pagesData && pagesData.length > 0) {
                const mappedPages = pagesData.map(p => ({ ...p, blocks: p.blocks || [] }));
                setPages(mappedPages);
                setSavedPages(mappedPages);
                if (!selectedPageId) setSelectedPageId(mappedPages[0].id);
            }

            const { data: mediaData } = await supabase.from('cms_media').select('*').order('created_at', { ascending: false });
            if (mediaData) setMediaList(mediaData);

            const { data: blogsData } = await supabase.from('cms_blogs').select('*').order('created_at', { ascending: false });
            if (blogsData) setBlogList(blogsData);

            const { data: navData } = await supabase.from('cms_nav_links').select('*').order('created_at', { ascending: true });
            if (navData) setNavLinks(navData);

            const { data: bgData } = await supabase.from('cms_backgrounds').select('*').order('created_at', { ascending: true });
            if (bgData) setBackgrounds(bgData);
        } catch (error: any) {
            console.error("Error fetching CMS data:", error);
            if (error.message && (error.message.includes("column") || error.message.includes("relation"))) {
                setDbWarning(true);
            }
        }
    };

    useEffect(() => {
        fetchInitialData();

        const channel = supabase.channel('cms-sync')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'pages' }, fetchInitialData)
            .on('postgres_changes', { event: '*', schema: 'public', table: 'cms_media' }, fetchInitialData)
            .on('postgres_changes', { event: '*', schema: 'public', table: 'cms_blogs' }, fetchInitialData)
            .on('postgres_changes', { event: '*', schema: 'public', table: 'cms_nav_links' }, fetchInitialData)
            .on('postgres_changes', { event: '*', schema: 'public', table: 'cms_backgrounds' }, fetchInitialData)
            .subscribe();

        return () => { supabase.removeChannel(channel); };
    }, []);

    // Close label dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (labelDropdownRef.current && !labelDropdownRef.current.contains(e.target as Node)) {
                setShowLabelDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Selected Page Derived
    const selectedPage = useMemo(() => {
        return pages.find((p) => p.id === selectedPageId) || pages[0];
    }, [pages, selectedPageId]);

    // Unsaved Changes Count Computation
    const unsavedChangesCount = useMemo(() => {
        let count = 0;
        pages.forEach((p) => {
            const saved = savedPages.find((sp) => sp.id === p.id);
            if (!saved) {
                count++;
            } else {
                if (
                    saved.title !== p.title || 
                    saved.slug !== p.slug ||
                    (saved.meta_title || '') !== (p.meta_title || '') ||
                    (saved.meta_description || '') !== (p.meta_description || '') ||
                    (saved.canonical_url || '') !== (p.canonical_url || '') ||
                    (saved.og_image_url || '') !== (p.og_image_url || '')
                ) {
                    count++;
                } else {
                    if ((saved.blocks?.length || 0) !== (p.blocks?.length || 0)) {
                        count++;
                    } else if (p.blocks && saved.blocks) {
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
                count++;
            }
        });
        return count;
    }, [pages, savedPages]);

    // Update SEO settings fields locally
    const handleUpdatePageSeo = (pageId: string, field: 'meta_title' | 'meta_description' | 'canonical_url' | 'og_image_url' | 'show_in_nav' | 'nav_order', value: any) => {
        setPages(pages.map(p => p.id === pageId ? { ...p, [field]: value } : p));
    };

    // Save individual page SEO settings directly to Supabase
    const handleSavePageSeo = async (pageId: string) => {
        const page = pages.find(p => p.id === pageId);
        if (!page) return;
        try {
            const { error } = await supabase
                .from('pages')
                .update({
                    meta_title: page.meta_title || null,
                    meta_description: page.meta_description || null,
                    canonical_url: page.canonical_url || null,
                    og_image_url: page.og_image_url || null,
                    show_in_nav: page.show_in_nav || false,
                    nav_order: page.nav_order || 0
                })
                .eq('id', pageId);
            
            if (error) throw error;
            
            setSavedPages(savedPages.map(sp => sp.id === pageId ? { 
                ...sp, 
                meta_title: page.meta_title,
                meta_description: page.meta_description,
                canonical_url: page.canonical_url,
                og_image_url: page.og_image_url,
                show_in_nav: page.show_in_nav,
                nav_order: page.nav_order
            } : sp));

            toast.success(`Settings for "${page.title}" saved successfully!`);
        } catch (err: any) {
            toast.error(`Failed to save Settings: ${err.message}`);
        }
    };

    // Filters
    const filteredPages = useMemo(() => {
        return pages
            .filter((p) => {
                const isArchived = (p as any).is_archived === true;
                if (pageStatusTab === 'all') return true;
                if (pageStatusTab === 'active') return p.is_published && !isArchived;
                if (pageStatusTab === 'draft') return !p.is_published && !isArchived;
                if (pageStatusTab === 'archived') return isArchived;
                return true;
            })
            .filter((p) =>
                p.title.toLowerCase().includes(pageSearchText.toLowerCase()) ||
                p.slug.toLowerCase().includes(pageSearchText.toLowerCase())
            );
    }, [pages, pageSearchText, pageStatusTab]);

    const filteredMediaList = useMemo(() => {
        return mediaList
            .filter((m) => m.name.toLowerCase().includes(mediaSearchText.toLowerCase()))
            .filter((m) => {
                if (mediaTypeFilter === 'all') return true;
                return m.type === mediaTypeFilter;
            });
    }, [mediaList, mediaSearchText, mediaTypeFilter]);

    const filteredBlogs = useMemo(() => {
        return blogList.filter((b) => 
            b.title.toLowerCase().includes(blogSearchText.toLowerCase()) ||
            (b.category && b.category.toLowerCase().includes(blogSearchText.toLowerCase())) ||
            (b.tags && b.tags.toLowerCase().includes(blogSearchText.toLowerCase()))
        );
    }, [blogList, blogSearchText]);

    // Visual Canvas Block Handlers
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

    const handleSavePage = async () => {
        for (const page of pages) {
            const { error } = await supabase
                .from('pages')
                .upsert({ 
                    id: page.id, 
                    title: page.title, 
                    slug: page.slug, 
                    is_published: page.is_published, 
                    blocks: page.blocks,
                    meta_title: page.meta_title || null,
                    meta_description: page.meta_description || null,
                    canonical_url: page.canonical_url || null,
                    og_image_url: page.og_image_url || null
                }, { onConflict: 'id' });
            if (error) {
                toast.error(`Failed to save page ${page.title}`);
                return;
            }
        }
        
        for (const sp of savedPages) {
            if (!pages.some(p => p.id === sp.id)) {
                await supabase.from('pages').delete().eq('id', sp.id);
            }
        }

        setSavedPages(pages);
        setShowSavedFeedback(true);
        toast.success(`Published layouts for all ${pages.length} pages to production!`);
        setTimeout(() => {
            setShowSavedFeedback(false);
        }, 2000);
    };

    const handleCreatePageSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const trimmedTitle = newPageTitle.trim();
        let trimmedSlug = newPageSlug.trim();

        if (!trimmedTitle || !trimmedSlug) return;
        if (!trimmedSlug.startsWith("/")) trimmedSlug = "/" + trimmedSlug;

        if (pages.some((p) => p.slug.toLowerCase() === trimmedSlug.toLowerCase())) {
            toast.error(`A page with route slug "${trimmedSlug}" already exists.`);
            return;
        }

        const newPageData = {
            title: trimmedTitle,
            slug: trimmedSlug,
            is_published: false,
            blocks: [
                { id: `b-h-${Date.now()}`, type: "header", content: `Welcome to ${trimmedTitle}` },
                { id: `b-t-${Date.now()}`, type: "text", content: "This is a brand new page. Customize your text here." }
            ]
        };

        const { data, error } = await supabase.from('pages').insert(newPageData).select().single();
        if (error || !data) {
            toast.error(`Failed to create page on server: ${error?.message || 'Unknown error'}`);
            return;
        }

        const newPage = { ...data, blocks: data.blocks || newPageData.blocks };
        setPages([...pages, newPage]);
        setSelectedPageId(newPage.id);
        setIsCreatePageModalOpen(false);
        setNewPageTitle("");
        setNewPageSlug("");
        toast.success(`Created page "${trimmedTitle}" successfully!`);
    };

    const handleDeletePage = async (pageId: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (pages.length <= 1) {
            toast.error("Cannot delete the only page in the CMS.");
            return;
        }

        const { error } = await supabase.from('pages').delete().eq('id', pageId);
        if (error) {
            toast.error("Failed to delete page");
            return;
        }

        const deletedPageTitle = pages.find((p) => p.id === pageId)?.title || "Page";
        const updatedPages = pages.filter((p) => p.id !== pageId);
        setPages(updatedPages);
        
        await logAudit(`Deleted page ${deletedPageTitle}`, "page", pageId);

        if (selectedPageId === pageId) {
            setSelectedPageId(updatedPages[0].id);
        }

        toast.error(`Deleted page "${deletedPageTitle}"`);
    };

    // Block Management
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

    // Client-side WebP Conversion Option
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
                }, 'image/webp', 0.85);
            };
            img.src = URL.createObjectURL(file);
        });
    };

    // File Upload Handler (Cloudinary)
    const handleFilesSelected = async (files: FileList) => {
        const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
        const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

        if (!cloudName || !uploadPreset) {
            toast.error("Missing Cloudinary credentials in .env.local (VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET)");
            return;
        }

        toast.info(`Uploading ${files.length} file(s)...`);
        setUploading(true);
        setUploadProgress(0);

        const filesArray = Array.from(files);
        for (let i = 0; i < filesArray.length; i++) {
            const rawFile = filesArray[i];
            let file = rawFile;
            
            // WebP Conversion if enabled
            if (autoConvertToWebP && file.type.startsWith('image/')) {
                file = await convertToWebP(file);
            }

            let type: "image" | "pdf" | "video" = "image";
            if (file.type.startsWith("video/")) type = "video";
            else if (file.type === "application/pdf") type = "pdf";

            const formData = new FormData();
            formData.append("file", file);
            formData.append("upload_preset", uploadPreset);

            try {
                const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
                    method: "POST",
                    body: formData,
                });

                if (!res.ok) {
                    const errorData = await res.json();
                    throw new Error(errorData.error?.message || "Cloudinary upload failed");
                }

                const data = await res.json();
                let publicUrl = data.secure_url;

                if (type === "image") {
                    const parts = publicUrl.split("/upload/");
                    if (parts.length === 2) {
                        publicUrl = `${parts[0]}/upload/f_webp,q_auto/${parts[1]}`;
                    }
                }

                let sizeStr = "";
                const bytes = file.size;
                if (bytes < 1024) sizeStr = `${bytes} B`;
                else if (bytes < 1024 * 1024) sizeStr = `${(bytes / 1024).toFixed(1)} KB`;
                else sizeStr = `${(bytes / (1024 * 1024)).toFixed(1)} MB`;

                const newMedia = {
                    name: file.name,
                    type,
                    size: sizeStr,
                    url: publicUrl
                };

                const { data: insertedData, error: dbError } = await supabase
                    .from('cms_media')
                    .insert(newMedia)
                    .select()
                    .single();

                if (dbError) throw dbError;
                setMediaList((prev) => [insertedData, ...prev]);
                toast.success(`${file.name} uploaded successfully`);
            } catch (err: any) {
                toast.error(`Upload failed for ${file.name}: ${err.message}`);
            }
            setUploadProgress(Math.round(((i + 1) / filesArray.length) * 100));
        }
        
        setUploading(false);
        setUploadProgress(100);
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
        setMediaList((prev) => prev.filter((m) => m.id !== id));
        const { error } = await supabase.from('cms_media').delete().eq('id', id);
        if (error) {
            toast.error(`Failed to delete asset: ${error.message}`);
        } else {
            toast.success("Asset deleted");
        }
    };

    // Blog Management
    const handleAddBlogPost = async () => {
        const title = newBlogTitle.trim();
        if (!title) return;
        
        // Gracefully attempt with new columns first, fallback if DB not updated
        const payload: any = { title };
        if (!dbWarning) {
            payload.category = "General";
            payload.tags = "";
        }

        try {
            const { data, error } = await supabase.from('cms_blogs').insert(payload).select('*').single();
            if (error) throw error;
            
            setNewBlogTitle("");
            toast.success(`Draft "${title}" created`);
            setBlogList(prev => [data, ...prev]);
            setEditingBlogId(data.id);
            setBlogContent(data.content || "");
            setBlogCategory(data.category || "General");
            setBlogTags(data.tags || "");
            setBlogStatus("Draft");
        } catch (err: any) {
            // Fallback for missing columns
            if (err.message && err.message.includes("column")) {
                setDbWarning(true);
                const { data, error } = await supabase.from('cms_blogs').insert({ title }).select('*').single();
                if (error) {
                    toast.error("Failed to create blog post");
                    return;
                }
                setNewBlogTitle("");
                toast.success(`Draft "${title}" created (Fallback mode)`);
                setBlogList(prev => [data, ...prev]);
                setEditingBlogId(data.id);
                setBlogContent(data.content || "");
            } else {
                toast.error("Failed to create blog post");
            }
        }
    };

    const handleDeleteBlog = async (id: string) => {
        const { error } = await supabase.from('cms_blogs').delete().eq('id', id);
        if (error) { toast.error("Failed to delete blog post"); return; }
        setBlogList(prev => prev.filter(b => b.id !== id));
        if (editingBlogId === id) setEditingBlogId(null);
        toast.error(`Blog post deleted`);
    };

    const handleSaveBlogContent = async () => {
        if (!editingBlogId) return;

        const payload: any = { 
            content: blogContent,
            status: blogStatus
        };
        if (!dbWarning) {
            payload.category = blogCategory;
            payload.tags = blogTags;
        }

        try {
            const { error } = await supabase.from('cms_blogs').update(payload).eq('id', editingBlogId);
            if (error) throw error;
            toast.success("Blog post saved successfully");
            
            // Sync local blogList view
            setBlogList(prev => prev.map(b => b.id === editingBlogId ? { ...b, ...payload } : b));
        } catch (err: any) {
            if (err.message && err.message.includes("column")) {
                setDbWarning(true);
                // Try fallback (save content only)
                const { error } = await supabase.from('cms_blogs').update({ content: blogContent, status: blogStatus }).eq('id', editingBlogId);
                if (error) {
                    toast.error("Failed to save post");
                    return;
                }
                toast.success("Blog post saved successfully (Fallback mode)");
            } else {
                toast.error("Failed to save content");
            }
        }
    };

    // Nav Links Management (Header & Footer separation)
    const handleAddNavLink = async () => {
        const trimmedLabel = newNavLink.label.trim();
        let trimmedPath = newNavLink.to_path.trim();
        if (!trimmedLabel || !trimmedPath) return;
        if (!trimmedPath.startsWith('/')) trimmedPath = '/' + trimmedPath;

        const payload: any = {
            label: trimmedLabel,
            to_path: trimmedPath,
        };
        if (!dbWarning) {
            payload.position = newNavLink.position;
        }

        try {
            const { data, error } = await supabase.from('cms_nav_links').insert(payload).select('*').single();
            if (error) throw error;
            toast.success(`Link "${trimmedLabel}" added to ${newNavLink.position}`);
            setNavLinks(prev => [...prev, data]);
            setNewNavLink({ label: "", to_path: "", position: "header" });
        } catch (err: any) {
            if (err.message && err.message.includes("column")) {
                setDbWarning(true);
                // Fallback (ignore position column)
                const { data, error } = await supabase.from('cms_nav_links').insert({
                    label: trimmedLabel,
                    to_path: trimmedPath
                }).select('*').single();
                if (error) {
                    toast.error("Failed to add navigation link");
                    return;
                }
                toast.success(`Link "${trimmedLabel}" added (Fallback mode)`);
                setNavLinks(prev => [...prev, data]);
                setNewNavLink({ label: "", to_path: "", position: "header" });
            } else {
                toast.error("Failed to add nav link");
            }
        }
    };

    const handleDeleteNavLink = async (id: string) => {
        const { error } = await supabase.from('cms_nav_links').delete().eq('id', id);
        if (error) { toast.error("Failed to remove nav link"); return; }
        setNavLinks(prev => prev.filter(l => l.id !== id));
        toast.error(`Link removed`);
    };

    const headerLinks = useMemo(() => {
        return navLinks.filter(l => !l.position || l.position === 'header');
    }, [navLinks]);

    const footerLinks = useMemo(() => {
        return navLinks.filter(l => l.position === 'footer');
    }, [navLinks]);

    // ───────────────── BACKGROUND MANAGER (UNCHANGED LOGIC) ─────────────────
    const sections = ['global', 'hero', 'footer', 'cta'];
    const bgTypes = ['Color', 'Gradient', 'Image', 'Video', 'Pattern'];

    const bgTypeMap: Record<string, string> = { Color: 'solid', Gradient: 'gradient', Image: 'image', Video: 'video', Pattern: 'pattern' };
    const bgTypeReverse: Record<string, string> = { solid: 'Color', gradient: 'Gradient', image: 'Image', video: 'Video', pattern: 'Pattern' };

    const [selectedBgSection, setSelectedBgSection] = useState('global');

    const activeBg = useMemo(() => {
        return backgrounds.find(b => b.section === selectedBgSection) || null;
    }, [backgrounds, selectedBgSection]);

    const [draftBg, setDraftBg] = useState<BackgroundConfig | null>(null);
    const isNew = !activeBg;

    const handleBgFieldChange = (field: string, value: any) => {
        if (activeBg) {
            setBackgrounds(prev => prev.map(b => b.id === activeBg.id ? { ...b, [field]: value } : b));
        } else {
            setDraftBg(prev => prev ? { ...prev, [field]: value } : null);
        }
    };

    useEffect(() => {
        if (!activeBg && !draftBg) {
            setDraftBg({
                id: '', section: selectedBgSection, bg_type: 'solid', solid_color: 'var(--background)',
                gradient_direction: 'to right', gradient_color_1: '', gradient_color_2: '',
                image_desktop: '', image_tablet: '', image_mobile: '',
                video_desktop: '', video_tablet: '', video_mobile: '',
                overlay_color: '', overlay_opacity: 0, overlay_blend_mode: 'normal',
                parallax: false, attachment: 'scroll', sizing: 'cover', custom_position: 'center',
                pattern_type: '', is_active: true
            });
        }
    }, [selectedBgSection, activeBg]);

    const handleSaveBackground = async () => {
        const bg = activeBg || draftBg;
        if (!bg) return;
        if (bg.id) {
            const { id, created_at, updated_at, ...payload } = bg;
            const { error } = await supabase.from('cms_backgrounds').update(payload).eq('id', id);
            if (error) { toast.error("Failed to save background"); return; }
            toast.success("Background saved");
        } else {
            const { id, created_at, updated_at, ...payload } = bg as any;
            const { data, error } = await supabase.from('cms_backgrounds').insert(payload).select('*').single();
            if (error) { toast.error("Failed to create background"); return; }
            setBackgrounds(prev => [...prev, data]);
            setDraftBg(null);
            toast.success(`Background created for "${selectedBgSection}"`);
        }
    };

    const handleDeleteBackground = async () => {
        if (!activeBg) return;
        const { error } = await supabase.from('cms_backgrounds').delete().eq('id', activeBg.id);
        if (error) { toast.error("Failed to delete background"); return; }
        setBackgrounds(prev => prev.filter(b => b.id !== activeBg.id));
        toast.error("Background deleted");
    };

    const handleResetBackground = async () => {
        const bg = activeBg || draftBg;
        if (!bg) return;
        const defaults: Partial<BackgroundConfig> = {
            bg_type: 'solid', solid_color: 'var(--background)',
            gradient_direction: 'to right', gradient_color_1: '', gradient_color_2: '',
            image_desktop: '', image_tablet: '', image_mobile: '',
            video_desktop: '', video_tablet: '', video_mobile: '',
            overlay_color: '', overlay_opacity: 0, overlay_blend_mode: 'normal',
            parallax: false, attachment: 'scroll', sizing: 'cover', custom_position: 'center',
            pattern_type: '', is_active: true
        };
        if (activeBg) {
            const { id, created_at, updated_at, ...payload } = { ...activeBg, ...defaults };
            const { error } = await supabase.from('cms_backgrounds').update(payload).eq('id', id);
            if (error) { toast.error("Failed to reset background"); return; }
            setBackgrounds(prev => prev.map(b => b.id === id ? { ...b, ...defaults } : b));
            toast.success("Background reset to defaults");
        } else {
            setDraftBg(prev => prev ? { ...prev, ...defaults } : null);
            toast.success("Draft reset to defaults");
        }
    };

    const handleResetAll = async () => {
        const { error } = await supabase.from('cms_backgrounds').delete().in('section', sections);
        if (error) { toast.error("Failed to reset all backgrounds"); return; }
        setBackgrounds([]);
        setDraftBg(null);
        toast.success("All backgrounds reset to default");
    };

    const getPatternPreview = (type: string): string | null => {
        const c = 'color-mix(in oklab, var(--foreground) 15%, transparent)';
        switch (type) {
            case 'dots': return `radial-gradient(circle, ${c} 1px, transparent 1px)`;
            case 'grid': return `linear-gradient(${c} 1px, transparent 1px), linear-gradient(90deg, ${c} 1px, transparent 1px)`;
            case 'stripes': return `repeating-linear-gradient(45deg, transparent, transparent 4px, ${c} 4px, ${c} 8px)`;
            case 'checkers': return `conic-gradient(${c} 25%, transparent 25% 50%, ${c} 50% 75%, transparent 75%)`;
            case 'zigzag': return `repeating-linear-gradient(-45deg, transparent, transparent 4px, ${c} 4px, ${c} 8px), repeating-linear-gradient(45deg, transparent, transparent 4px, ${c} 4px, ${c} 8px)`;
            default: return null;
        }
    };

    const bgToPreviewStyle = (cfg: BackgroundConfig | null): React.CSSProperties => {
        if (!cfg) return {};
        const style: React.CSSProperties = {};
        let baseLayers = 0;
        switch (cfg.bg_type) {
            case 'solid':
            case 'pattern':
                style.backgroundColor = cfg.solid_color || 'var(--background)';
                break;
            case 'gradient': {
                const c1 = cfg.gradient_color_1 || cfg.solid_color || 'var(--background)';
                const c2 = cfg.gradient_color_2 || cfg.solid_color || 'var(--background)';
                style.backgroundImage = `linear-gradient(${cfg.gradient_direction || 'to right'}, ${c1}, ${c2})`;
                baseLayers = 1;
                break;
            }
            case 'image': {
                const url = cfg.image_desktop || cfg.image_tablet || cfg.image_mobile;
                if (url) { style.backgroundImage = `url(${url})`; style.backgroundSize = 'cover'; style.backgroundPosition = 'center'; baseLayers = 1; }
                else style.backgroundColor = cfg.solid_color || 'var(--background)';
                break;
            }
            case 'video':
                style.backgroundColor = 'var(--card)';
                break;
        }
        if (cfg.pattern_type) {
            const pat = getPatternPreview(cfg.pattern_type);
            if (pat) {
                if (style.backgroundImage) {
                    style.backgroundImage = `${pat}, ${style.backgroundImage}`;
                } else {
                    style.backgroundImage = pat;
                }
                const ps = cfg.pattern_type === 'stripes' || cfg.pattern_type === 'zigzag' ? '12px' : '20px';
                if (baseLayers > 0) {
                    style.backgroundSize = `${ps} ${ps}, cover`;
                    style.backgroundRepeat = 'repeat, no-repeat';
                    style.backgroundPosition = '0 0, center';
                } else {
                    style.backgroundSize = `${ps} ${ps}`;
                    style.backgroundRepeat = 'repeat';
                    style.backgroundPosition = '0 0';
                }
            }
        }
        return style;
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
        >
            {/* Database Warning Banner */}
            {dbWarning && (
                <div className="flex items-center gap-3 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs shadow-md">
                    <AlertCircle className="h-4 w-4 shrink-0 text-amber-500" />
                    <div>
                        <span className="font-bold">CMS DB Sync Warning:</span> Category, Tags, and Navigation Link Position features are running in fallback mode because the database migration hasn't been applied. Please run <code className="bg-black/40 px-1 py-0.5 rounded font-mono select-all">node scripts/patch-cms.mjs</code> to fully sync database columns.
                    </div>
                </div>
            )}

            <div className="flex items-center justify-between gap-4 flex-wrap">
                <div>
                    <h1 className="font-display text-2xl font-bold tracking-tight">Content Management System</h1>
                    <p className="text-xs text-muted-foreground mt-1">
                        Full-control visual engine to edit layouts, blogs, navigation links, backgrounds, and assets.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <span className="hidden sm:flex items-center gap-1.5 rounded-full bg-white/5 border border-white/5 px-3 py-1.5 text-[10px] font-bold text-muted-foreground">
                        <FileText className="h-3.5 w-3.5" />
                        {pages.length} Pages Live
                    </span>
                    <span className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                        Realtime Live
                    </span>
                </div>
            </div>

            {/* Premium Tab Bar Navigation */}
            <div className="flex border-b border-white/10 overflow-x-auto gap-2 pb-0.5">
                {[
                    { id: 'pages', label: 'Pages & Blocks', icon: Globe },
                    { id: 'blog', label: 'Blog & News', icon: BookOpen },
                    { id: 'navigation', label: 'Menus & Navigation', icon: Compass },
                    { id: 'media', label: 'Media Library', icon: ImageIcon },
                    { id: 'backgrounds', label: 'Background Config', icon: Layers }
                ].map(tab => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => { setActiveTab(tab.id as any); setEditingBlogId(null); }}
                            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-all duration-200 shrink-0 cursor-pointer ${
                                isActive 
                                    ? 'border-brand-magenta text-foreground bg-white/5 rounded-t-lg'
                                    : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-white/5 rounded-t-lg'
                            }`}
                        >
                            <Icon className={`h-4 w-4 ${isActive ? 'text-brand-magenta' : 'text-muted-foreground'}`} />
                            {tab.label}
                        </button>
                    );
                })}
            </div>

            {/* Main Tabs Container */}
            <div className="min-h-[500px]">
                {/* 1. PAGES TAB */}
                {activeTab === 'pages' && (
                    <div className="grid gap-6 lg:grid-cols-4">
                        {/* Pages Sidebar List */}
                        <div className="space-y-4">
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
                                <div className="flex gap-1 mb-3 border-b border-white/5 pb-2 overflow-x-auto">
                                    {(['all', 'active', 'draft', 'archived'] as const).map(tab => (
                                        <button
                                            key={tab}
                                            onClick={() => setPageStatusTab(tab)}
                                            className={`px-2 py-1 text-[9px] font-bold rounded-lg capitalize border transition shrink-0 cursor-pointer ${
                                                pageStatusTab === tab
                                                    ? 'bg-brand-magenta border-brand-magenta text-white font-extrabold shadow'
                                                    : 'bg-white/5 border-white/5 text-muted-foreground hover:text-foreground'
                                            }`}
                                        >
                                            {tab}
                                        </button>
                                    ))}
                                </div>
                                <div className="space-y-2 max-h-[450px] overflow-y-auto pr-1">
                                    {filteredPages.map((p) => (
                                        <div key={p.id} className="group relative w-full border border-white/5 rounded-xl bg-white/5 p-1.5 transition hover:bg-white/10">
                                            <div className="flex flex-col w-full pr-14">
                                                <button
                                                    onClick={() => setSelectedPageId(p.id)}
                                                    className="w-full text-left rounded px-1.5 py-1 text-xs font-semibold transition-all cursor-pointer text-foreground hover:text-brand-magenta truncate"
                                                >
                                                    {p.title}
                                                </button>
                                                <div className="flex items-center gap-1.5 px-1.5 mt-0.5">
                                                    <span className="text-[9px] font-mono text-muted-foreground/60 truncate max-w-[100px]" title={p.slug}>{p.slug}</span>
                                                    <span className={`px-1 rounded text-[7px] font-bold tracking-wider uppercase scale-90 origin-left border ${
                                                        (p as any).is_archived
                                                            ? 'bg-rose-500/10 text-brand-pink border-brand-pink/20'
                                                            : p.is_published
                                                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                                                : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                                    }`}>
                                                        {(p as any).is_archived ? 'Archived' : p.is_published ? 'Active' : 'Draft'}
                                                    </span>
                                                </div>
                                            </div>
                                            
                                            <div className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 flex items-center gap-1 bg-card/95 backdrop-blur-sm p-1 rounded-lg border border-white/10 transition-all shadow z-10">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setExpandedSeoPageId(expandedSeoPageId === p.id ? null : p.id);
                                                    }}
                                                    className={`p-1 rounded cursor-pointer ${expandedSeoPageId === p.id ? "text-brand-cyan hover:bg-brand-cyan/10" : "text-muted-foreground hover:bg-white/10"}`}
                                                    title="SEO Settings"
                                                >
                                                    <Globe className="h-3 w-3" />
                                                </button>
                                                <button
                                                    onClick={(e) => handleTogglePublish(p.id, p.is_published, e)}
                                                    className={`p-1 rounded cursor-pointer ${p.is_published ? "text-emerald-400 hover:bg-emerald-500/10" : "text-muted-foreground hover:bg-white/10"}`}
                                                    title={p.is_published ? "Unpublish" : "Publish"}
                                                >
                                                    <Check className="h-3 w-3" />
                                                </button>
                                                <button
                                                    onClick={(e) => handleDuplicatePage(p, e)}
                                                    className="p-1 rounded text-brand-cyan hover:bg-brand-cyan/10 cursor-pointer"
                                                    title="Duplicate Page"
                                                >
                                                    <Copy className="h-3 w-3" />
                                                </button>
                                                <button
                                                    onClick={(e) => handleToggleArchive(p.id, (p as any).is_archived || false, e)}
                                                    className={`p-1 rounded cursor-pointer ${ (p as any).is_archived ? "text-rose-400 hover:bg-rose-500/10" : "text-muted-foreground hover:bg-white/10"}`}
                                                    title={(p as any).is_archived ? "Unarchive (Restore)" : "Archive Page"}
                                                >
                                                    <Archive className="h-3 w-3" />
                                                </button>
                                                <button
                                                    onClick={(e) => handleDeletePage(p.id, e)}
                                                    className="p-1 rounded text-muted-foreground hover:text-brand-pink hover:bg-white/10 cursor-pointer"
                                                    title="Delete Page"
                                                >
                                                    <Trash2 className="h-3 w-3" />
                                                </button>
                                            </div>
                                            
                                            {/* Expandable Page Settings */}
                                            {expandedSeoPageId === p.id && (
                                                <div className="mt-2 p-2 border-t border-white/5 space-y-2 bg-black/25 rounded-lg">
                                                    <div className="text-[10px] font-bold text-brand-cyan uppercase tracking-wider mb-1 flex items-center gap-1">
                                                        <Globe className="h-3 w-3" /> Page Settings
                                                    </div>
                                                    
                                                    <div className="space-y-1">
                                                        <label className="block text-[8px] text-muted-foreground uppercase font-semibold">Meta Title</label>
                                                        <input
                                                            type="text"
                                                            placeholder="Meta title..."
                                                            value={p.meta_title || ""}
                                                            onChange={(e) => handleUpdatePageSeo(p.id, 'meta_title', e.target.value)}
                                                            className="w-full rounded bg-background/50 border border-white/10 px-2 py-1 text-[10px] text-foreground focus:outline-none focus:border-brand-cyan"
                                                        />
                                                    </div>

                                                    <div className="space-y-1">
                                                        <label className="block text-[8px] text-muted-foreground uppercase font-semibold">Meta Description</label>
                                                        <textarea
                                                            placeholder="Meta description..."
                                                            rows={2}
                                                            value={p.meta_description || ""}
                                                            onChange={(e) => handleUpdatePageSeo(p.id, 'meta_description', e.target.value)}
                                                            className="w-full rounded bg-background/50 border border-white/10 px-2 py-1 text-[10px] text-foreground focus:outline-none focus:border-brand-cyan resize-none"
                                                        />
                                                    </div>

                                                    <div className="space-y-1">
                                                        <label className="block text-[8px] text-muted-foreground uppercase font-semibold">Canonical URL</label>
                                                        <input
                                                            type="text"
                                                            placeholder="Canonical URL..."
                                                            value={p.canonical_url || ""}
                                                            onChange={(e) => handleUpdatePageSeo(p.id, 'canonical_url', e.target.value)}
                                                            className="w-full rounded bg-background/50 border border-white/10 px-2 py-1 text-[10px] text-foreground focus:outline-none focus:border-brand-cyan"
                                                        />
                                                    </div>

                                                    <div className="space-y-1">
                                                        <label className="block text-[8px] text-muted-foreground uppercase font-semibold">OG Image URL</label>
                                                        <input
                                                            type="text"
                                                            placeholder="OG Image URL..."
                                                            value={p.og_image_url || ""}
                                                            onChange={(e) => handleUpdatePageSeo(p.id, 'og_image_url', e.target.value)}
                                                            className="w-full rounded bg-background/50 border border-white/10 px-2 py-1 text-[10px] text-foreground focus:outline-none focus:border-brand-cyan"
                                                        />
                                                    </div>

                                                    <div className="border-t border-white/10 pt-2 mt-2 space-y-2">
                                                        <div className="flex items-center justify-between">
                                                            <label className="text-[9px] text-muted-foreground font-semibold flex items-center gap-1 cursor-pointer">
                                                                <input
                                                                    type="checkbox"
                                                                    checked={p.show_in_nav || false}
                                                                    onChange={(e) => handleUpdatePageSeo(p.id, 'show_in_nav', e.target.checked)}
                                                                    className="rounded bg-background/50 border border-white/10 cursor-pointer"
                                                                />
                                                                Show in Header Nav
                                                            </label>
                                                            <div className="flex items-center gap-1">
                                                                <label className="text-[8px] text-muted-foreground uppercase font-semibold">Order:</label>
                                                                <input
                                                                    type="number"
                                                                    value={p.nav_order || 0}
                                                                    onChange={(e) => handleUpdatePageSeo(p.id, 'nav_order', parseInt(e.target.value) || 0)}
                                                                    className="w-12 rounded bg-background/50 border border-white/10 px-1 py-0.5 text-[9px] text-foreground focus:outline-none focus:border-brand-cyan text-center"
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <button
                                                        onClick={() => handleSavePageSeo(p.id)}
                                                        className="w-full rounded bg-brand-cyan hover:opacity-90 text-black py-1 text-[10px] font-bold transition cursor-pointer mt-2"
                                                    >
                                                        Save Settings
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                    {filteredPages.length === 0 && (
                                        <div className="p-8 text-center text-xs text-muted-foreground">
                                            No pages found
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Page Visual Canvas Editor Area */}
                        <div className="lg:col-span-3 space-y-6">
                            <div className="rounded-2xl border border-white/10 bg-card/40 p-5 backdrop-blur-xl">
                                <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-3 gap-2 flex-wrap">
                                    <div>
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                                Visual Editor Canvas
                                            </h3>
                                            {unsavedChangesCount > 0 && (
                                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20 animate-pulse">
                                                    <span className="h-1.5 w-1.5 rounded-full bg-amber-400"></span>
                                                    {unsavedChangesCount} unsaved
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-[10px] text-muted-foreground mt-0.5">
                                            Selected page: <span className="text-foreground font-semibold">{selectedPage?.title || ""}</span>
                                        </p>
                                    </div>
                                    <button
                                        onClick={handleSavePage}
                                        className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-semibold text-white shadow-md transition-all cursor-pointer ${
                                            showSavedFeedback ? "bg-emerald-600" : "bg-gradient-to-r from-brand-magenta to-brand-blue hover:scale-[1.02]"
                                        }`}
                                    >
                                        {showSavedFeedback ? <><Check className="h-3.5 w-3.5" /> Saved!</> : <><Save className="h-3.5 w-3.5" /> Save layout</>}
                                    </button>
                                </div>

                                <div className="border border-white/5 bg-background/50 rounded-xl p-4 space-y-4 max-h-[550px] overflow-y-auto min-h-[300px]">
                                    {selectedPage?.blocks?.map((block, index) => (
                                        <div key={block.id} className="group relative border border-dashed border-white/10 hover:border-brand-magenta/40 p-4 rounded-xl transition">
                                            <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition flex items-center gap-1.5 z-10 bg-card/95 backdrop-blur-sm p-1 rounded-lg border border-white/10 shadow">
                                                <button disabled={index === 0} onClick={(e) => handleMoveBlock(block.id, "up", e)} className="text-muted-foreground hover:text-foreground disabled:opacity-30 p-1 cursor-pointer"><ChevronUp className="h-3.5 w-3.5" /></button>
                                                <button disabled={index === (selectedPage.blocks.length - 1)} onClick={(e) => handleMoveBlock(block.id, "down", e)} className="text-muted-foreground hover:text-foreground disabled:opacity-30 p-1 cursor-pointer"><ChevronDown className="h-3.5 w-3.5" /></button>
                                                <button onClick={(e) => handleDeleteBlock(block.id, e)} className="text-muted-foreground hover:text-brand-pink p-1 cursor-pointer"><Trash2 className="h-3.5 w-3.5" /></button>
                                                <span className="text-[9px] uppercase font-mono bg-white/10 px-1.5 py-0.5 rounded text-muted-foreground">{block.type}</span>
                                            </div>

                                            {block.type === "header" && <h2 className="font-display text-xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-brand-magenta to-brand-blue">{block.content}</h2>}
                                            {block.type === "text" && <div className="text-xs text-muted-foreground leading-relaxed prose prose-invert" dangerouslySetInnerHTML={{ __html: block.content }} />}
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
                                                ) : block.type === "media" ? (
                                                    <div className="mt-2">
                                                        <label className="block text-[10px] text-muted-foreground mb-1 uppercase tracking-wider">Select Media Source</label>
                                                        <div className="flex gap-2">
                                                            <select
                                                                value={block.content}
                                                                onChange={(e) => handleUpdateBlockContent(block.id, e.target.value)}
                                                                className="flex-1 rounded-lg border border-border bg-card px-3 py-1.5 text-xs text-foreground focus:outline-none focus:border-brand-cyan transition-colors"
                                                            >
                                                                <option value="">-- Select from Media Library --</option>
                                                                {mediaList.map(m => (
                                                                    <option key={m.id} value={m.url}>{m.name}</option>
                                                                ))}
                                                            </select>
                                                            <input type="text" placeholder="Or type custom URL..." value={block.content} onChange={(e) => handleUpdateBlockContent(block.id, e.target.value)} className="flex-1 rounded-lg border border-border bg-card px-3 py-1.5 text-xs text-foreground focus:outline-none focus:border-brand-magenta transition-colors" />
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <>
                                                        <label className="block text-[10px] text-muted-foreground mb-1 uppercase tracking-wider">Edit Content</label>
                                                        <input type="text" value={block.content} onChange={(e) => handleUpdateBlockContent(block.id, e.target.value)} className="w-full rounded-lg border border-border bg-card px-3 py-1.5 text-xs text-foreground focus:outline-none focus:border-brand-magenta transition-colors" />
                                                    </>
                                                )}
                                                {block.type === "button" && (
                                                    <div className="mt-3">
                                                        <label className="block text-[10px] text-muted-foreground mb-1 uppercase tracking-wider">Button Link (to)</label>
                                                        <div className="flex gap-2">
                                                            <select
                                                                value={block.meta || ""}
                                                                onChange={(e) => handleUpdateBlockMeta(block.id, e.target.value)}
                                                                className="flex-1 rounded-lg border border-border bg-card px-3 py-1.5 text-xs text-foreground focus:outline-none focus:border-brand-cyan transition-colors"
                                                            >
                                                                <option value="">-- Select Page Route --</option>
                                                                {pages.map(p => {
                                                                    const path = (p.slug === 'home' || p.slug === '/') ? '/' : `/${p.slug.replace(/^\/+/, '')}`;
                                                                    return <option key={p.id} value={path}>{p.title} ({path})</option>
                                                                })}
                                                            </select>
                                                            <input type="text" placeholder="Or type custom URL..." value={block.meta || ""} onChange={(e) => handleUpdateBlockMeta(block.id, e.target.value)} className="flex-1 rounded-lg border border-border bg-card px-3 py-1.5 text-xs text-foreground focus:outline-none focus:border-brand-magenta transition-colors" />
                                                        </div>
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
                        </div>
                    </div>
                )}

                {/* 2. BLOG TAB */}
                {activeTab === 'blog' && (
                    <div className="grid gap-6 lg:grid-cols-4">
                        {/* Blog Sidebar List */}
                        <div className="space-y-4">
                            <div className="rounded-2xl border border-white/10 bg-card/40 p-4 backdrop-blur-xl">
                                <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 flex items-center justify-between">
                                    <span>Blog & News Posts</span>
                                </div>
                                <div className="relative mb-3">
                                    <Search className="absolute left-2.5 top-1/2 h-3 w-3 -translate-y-1/2 text-muted-foreground" />
                                    <input
                                        type="text"
                                        placeholder="Search blogs..."
                                        value={blogSearchText}
                                        onChange={(e) => setBlogSearchText(e.target.value)}
                                        className="w-full rounded-lg border border-border bg-background/50 pl-8 pr-2.5 py-1.5 text-[11px] focus:outline-none text-foreground"
                                    />
                                </div>

                                <div className="space-y-2 max-h-[350px] overflow-y-auto pr-1">
                                    {filteredBlogs.map((blog) => (
                                        <div 
                                            key={blog.id} 
                                            onClick={() => { 
                                                setEditingBlogId(blog.id); 
                                                setBlogContent(blog.content || "");
                                                setBlogCategory(blog.category || "General");
                                                setBlogTags(blog.tags || "");
                                                setBlogStatus(blog.status || "Draft");
                                            }}
                                            className={`relative group rounded-xl border p-3 text-[11px] transition-all cursor-pointer ${
                                                editingBlogId === blog.id
                                                    ? 'bg-brand-magenta/10 border-brand-magenta/40 text-foreground'
                                                    : 'bg-white/5 border-white/5 hover:bg-white/10 text-muted-foreground hover:text-foreground'
                                            }`}
                                        >
                                            <div className="flex items-start justify-between">
                                                <div className="overflow-hidden mr-2">
                                                    <p className="font-semibold truncate leading-snug">{blog.title}</p>
                                                    <div className="flex items-center gap-1.5 mt-1 text-[9px] flex-wrap">
                                                        <span className="text-muted-foreground">{blog.date}</span>
                                                        <span className={`px-1.5 py-0.5 rounded-full text-[8px] font-bold ${
                                                            blog.status === 'Published' 
                                                                ? 'bg-emerald-500/10 text-emerald-400' 
                                                                : 'bg-amber-500/10 text-amber-400'
                                                        }`}>
                                                            {blog.status}
                                                        </span>
                                                        {blog.category && (
                                                            <span className="px-1.5 py-0.5 rounded-full bg-brand-cyan/10 text-brand-cyan text-[8px] font-semibold">
                                                                {blog.category}
                                                            </span>
                                                        )}
                                                    </div>
                                                    {blog.tags && (
                                                        <div className="flex items-center gap-1 mt-1 text-[8px] flex-wrap max-w-full">
                                                            <Tag className="h-2.5 w-2.5 text-muted-foreground" />
                                                            <span className="truncate max-w-[120px] text-muted-foreground">{blog.tags}</span>
                                                        </div>
                                                    )}
                                                </div>
                                                <button 
                                                    onClick={(e) => { e.stopPropagation(); handleDeleteBlog(blog.id); }} 
                                                    className="text-muted-foreground hover:text-brand-pink p-1 shrink-0 cursor-pointer self-start opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <Trash2 className="h-3.5 w-3.5" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                    {filteredBlogs.length === 0 && (
                                        <div className="p-8 text-center text-xs text-muted-foreground">
                                            No blog posts found
                                        </div>
                                    )}
                                </div>

                                <div className="mt-3 flex flex-col gap-2 border-t border-white/5 pt-3">
                                    <label className="block text-[10px] text-muted-foreground uppercase font-bold">Create Post Draft</label>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            placeholder="Post title..."
                                            value={newBlogTitle}
                                            onChange={(e) => setNewBlogTitle(e.target.value)}
                                            className="flex-1 rounded-lg border border-border bg-background px-2.5 py-1.5 text-[11px] text-foreground focus:outline-none focus:border-brand-magenta transition-colors"
                                        />
                                        <button
                                            onClick={handleAddBlogPost}
                                            className="rounded-lg bg-brand-magenta text-white px-3 text-[11px] font-bold hover:opacity-90 transition cursor-pointer"
                                        >
                                            Create
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Blog Rich Text Editor Area */}
                        <div className="lg:col-span-3">
                            {editingBlogId ? (
                                <div className="rounded-2xl border border-white/10 bg-card/40 p-5 backdrop-blur-xl space-y-4">
                                    <div className="flex items-center justify-between border-b border-white/5 pb-3 flex-wrap gap-2">
                                        <div>
                                            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                                Rich Text Editor (Blog Post)
                                            </h3>
                                            <p className="text-[10px] text-muted-foreground mt-0.5">
                                                Editing: <span className="text-foreground font-semibold">{blogList.find(b => b.id === editingBlogId)?.title}</span>
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => setEditingBlogId(null)}
                                                className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-white/10 text-muted-foreground hover:bg-white/5 cursor-pointer"
                                            >
                                                Close
                                            </button>
                                            <button
                                                onClick={handleSaveBlogContent}
                                                className="flex items-center gap-1.5 text-xs font-semibold px-4 py-1.5 rounded-lg bg-brand-magenta text-white hover:opacity-90 cursor-pointer shadow-md"
                                            >
                                                <Save className="h-3.5 w-3.5" /> Save Post Details
                                            </button>
                                        </div>
                                    </div>

                                    {/* Blog Metadata Controls */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-black/25 p-3.5 rounded-xl border border-white/5 text-xs">
                                        <div className="space-y-1">
                                            <label className="block text-[10px] text-muted-foreground uppercase font-bold">Category</label>
                                            <select 
                                                value={blogCategory} 
                                                onChange={(e) => setBlogCategory(e.target.value)}
                                                className="w-full rounded-lg border border-white/15 bg-background px-2.5 py-1.5 focus:outline-none focus:border-brand-cyan text-foreground text-xs"
                                            >
                                                <option value="General">General</option>
                                                <option value="Marketing">Marketing</option>
                                                <option value="Technology">Technology</option>
                                                <option value="Design">Design</option>
                                                <option value="Development">Development</option>
                                                <option value="Business">Business</option>
                                                <option value="News">News</option>
                                            </select>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="block text-[10px] text-muted-foreground uppercase font-bold">Tags (comma-separated)</label>
                                            <input 
                                                type="text" 
                                                placeholder="e.g. SEO, AI, WebDesign"
                                                value={blogTags}
                                                onChange={(e) => setBlogTags(e.target.value)}
                                                className="w-full rounded-lg border border-white/15 bg-background px-2.5 py-1.5 focus:outline-none focus:border-brand-cyan text-foreground text-xs"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="block text-[10px] text-muted-foreground uppercase font-bold">Status</label>
                                            <select 
                                                value={blogStatus} 
                                                onChange={(e) => setBlogStatus(e.target.value as any)}
                                                className="w-full rounded-lg border border-white/15 bg-background px-2.5 py-1.5 focus:outline-none focus:border-brand-cyan text-foreground text-xs"
                                            >
                                                <option value="Draft">Draft</option>
                                                <option value="Published">Published</option>
                                            </select>
                                        </div>
                                    </div>

                                    {/* Main TinyMCE WYSIWYG Editor */}
                                    <div className="bg-white rounded-lg overflow-hidden border border-white/10">
                                        <Editor
                                            apiKey="no-api-key"
                                            value={blogContent}
                                            onEditorChange={(newContent) => setBlogContent(newContent)}
                                            init={{
                                                height: 400,
                                                menubar: true,
                                                plugins: [
                                                    'advlist autolink lists link image charmap print preview anchor',
                                                    'searchreplace visualblocks code fullscreen',
                                                    'insertdatetime media table paste code help wordcount'
                                                ],
                                                toolbar: 'undo redo | formatselect | bold italic underline forecolor backcolor | \
                                                alignleft aligncenter alignright alignjustify | \
                                                bullist numlist outdent indent | removeformat | image media link code fullscreen'
                                            }}
                                        />
                                    </div>
                                </div>
                            ) : (
                                <div className="rounded-2xl border border-white/10 bg-card/40 p-10 text-center backdrop-blur-xl min-h-[350px] flex flex-col items-center justify-center text-muted-foreground">
                                    <BookOpen className="h-10 w-10 mb-3 opacity-30 text-brand-magenta" />
                                    <p className="text-sm font-bold">No Blog Post Selected</p>
                                    <p className="text-xs text-muted-foreground mt-1 max-w-xs">
                                        Select a post from the sidebar list to start editing its content and parameters, or create a new draft.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* 3. NAVIGATION TAB */}
                {activeTab === 'navigation' && (
                    <div className="grid gap-6 md:grid-cols-2">
                        {/* Header Navigation Editor */}
                        <div className="rounded-2xl border border-white/10 bg-card/40 p-5 backdrop-blur-xl flex flex-col space-y-4">
                            <div className="border-b border-white/5 pb-2">
                                <h3 className="text-sm font-bold text-foreground">Header Navigation Links</h3>
                                <p className="text-[10px] text-muted-foreground">Appears in the header navigation menu.</p>
                            </div>
                            <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1 flex-1">
                                {headerLinks.map((link) => (
                                    <div key={link.id} className="flex items-center justify-between rounded-xl bg-white/5 border border-white/5 px-3 py-2 text-[11px] group">
                                        <div className="flex flex-col">
                                            <span className="font-semibold text-foreground">{link.label}</span>
                                            <span className="font-mono text-muted-foreground text-[9px] mt-0.5">{link.to_path}</span>
                                        </div>
                                        <Trash2 className="h-4 w-4 text-muted-foreground hover:text-brand-pink cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => handleDeleteNavLink(link.id)} />
                                    </div>
                                ))}
                                {headerLinks.length === 0 && (
                                    <div className="text-center py-8 text-xs text-muted-foreground">No links in Header Menu</div>
                                )}
                            </div>
                        </div>

                        {/* Footer Navigation Editor */}
                        <div className="rounded-2xl border border-white/10 bg-card/40 p-5 backdrop-blur-xl flex flex-col space-y-4">
                            <div className="border-b border-white/5 pb-2">
                                <h3 className="text-sm font-bold text-foreground">Footer Navigation Links</h3>
                                <p className="text-[10px] text-muted-foreground">Appears in the footer site maps.</p>
                            </div>
                            <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1 flex-1">
                                {footerLinks.map((link) => (
                                    <div key={link.id} className="flex items-center justify-between rounded-xl bg-white/5 border border-white/5 px-3 py-2 text-[11px] group">
                                        <div className="flex flex-col">
                                            <span className="font-semibold text-foreground">{link.label}</span>
                                            <span className="font-mono text-muted-foreground text-[9px] mt-0.5">{link.to_path}</span>
                                        </div>
                                        <Trash2 className="h-4 w-4 text-muted-foreground hover:text-brand-pink cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => handleDeleteNavLink(link.id)} />
                                    </div>
                                ))}
                                {footerLinks.length === 0 && (
                                    <div className="text-center py-8 text-xs text-muted-foreground">No links in Footer Menu</div>
                                )}
                            </div>
                        </div>

                        {/* Link Creation Manager */}
                        <div className="md:col-span-2 rounded-2xl border border-white/10 bg-card/40 p-5 backdrop-blur-xl">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">Add Navigation link</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                                <div className="relative" ref={labelDropdownRef}>
                                    <label className="block text-[9px] text-muted-foreground uppercase font-bold mb-1">Link Label</label>
                                    <input
                                        type="text"
                                        placeholder="Home"
                                        value={newNavLink.label}
                                        onFocus={() => setShowLabelDropdown(true)}
                                        onChange={(e) => setNewNavLink({ ...newNavLink, label: e.target.value })}
                                        className="w-full rounded-lg border bg-background px-3 py-2 text-xs focus:outline-none focus:border-brand-cyan text-foreground"
                                    />
                                    {showLabelDropdown && (
                                        <div className="absolute left-0 top-full mt-1 w-full rounded-lg border border-white/10 bg-card shadow-2xl z-50 max-h-36 overflow-y-auto">
                                            {[...new Set([
                                                ...navLinks.map(l => l.label),
                                                'Home', 'Services', 'Work', 'Resources', 'Process', 'Testimonials', 'About', 'Contact',
                                                'Blog', 'SEO', 'AI Chatbots', 'LLM Solutions', 'Full Stack Web',
                                                'Graphic Design', 'Privacy Policy', 'Terms of Service', 'Cookie Policy'
                                            ])].map(label => (
                                                <button
                                                    key={label}
                                                    type="button"
                                                    onMouseDown={() => { setNewNavLink(prev => ({ ...prev, label })); setShowLabelDropdown(false); }}
                                                    className="w-full text-left px-2.5 py-1.5 text-[10px] hover:bg-white/10 text-foreground transition cursor-pointer"
                                                >
                                                    {label}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-[9px] text-muted-foreground uppercase font-bold mb-1">Route Path</label>
                                    <input 
                                        type="text" 
                                        placeholder="/route" 
                                        value={newNavLink.to_path} 
                                        onChange={(e) => setNewNavLink({ ...newNavLink, to_path: e.target.value })} 
                                        className="w-full rounded-lg border bg-background px-3 py-2 text-xs focus:outline-none focus:border-brand-cyan text-foreground" 
                                    />
                                </div>
                                <div>
                                    <label className="block text-[9px] text-muted-foreground uppercase font-bold mb-1">Position</label>
                                    <select
                                        value={newNavLink.position}
                                        onChange={(e) => setNewNavLink({ ...newNavLink, position: e.target.value })}
                                        className="w-full rounded-lg border bg-background px-3 py-2 text-xs focus:outline-none focus:border-brand-cyan text-foreground"
                                    >
                                        <option value="header">Header Menu</option>
                                        <option value="footer">Footer Menu</option>
                                    </select>
                                </div>
                                <div className="flex items-end">
                                    <button 
                                        onClick={handleAddNavLink} 
                                        className="w-full rounded-lg bg-brand-blue text-white py-2 text-xs font-bold hover:opacity-90 shadow-md transition cursor-pointer"
                                    >
                                        Add Link Item
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* 4. MEDIA TAB */}
                {activeTab === 'media' && (
                    <div className="rounded-2xl border border-white/10 bg-card/40 p-5 backdrop-blur-xl flex flex-col space-y-4">
                        <div className="flex items-center justify-between border-b border-white/5 pb-3 flex-wrap gap-2">
                            <div>
                                <h3 className="text-sm font-bold text-foreground">Media Asset Library</h3>
                                <p className="text-[10px] text-muted-foreground">Upload and link files directly inside the page visual layouts.</p>
                            </div>
                            <div className="flex items-center gap-3 flex-wrap">
                                {/* WebP Optimization Toggle */}
                                <div className="flex items-center gap-2 bg-black/35 px-3 py-1.5 rounded-lg border border-white/5">
                                    <label htmlFor="webp-convert" className="text-[10px] font-bold text-brand-cyan uppercase tracking-wider cursor-pointer">Optimize Images (WebP)</label>
                                    <input 
                                        id="webp-convert"
                                        type="checkbox"
                                        checked={autoConvertToWebP}
                                        onChange={(e) => setAutoConvertToWebP(e.target.checked)}
                                        className="w-3.5 h-3.5 accent-brand-cyan rounded cursor-pointer"
                                    />
                                </div>
                                <button 
                                    onClick={() => fileInputRef.current?.click()} 
                                    className="flex items-center gap-1.5 rounded-lg bg-brand-magenta text-white px-3 py-1.5 text-xs hover:opacity-95 font-bold transition cursor-pointer shadow-md"
                                >
                                    <Upload className="h-3.5 w-3.5" /> Upload Files
                                </button>
                                <input type="file" ref={fileInputRef} onChange={(e) => { if (e.target.files) handleFilesSelected(e.target.files); }} multiple accept="image/*,application/pdf,video/*" className="hidden" />
                            </div>
                        </div>

                        {/* Search & Type Filters */}
                        <div className="flex gap-2 flex-col sm:flex-row items-center">
                            <div className="relative flex-1 w-full">
                                <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                                <input 
                                    type="text" 
                                    placeholder="Search media by filename..." 
                                    value={mediaSearchText} 
                                    onChange={(e) => setMediaSearchText(e.target.value)} 
                                    className="w-full rounded-lg border border-border bg-background/50 pl-8 pr-2.5 py-1.5 text-xs focus:outline-none text-foreground" 
                                />
                            </div>
                            <div className="flex gap-1.5 shrink-0">
                                {[
                                    { id: 'all', label: 'All Files' },
                                    { id: 'image', label: 'Images' },
                                    { id: 'video', label: 'Videos' },
                                    { id: 'pdf', label: 'PDFs' }
                                ].map(filter => (
                                    <button 
                                        key={filter.id}
                                        onClick={() => setMediaTypeFilter(filter.id as any)}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition cursor-pointer ${
                                            mediaTypeFilter === filter.id 
                                                ? 'bg-brand-cyan border-brand-cyan text-black' 
                                                : 'bg-white/5 border-white/5 text-muted-foreground hover:text-foreground hover:bg-white/10'
                                        }`}
                                    >
                                        {filter.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Drag and Drop Zone */}
                        <div 
                            onDragOver={handleDragOver} 
                            onDragLeave={handleDragLeave} 
                            onDrop={handleDrop} 
                            className={`border border-dashed rounded-xl p-6 text-center transition-all flex flex-col items-center justify-center min-h-[120px] ${
                                isDragging 
                                    ? "border-brand-magenta bg-brand-magenta/10 scale-[0.98]" 
                                    : "border-white/10 hover:border-brand-magenta/30 bg-background/20"
                            }`}
                        >
                            <Upload className={`h-6 w-6 mb-2 ${isDragging ? "animate-bounce text-brand-magenta" : "text-muted-foreground"}`} />
                            <p className="text-xs font-bold">{isDragging ? "Release files here!" : "Drag & Drop files here"}</p>
                            <p className="text-[10px] text-muted-foreground mt-0.5">Supports Images (automatic WebP optimization), Videos, and PDFs</p>
                            {uploading && (
                                <div className="w-full max-w-xs mt-3 bg-black/40 rounded-full h-1.5 overflow-hidden">
                                    <div className="bg-brand-cyan h-full transition-all duration-300" style={{ width: `${uploadProgress}%` }}></div>
                                    <span className="block text-[9px] text-brand-cyan mt-1 text-center font-bold">Uploading {uploadProgress}%</span>
                                </div>
                            )}
                        </div>

                        {/* Assets Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4 max-h-[450px] overflow-y-auto pr-1">
                            {filteredMediaList.map((file) => (
                                <div key={file.id} className="relative group rounded-xl border border-white/10 overflow-hidden bg-background/60 shadow-md">
                                    {file.type === "image" ? (
                                        <img src={file.url} className="h-28 w-full object-cover" alt="" />
                                    ) : (
                                        <div className="h-28 w-full flex flex-col items-center justify-center bg-white/5 text-[10px] font-bold text-muted-foreground gap-1.5">
                                            {file.type === 'pdf' ? <FileText className="h-6 w-6 text-brand-cyan" /> : <Monitor className="h-6 w-6 text-brand-magenta" />}
                                            {(file.type || 'FILE').toUpperCase()}
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-black/85 opacity-0 group-hover:opacity-100 flex flex-col justify-between p-2.5 transition-all duration-200">
                                        <span className="text-[9px] text-white truncate font-bold" title={file.name}>{file.name}</span>
                                        {file.url && (
                                            <div className="flex flex-col gap-1.5 my-auto">
                                                <button 
                                                    onClick={() => { navigator.clipboard.writeText(file.url); toast.success("Copied Url to Clipboard!"); }} 
                                                    className="bg-brand-blue text-white rounded-lg px-2.5 py-1 text-[9px] mx-auto cursor-pointer flex items-center gap-1 hover:opacity-95 font-semibold"
                                                >
                                                    <Copy className="h-2.5 w-2.5" /> Copy Link
                                                </button>
                                                <a 
                                                    href={file.url} 
                                                    target="_blank" 
                                                    rel="noreferrer" 
                                                    className="bg-white/10 text-white rounded-lg px-2.5 py-1 text-[9px] mx-auto cursor-pointer flex items-center gap-1 hover:bg-white/15 font-semibold"
                                                >
                                                    <ExternalLink className="h-2.5 w-2.5" /> Open
                                                </a>
                                            </div>
                                        )}
                                        <div className="flex items-center justify-between mt-auto">
                                            <span className="text-[8px] text-white/70 font-mono">{file.size}</span>
                                            <Trash2 className="h-3.5 w-3.5 text-brand-pink hover:scale-110 transition cursor-pointer" onClick={() => handleDeleteMedia(file.id, file.url)} />
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {filteredMediaList.length === 0 && (
                                <div className="col-span-full py-12 text-center text-xs text-muted-foreground">
                                    No assets in media library
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* 5. BACKGROUNDS TAB - UNCHANGED MANAGER COMPONENT */}
                {activeTab === 'backgrounds' && (
                    <div className="max-w-2xl mx-auto rounded-2xl border border-white/10 bg-card/40 p-5 backdrop-blur-xl">
                        <div className="flex items-center justify-between gap-2 mb-4 border-b border-white/5 pb-3">
                            <div className="flex items-center gap-2">
                                <Layers className="h-4 w-4 text-brand-cyan" />
                                <span className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Background Manager</span>
                            </div>
                            {backgrounds.length > 0 && (
                                <button onClick={handleResetAll}
                                    className="flex items-center gap-1 rounded-md bg-rose-500/15 text-brand-pink border border-brand-pink/20 px-2 py-1 text-[9px] font-bold hover:bg-rose-500/25 transition cursor-pointer">
                                    <RotateCcw className="h-3 w-3" /> Reset All
                                </button>
                            )}
                        </div>

                        <div className="space-y-4 text-xs">
                            {/* Section Selector */}
                            <div className="flex items-center gap-3 flex-wrap">
                                <div className="flex-1 min-w-[200px]">
                                    <label className="block font-bold text-muted-foreground mb-1 uppercase tracking-wider">Section</label>
                                    <select value={selectedBgSection} onChange={(e) => { setSelectedBgSection(e.target.value); setDraftBg(null); }}
                                        className="w-full rounded-lg border border-border bg-background/50 px-3 py-2 focus:outline-none text-foreground">
                                        {sections.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                                    </select>
                                </div>
                                {activeBg && (
                                    <div className="flex items-center gap-1.5 mt-5">
                                        <button onClick={handleDeleteBackground} className="p-2 rounded-lg bg-rose-500/20 text-brand-pink border border-brand-pink/30 hover:bg-rose-500/30 transition cursor-pointer" title="Delete">
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                        <button onClick={handleResetBackground} className="flex items-center gap-1 rounded-lg bg-amber-500/15 text-amber-400 border border-amber-500/20 px-2.5 py-2 text-[10px] font-bold hover:bg-amber-500/25 transition cursor-pointer" title="Reset to default">
                                            <RotateCcw className="h-3 w-3" /> Reset Section
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Preview */}
                            <div className="space-y-1">
                                <label className="block font-bold text-muted-foreground mb-1 uppercase tracking-wider">Preview</label>
                                <div className="h-28 rounded-xl border border-white/10 overflow-hidden shadow-inner">
                                    <div className="w-full h-full" style={bgToPreviewStyle(activeBg || draftBg)} />
                                </div>
                            </div>

                            {/* Background Type */}
                            <div>
                                <label className="block font-bold text-muted-foreground mb-1 uppercase tracking-wider">Type</label>
                                <select value={bgTypeReverse[(activeBg || draftBg)?.bg_type || 'solid']} onChange={(e) => handleBgFieldChange('bg_type', bgTypeMap[e.target.value] || 'solid')}
                                    className="w-full rounded-lg border border-border bg-background/50 px-3 py-2 focus:outline-none text-foreground">
                                    {bgTypes.map(t => <option key={t} value={t}>{t}</option>)}
                                </select>
                            </div>

                            {/* Color / Gradient */}
                            {((activeBg || draftBg)?.bg_type === 'solid' || (activeBg || draftBg)?.bg_type === 'gradient') && (
                                <div className="flex items-center gap-3">
                                    {(activeBg || draftBg)?.bg_type === 'solid' ? (
                                        <div className="flex-1 flex gap-2 items-center">
                                            <input type="color" value={(activeBg || draftBg)?.solid_color || 'var(--background)'} onChange={(e) => handleBgFieldChange('solid_color', e.target.value)}
                                                className="w-12 h-10 rounded cursor-pointer border-0 p-0.5 shrink-0 bg-transparent" title="Color Picker" />
                                            <input type="text" value={(activeBg || draftBg)?.solid_color || ''} onChange={(e) => handleBgFieldChange('solid_color', e.target.value)}
                                                className="flex-1 rounded-lg border border-border bg-background/50 px-3 py-2 text-xs focus:outline-none text-foreground font-mono" placeholder="Solid hex color" />
                                        </div>
                                    ) : (
                                        <>
                                            <input type="color" value={(activeBg || draftBg)?.gradient_color_1 || (activeBg || draftBg)?.solid_color || 'var(--background)'} onChange={(e) => handleBgFieldChange('gradient_color_1', e.target.value)}
                                                className="w-12 h-10 rounded cursor-pointer border-0 p-0.5 bg-transparent" title="Color 1" />
                                            <input type="color" value={(activeBg || draftBg)?.gradient_color_2 || (activeBg || draftBg)?.solid_color || 'var(--background)'} onChange={(e) => handleBgFieldChange('gradient_color_2', e.target.value)}
                                                className="w-12 h-10 rounded cursor-pointer border-0 p-0.5 bg-transparent" title="Color 2" />
                                            <select value={(activeBg || draftBg)?.gradient_direction || 'to right'} onChange={(e) => handleBgFieldChange('gradient_direction', e.target.value)}
                                                className="flex-1 rounded-lg border border-border bg-background/50 px-2 py-2 focus:outline-none text-foreground">
                                                <option value="to right">→ Left to Right</option>
                                                <option value="to left">← Right to Left</option>
                                                <option value="to bottom">↓ Top to Bottom</option>
                                                <option value="to top">↑ Bottom to Top</option>
                                                <option value="to bottom right">↘ Diagonal</option>
                                                <option value="to bottom left">↙ Diagonal</option>
                                            </select>
                                        </>
                                    )}
                                </div>
                            )}

                            {/* Image / Video URLs */}
                            {((activeBg || draftBg)?.bg_type === 'image' || (activeBg || draftBg)?.bg_type === 'video') && (
                                <div className="space-y-3">
                                    <label className="block font-bold text-muted-foreground uppercase tracking-wider">Media URLs</label>
                                    {(['desktop', 'tablet', 'mobile'] as const).map(device => {
                                        const bg = activeBg || draftBg;
                                        const fieldKey = (bg?.bg_type === 'image' ? 'image' : 'video') + '_' + device;
                                        return (
                                            <div key={device} className="flex items-center gap-2">
                                                {device === 'desktop' && <Monitor className="h-4 w-4 text-muted-foreground shrink-0" />}
                                                {device === 'tablet' && <Tablet className="h-4 w-4 text-muted-foreground shrink-0" />}
                                                {device === 'mobile' && <Smartphone className="h-4 w-4 text-muted-foreground shrink-0" />}
                                                <input type="text" placeholder={`${device.charAt(0).toUpperCase() + device.slice(1)} URL`}
                                                    value={(bg as any)?.[fieldKey] || ''}
                                                    onChange={(e) => handleBgFieldChange(fieldKey, e.target.value)}
                                                    className="flex-1 rounded-lg border border-border bg-background/50 px-3 py-2 focus:outline-none text-foreground text-xs" />
                                            </div>
                                        );
                                    })}
                                </div>
                            )}

                            {/* CSS Pattern */}
                            {(activeBg || draftBg)?.bg_type === 'pattern' && (
                                <div>
                                    <label className="block font-bold text-muted-foreground mb-1 uppercase tracking-wider">Pattern</label>
                                    <select value={(activeBg || draftBg)?.pattern_type || ''} onChange={(e) => handleBgFieldChange('pattern_type', e.target.value)}
                                        className="w-full rounded-lg border border-border bg-background/50 px-3 py-2 focus:outline-none text-foreground">
                                        <option value="">None</option>
                                        <option value="dots">Dots</option>
                                        <option value="grid">Grid</option>
                                        <option value="stripes">Stripes</option>
                                        <option value="checkers">Checkers</option>
                                        <option value="zigzag">Zigzag</option>
                                    </select>
                                </div>
                            )}

                            {/* Overlay */}
                            <div className="space-y-2">
                                <label className="block font-bold text-muted-foreground uppercase tracking-wider">Overlay</label>
                                <div className="flex items-center gap-3">
                                    <input type="color" value={(activeBg || draftBg)?.overlay_color || '#000000'} onChange={(e) => handleBgFieldChange('overlay_color', e.target.value)}
                                        className="w-9 h-8 rounded cursor-pointer border-0 p-0.5 shrink-0 bg-transparent" />
                                    <span className="text-[10px] text-muted-foreground">0%</span>
                                    <input type="range" min="0" max="100" value={(activeBg || draftBg)?.overlay_opacity || 0} onChange={(e) => handleBgFieldChange('overlay_opacity', parseInt(e.target.value))}
                                        className="flex-1 h-1 accent-brand-magenta cursor-pointer" />
                                    <span className="text-[10px] text-muted-foreground">100%</span>
                                    <span className="font-mono text-muted-foreground w-8 text-right">{(activeBg || draftBg)?.overlay_opacity || 0}%</span>
                                </div>
                                <select value={(activeBg || draftBg)?.overlay_blend_mode || 'normal'} onChange={(e) => handleBgFieldChange('overlay_blend_mode', e.target.value)}
                                    className="w-full rounded-lg border border-border bg-background/50 px-3 py-2 focus:outline-none text-foreground">
                                    <option value="normal">Normal</option>
                                    <option value="multiply">Multiply</option>
                                    <option value="overlay">Overlay</option>
                                    <option value="darken">Darken</option>
                                    <option value="screen">Screen</option>
                                </select>
                            </div>

                            {/* Behavior */}
                            <div className="space-y-3 bg-black/20 p-3 rounded-xl border border-white/5">
                                <label className="block font-bold text-muted-foreground uppercase tracking-wider">Behavior & Layout</label>
                                <div className="flex items-center justify-between">
                                    <span>Parallax Animation Effect</span>
                                    <button onClick={() => handleBgFieldChange('parallax', !(activeBg || draftBg)?.parallax)}
                                        className={`w-9 h-5 rounded-full transition-colors cursor-pointer ${(activeBg || draftBg)?.parallax ? 'bg-brand-magenta' : 'bg-white/20'}`}>
                                        <span className={`block w-4 h-4 rounded-full bg-white transition-transform ${(activeBg || draftBg)?.parallax ? 'translate-x-4' : 'translate-x-0.5'}`} />
                                    </button>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-[10px] text-muted-foreground uppercase mb-1">Attachment</label>
                                        <select value={(activeBg || draftBg)?.attachment || 'scroll'} onChange={(e) => handleBgFieldChange('attachment', e.target.value)}
                                            className="w-full rounded-lg border border-border bg-background/50 px-3 py-2 focus:outline-none text-foreground">
                                            <option value="scroll">Scroll</option>
                                            <option value="fixed">Fixed</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] text-muted-foreground uppercase mb-1">Sizing</label>
                                        <select value={(activeBg || draftBg)?.sizing || 'cover'} onChange={(e) => handleBgFieldChange('sizing', e.target.value)}
                                            className="w-full rounded-lg border border-border bg-background/50 px-3 py-2 focus:outline-none text-foreground">
                                            <option value="cover">Cover</option>
                                            <option value="contain">Contain</option>
                                            <option value="fill">Fill</option>
                                            <option value="repeat">Repeat</option>
                                            <option value="custom">Custom</option>
                                        </select>
                                    </div>
                                </div>
                                {(activeBg || draftBg)?.sizing === 'custom' && (
                                    <div>
                                        <label className="block text-[10px] text-muted-foreground uppercase mb-1">Custom Sizing Position</label>
                                        <select value={(activeBg || draftBg)?.custom_position || 'center'} onChange={(e) => handleBgFieldChange('custom_position', e.target.value)}
                                            className="w-full rounded-lg border border-border bg-background/50 px-3 py-2 focus:outline-none text-foreground">
                                            <option value="center">Center</option>
                                            <option value="top">Top</option>
                                            <option value="bottom">Bottom</option>
                                        </select>
                                    </div>
                                )}
                            </div>

                            {/* Active Status */}
                            <div className="flex items-center justify-between bg-black/20 p-3 rounded-xl border border-white/5">
                                <div>
                                    <label className="block font-bold text-muted-foreground uppercase tracking-wider">Publish Status</label>
                                    <p className="text-[9px] text-muted-foreground mt-0.5">Toggle background visibility on front-end section</p>
                                </div>
                                <button onClick={() => handleBgFieldChange('is_active', !(activeBg || draftBg)?.is_active)}
                                    className={`w-9 h-5 rounded-full transition-colors cursor-pointer ${(activeBg || draftBg)?.is_active !== false ? 'bg-emerald-500' : 'bg-zinc-700 border border-white/20'}`}>
                                    <span className={`block w-4 h-4 rounded-full bg-white transition-transform ${(activeBg || draftBg)?.is_active !== false ? 'translate-x-[18px]' : 'translate-x-0.5'}`} />
                                </button>
                            </div>

                            {/* Save / Create */}
                            <button onClick={handleSaveBackground}
                                className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-brand-blue text-white py-2.5 text-xs font-bold hover:opacity-90 transition cursor-pointer shadow-md">
                                <Save className="h-4 w-4" /> {isNew ? 'Create Background' : 'Save Background Config'}
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Create Page Modal */}
            <AnimatePresence>
                {isCreatePageModalOpen && (
                    <div className="fixed inset-0 bg-black/75 backdrop-blur-md z-50 flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-card border border-white/10 rounded-2xl p-6 max-w-sm w-full shadow-2xl space-y-4">
                            <div className="flex items-center justify-between border-b border-white/5 pb-3">
                                <h3 className="font-display font-bold text-sm tracking-tight">Create New CMS Page</h3>
                                <button onClick={() => setIsCreatePageModalOpen(false)} className="text-muted-foreground hover:text-foreground cursor-pointer"><X className="h-4 w-4" /></button>
                            </div>
                            <form onSubmit={handleCreatePageSubmit} className="space-y-4">
                                <div><label className="block text-[10px] font-bold text-muted-foreground mb-1.5 uppercase">Page Title</label><input type="text" value={newPageTitle} onChange={(e) => setNewPageTitle(e.target.value)} className="w-full rounded-xl border bg-background px-3.5 py-2 text-xs focus:outline-none focus:border-brand-magenta text-foreground" required /></div>
                                <div><label className="block text-[10px] font-bold text-muted-foreground mb-1.5 uppercase">Page Slug</label><input type="text" value={newPageSlug} onChange={(e) => setNewPageSlug(e.target.value)} className="w-full rounded-xl border bg-background px-3.5 py-2 text-xs focus:outline-none focus:border-brand-magenta text-foreground" required /></div>
                                <div className="flex items-center gap-2 pt-2">
                                    <button type="button" onClick={() => setIsCreatePageModalOpen(false)} className="flex-1 rounded-xl border border-white/10 py-2.5 text-xs font-semibold cursor-pointer">Cancel</button>
                                    <button type="submit" className="flex-1 rounded-xl bg-brand-magenta text-white py-2.5 text-xs font-semibold cursor-pointer">Create Page</button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}