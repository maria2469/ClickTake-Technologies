import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
    AlertCircle
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
}

/* ───────────────── MOCK DATA ───────────────── */

const initialPages: CMSPage[] = [
    {
        id: "home",
        name: "Home Page",
        path: "/",
        blocks: [
            { id: "h1", type: "header", content: "Connecting in a better way." },
            { id: "t1", type: "text", content: "We are a multi-national digital agency bridging premium design, enterprise development, advanced SEO, and autonomous AI systems to deliver compounding growth." },
            { id: "b1", type: "button", content: "Book a Call", meta: "#contact" },
        ],
    },
    {
        id: "about",
        name: "About Us",
        path: "/about",
        blocks: [
            { id: "h2", type: "header", content: "Grow with Us" },
            { id: "t2", type: "text", content: "Learn about ClickTake Technologies — our mission, our multi-national team in Birmingham and Multan, our core values, and open careers." },
            { id: "b2", type: "button", content: "Browse Open Roles", meta: "#careers" },
        ],
    },
    {
        id: "services",
        name: "Services Overview",
        path: "/services",
        blocks: [
            { id: "h3", type: "header", content: "AI-Powered Systems & Digital Buildout" },
            { id: "t3", type: "text", content: "We engineer custom LLMs, high-speed Python backends, headless e-commerce, and high-conversion marketing engines." },
            { id: "b3", type: "button", content: "Get Started Kit", meta: "/services/starter-kit" },
        ],
    },
];

const initialMedia: MediaFile[] = [
    { id: "m1", name: "clicktake-logo.jpg", type: "image", size: "145 KB", url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&q=80" },
    { id: "m2", name: "ai-agent-architecture.pdf", type: "pdf", size: "2.4 MB", url: "#" },
    { id: "m3", name: "promo-reel-2026.mp4", type: "video", size: "15.8 MB", url: "#" },
    { id: "m4", name: "client-testimonial-quote.jpg", type: "image", size: "320 KB", url: "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=400&q=80" },
];

const initialBlogs: BlogPost[] = [
    { id: "b1", title: "Building Headless Storefronts with Shopify and Next.js", author: "Zain Paracha", date: "2026-06-01", status: "Published" },
    { id: "b2", title: "Deploying AI Agents on WhatsApp: A Complete n8n Guide", author: "Adam Kitts", date: "2026-05-28", status: "Published" },
    { id: "b3", title: "SEO Keywords Clustering in 2026: Semantic Search Mapping", author: "Hamza Farooq", date: "2026-06-10", status: "Draft" },
];

/* ───────────────── COMPONENT ───────────────── */

function AdminCMS() {
    // Pages State
    const [pages, setPages] = useState<CMSPage[]>(initialPages);
    const [savedPages, setSavedPages] = useState<CMSPage[]>(initialPages);
    const [selectedPageId, setSelectedPageId] = useState<string>("home");

    // Media Library State
    const [mediaList, setMediaList] = useState<MediaFile[]>(initialMedia);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Blog & Navigation States
    const [blogList, setBlogList] = useState<BlogPost[]>(initialBlogs);
    const [newBlogTitle, setNewBlogTitle] = useState("");
    const [headerLinks, setHeaderLinks] = useState<{ id: string; label: string; to: string }[]>([
        { id: "n1", label: "Home", to: "/" },
        { id: "n2", label: "Services", to: "/services" },
        { id: "n3", label: "Work", to: "/portfolio" },
        { id: "n4", label: "Resources", to: "/resources" },
    ]);
    const [newNavLink, setNewNavLink] = useState({ label: "", to: "" });

    // Modals & Feedback UI States
    const [isCreatePageModalOpen, setIsCreatePageModalOpen] = useState(false);
    const [newPageName, setNewPageName] = useState("");
    const [newPagePath, setNewPagePath] = useState("");
    const [showSavedFeedback, setShowSavedFeedback] = useState(false);

    // Search Filter States
    const [pageSearchText, setPageSearchText] = useState("");
    const [mediaSearchText, setMediaSearchText] = useState("");

    // Selected Page Derived
    const selectedPage = useMemo(() => {
        return pages.find((p) => p.id === selectedPageId) || pages[0] || initialPages[0];
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
    const handleSavePage = () => {
        setSavedPages(pages);
        setShowSavedFeedback(true);
        toast.success(`Published layouts for all ${pages.length} pages to production!`);
        setTimeout(() => {
            setShowSavedFeedback(false);
        }, 2000);
    };

    // Page Creation Form Submit
    const handleCreatePageSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const trimmedName = newPageName.trim();
        let trimmedPath = newPagePath.trim();

        if (!trimmedName) {
            toast.error("Page name is required");
            return;
        }
        if (!trimmedPath) {
            toast.error("Page path is required");
            return;
        }
        if (!trimmedPath.startsWith("/")) {
            trimmedPath = "/" + trimmedPath;
        }

        // Check path and name uniqueness
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
                { id: `b-t-${Date.now()}`, type: "text", content: "This is a brand new page. You can customize the blocks and content on the canvas." }
            ]
        };

        setPages([...pages, newPage]);
        setSelectedPageId(newId);
        setIsCreatePageModalOpen(false);
        setNewPageName("");
        setNewPagePath("");
        toast.success(`Created page "${trimmedName}" successfully!`);
    };

    // Page Deletion Action
    const handleDeletePage = (pageId: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (pages.length <= 1) {
            toast.error("Cannot delete the only page in the CMS. You must have at least one active page.");
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
            case "header":
                content = "New Section Header";
                break;
            case "text":
                content = "Write your paragraph text details here.";
                break;
            case "button":
                content = "Click Action";
                meta = "#";
                break;
            case "media":
                content = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80";
                break;
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
        toast.success(`Added ${type.toUpperCase()} block to layout`);
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
        toast.info(`Moved block ${direction}`);
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
        toast.error("Block deleted from page layout");
    };

    // Real File Selection Handler
    const handleFilesSelected = (files: FileList) => {
        const addedFiles: MediaFile[] = [];
        Array.from(files).forEach((file) => {
            let type: "image" | "pdf" | "video" = "image";
            if (file.type.startsWith("video/")) {
                type = "video";
            } else if (file.type === "application/pdf") {
                type = "pdf";
            }

            // Human readable size formatter
            let sizeStr = "";
            const bytes = file.size;
            if (bytes < 1024) {
                sizeStr = `${bytes} B`;
            } else if (bytes < 1024 * 1024) {
                sizeStr = `${(bytes / 1024).toFixed(1)} KB`;
            } else {
                sizeStr = `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
            }

            const objectUrl = URL.createObjectURL(file);
            addedFiles.push({
                id: `m-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                name: file.name,
                type,
                size: sizeStr,
                url: objectUrl
            });
        });

        if (addedFiles.length > 0) {
            setMediaList([...addedFiles, ...mediaList]);
            toast.success(`Successfully uploaded ${addedFiles.length} file(s) to Media Library`);
        }
    };

    // Drag-and-drop Events
    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleFilesSelected(e.dataTransfer.files);
        }
    };

    // Mock Upload backup button action
    const handleAddMediaMock = () => {
        const randomImg = [
            "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=400&q=80",
            "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&q=80",
        ][Math.floor(Math.random() * 2)];

        const newMediaItem: MediaFile = {
            id: `m${Date.now()}`,
            name: `screenshot_${Math.floor(Math.random() * 1000)}.jpg`,
            type: "image",
            size: "248 KB",
            url: randomImg,
        };

        setMediaList([newMediaItem, ...mediaList]);
        toast.success("Uploaded mock asset to Media Library");
    };

    const handleDeleteMedia = (id: string) => {
        const deletedAsset = mediaList.find((m) => m.id === id);
        setMediaList(mediaList.filter((m) => m.id !== id));
        toast.error(`Asset "${deletedAsset?.name || "file"}" deleted from library`);
    };

    const handleAddBlogPost = () => {
        if (!newBlogTitle.trim()) return;
        const newPost: BlogPost = {
            id: `b${Date.now()}`,
            title: newBlogTitle.trim(),
            author: "Super Admin",
            date: new Date().toISOString().split("T")[0],
            status: "Draft",
        };
        setBlogList([newPost, ...blogList]);
        setNewBlogTitle("");
        toast.success(`Blog post draft "${newPost.title}" created`);
    };

    const handleDeleteBlog = (id: string) => {
        const deletedBlog = blogList.find((b) => b.id === id);
        setBlogList(blogList.filter((b) => b.id !== id));
        toast.error(`Blog post "${deletedBlog?.title}" deleted`);
    };

    const handleAddNavLink = () => {
        if (!newNavLink.label || !newNavLink.to) return;
        setHeaderLinks([...headerLinks, { id: `n${Date.now()}`, ...newNavLink }]);
        toast.success(`Navigation link "${newNavLink.label}" added to menu`);
        setNewNavLink({ label: "", to: "" });
    };

    const handleDeleteNavLink = (id: string) => {
        const deletedLink = headerLinks.find((l) => l.id === id);
        setHeaderLinks(headerLinks.filter((l) => l.id !== id));
        toast.error(`Navigation link "${deletedLink?.label}" removed`);
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
                    <h1 className="font-display text-2xl font-bold tracking-tight">CMS Website Engine</h1>
                    <p className="text-xs text-muted-foreground mt-1">
                        Manage pages, layout blocks, assets, and navigation menus.
                    </p>
                </div>
                <div className="hidden sm:flex items-center gap-1.5 rounded-full bg-white/5 border border-white/5 px-3 py-1.5 text-[10px] font-bold text-muted-foreground">
                    <FileText className="h-3.5 w-3.5" />
                    {pages.length} Pages Live
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-4">
                {/* Page Manager Sidebar */}
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

                        {/* Page search */}
                        <div className="relative mb-3">
                            <Search className="absolute left-2.5 top-1/2 h-3 w-3 -translate-y-1/2 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="Search pages..."
                                value={pageSearchText}
                                onChange={(e) => setPageSearchText(e.target.value)}
                                className="w-full rounded-lg border border-border bg-background/50 pl-8 pr-2.5 py-1 text-[11px] focus:outline-none text-foreground"
                            />
                            {pageSearchText && (
                                <button
                                    onClick={() => setPageSearchText("")}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                >
                                    <X className="h-2.5 w-2.5" />
                                </button>
                            )}
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

                                    {/* Page Delete hover icon */}
                                    <button
                                        onClick={(e) => handleDeletePage(p.id, e)}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-muted-foreground hover:text-rose-400 bg-card/90 backdrop-blur-sm border border-white/5 transition-opacity cursor-pointer shadow"
                                        title="Delete Page"
                                    >
                                        <Trash2 className="h-3 w-3" />
                                    </button>
                                </div>
                            ))}
                            {filteredPages.length === 0 && (
                                <div className="text-center py-4 text-[11px] text-muted-foreground">
                                    No pages match query
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Blog posts list manager */}
                    <div className="rounded-2xl border border-white/10 bg-card/40 p-4 backdrop-blur-xl">
                        <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
                            Blog & News Feed
                        </div>

                        {blogList.length === 0 ? (
                            <div className="flex flex-col items-center justify-center text-center py-6">
                                <Inbox className="h-6 w-6 text-muted-foreground mb-1.5" />
                                <p className="text-[11px] font-semibold">No posts yet</p>
                            </div>
                        ) : (
                            <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1">
                                {blogList.map((blog) => (
                                    <div key={blog.id} className="flex items-center justify-between rounded-xl bg-white/5 p-2.5 text-[11px]">
                                        <div className="overflow-hidden mr-2">
                                            <p className="font-semibold truncate leading-snug text-foreground">{blog.title}</p>
                                            <span className="text-[9px] text-muted-foreground">{blog.date} • {blog.status}</span>
                                        </div>
                                        <button
                                            onClick={() => handleDeleteBlog(blog.id)}
                                            className="text-muted-foreground hover:text-rose-400 p-1 shrink-0 cursor-pointer"
                                        >
                                            <Trash2 className="h-3.5 w-3.5" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

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

                {/* Visual Canvas layout editor */}
                <div className="lg:col-span-2 space-y-6">
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
                                    showSavedFeedback
                                        ? "bg-emerald-600 hover:bg-emerald-700 scale-100"
                                        : "bg-gradient-to-r from-brand-magenta to-brand-blue hover:scale-[1.02]"
                                }`}
                            >
                                {showSavedFeedback ? (
                                    <>
                                        <Check className="h-3.5 w-3.5 animate-bounce" /> Saved!
                                    </>
                                ) : (
                                    <>
                                        <Save className="h-3.5 w-3.5" /> Save layout
                                    </>
                                )}
                            </button>
                        </div>

                        {/* Canvas Simulator Area */}
                        <div className="border border-white/5 bg-background/50 rounded-xl p-4 space-y-4 max-h-[380px] overflow-y-auto min-h-[300px]">
                            <div className="text-[9px] uppercase tracking-widest text-muted-foreground border-b border-white/5 pb-1 font-bold">
                                Live Render Preview
                            </div>

                            {selectedPage?.blocks.map((block, index) => (
                                <div
                                    key={block.id}
                                    className="group relative border border-dashed border-white/10 hover:border-brand-magenta/40 p-4 rounded-xl transition"
                                >
                                    {/* Block Hover Actions */}
                                    <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition flex items-center gap-1.5 z-10 bg-card/90 backdrop-blur-sm p-1 rounded-lg border border-white/10 shadow">
                                        <button
                                            disabled={index === 0}
                                            onClick={(e) => handleMoveBlock(block.id, "up", e)}
                                            className="text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:pointer-events-none p-1 transition cursor-pointer"
                                            title="Move Up"
                                        >
                                            <ChevronUp className="h-3.5 w-3.5" />
                                        </button>
                                        <button
                                            disabled={index === (selectedPage.blocks.length - 1)}
                                            onClick={(e) => handleMoveBlock(block.id, "down", e)}
                                            className="text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:pointer-events-none p-1 transition cursor-pointer"
                                            title="Move Down"
                                        >
                                            <ChevronDown className="h-3.5 w-3.5" />
                                        </button>
                                        <button
                                            onClick={(e) => handleDeleteBlock(block.id, e)}
                                            className="text-muted-foreground hover:text-rose-400 p-1 transition cursor-pointer"
                                            title="Delete Block"
                                        >
                                            <Trash2 className="h-3.5 w-3.5" />
                                        </button>
                                        <span className="text-[9px] uppercase font-mono bg-white/10 px-1.5 py-0.5 rounded text-muted-foreground">
                                            {block.type}
                                        </span>
                                    </div>

                                    {block.type === "header" && (
                                        <h2 className="font-display text-xl font-bold tracking-tight text-gradient">
                                            {block.content}
                                        </h2>
                                    )}

                                    {block.type === "text" && (
                                        <p className="text-xs text-muted-foreground leading-relaxed">{block.content}</p>
                                    )}

                                    {block.type === "button" && (
                                        <div className="pt-2">
                                            <span className="inline-flex rounded-full bg-gradient-brand px-4 py-1.5 text-[11px] font-bold text-white shadow">
                                                {block.content}
                                            </span>
                                            <span className="ml-2 text-[9px] text-muted-foreground font-mono">({block.meta})</span>
                                        </div>
                                    )}

                                    {block.type === "media" && (
                                        <div className="my-2 rounded-lg overflow-hidden border border-white/5 bg-black/20 max-h-48 flex items-center justify-center p-2">
                                            {block.content ? (
                                                <img src={block.content} className="max-h-40 object-contain rounded" alt="CMS Media Block" />
                                            ) : (
                                                <div className="p-8 text-xs text-muted-foreground flex items-center gap-1.5">
                                                    <AlertCircle className="h-3.5 w-3.5" /> No image source URL
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    <div className="mt-3 hidden group-hover:block border-t border-white/5 pt-3">
                                        <label className="block text-[10px] text-muted-foreground mb-1 uppercase tracking-wider">
                                            {block.type === "media" ? "Media URL / Link" : "Edit Content"}
                                        </label>
                                        <input
                                            type="text"
                                            value={block.content}
                                            onChange={(e) => handleUpdateBlockContent(block.id, e.target.value)}
                                            className="w-full rounded-lg border border-border bg-card px-3 py-1.5 text-xs text-foreground focus:outline-none focus:border-brand-magenta transition-colors"
                                        />
                                        {block.type === "button" && (
                                            <div className="mt-2">
                                                <label className="block text-[10px] text-muted-foreground mb-1 uppercase tracking-wider">
                                                    Button Link (to)
                                                </label>
                                                <input
                                                    type="text"
                                                    value={block.meta || ""}
                                                    onChange={(e) => handleUpdateBlockMeta(block.id, e.target.value)}
                                                    className="w-full rounded-lg border border-border bg-card px-3 py-1.5 text-xs text-foreground focus:outline-none focus:border-brand-magenta transition-colors"
                                                />
                                            </div>
                                        )}
                                        {block.type === "media" && (
                                            <p className="text-[9px] text-muted-foreground mt-1">
                                                Tip: Copy any uploaded asset link from the Media Library on the right.
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ))}

                            {(!selectedPage || selectedPage.blocks.length === 0) && (
                                <div className="flex flex-col items-center justify-center text-center py-12 text-muted-foreground">
                                    <Inbox className="h-8 w-8 mb-2 opacity-40" />
                                    <p className="text-xs font-semibold">No blocks on this page layout</p>
                                    <p className="text-[10px] opacity-75 mt-0.5">Use the creator tools below to insert elements.</p>
                                </div>
                            )}
                        </div>

                        {/* Block Creator Buttons */}
                        <div className="mt-4 border-t border-white/5 pt-4">
                            <span className="block text-[10px] uppercase font-bold text-muted-foreground mb-2.5 tracking-wider">
                                Insert Layout Block
                            </span>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                <button
                                    onClick={() => handleAddBlock("header")}
                                    className="flex items-center justify-center gap-1.5 rounded-xl border border-white/10 hover:border-brand-magenta/40 bg-white/5 hover:bg-white/10 px-3 py-2 text-xs font-semibold text-foreground transition cursor-pointer"
                                >
                                    <Plus className="h-3.5 w-3.5 text-brand-magenta" /> Header
                                </button>
                                <button
                                    onClick={() => handleAddBlock("text")}
                                    className="flex items-center justify-center gap-1.5 rounded-xl border border-white/10 hover:border-brand-magenta/40 bg-white/5 hover:bg-white/10 px-3 py-2 text-xs font-semibold text-foreground transition cursor-pointer"
                                >
                                    <Plus className="h-3.5 w-3.5 text-brand-magenta" /> Text
                                </button>
                                <button
                                    onClick={() => handleAddBlock("button")}
                                    className="flex items-center justify-center gap-1.5 rounded-xl border border-white/10 hover:border-brand-magenta/40 bg-white/5 hover:bg-white/10 px-3 py-2 text-xs font-semibold text-foreground transition cursor-pointer"
                                >
                                    <Plus className="h-3.5 w-3.5 text-brand-magenta" /> Button
                                </button>
                                <button
                                    onClick={() => handleAddBlock("media")}
                                    className="flex items-center justify-center gap-1.5 rounded-xl border border-white/10 hover:border-brand-magenta/40 bg-white/5 hover:bg-white/10 px-3 py-2 text-xs font-semibold text-foreground transition cursor-pointer"
                                >
                                    <Plus className="h-3.5 w-3.5 text-brand-magenta" /> Media
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Media Library & Menus */}
                <div className="space-y-4">
                    {/* Media Grid */}
                    <div className="rounded-2xl border border-white/10 bg-card/40 p-4 backdrop-blur-xl flex flex-col">
                        <div className="flex items-center justify-between mb-3 gap-2">
                            <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Media Library</div>
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="flex items-center gap-1.5 rounded-lg bg-white/5 border border-white/5 px-2.5 py-1 text-[10px] hover:bg-white/10 font-bold transition cursor-pointer shrink-0"
                            >
                                <Upload className="h-3 w-3 text-brand-cyan" /> Upload File
                            </button>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={(e) => {
                                    if (e.target.files && e.target.files.length > 0) {
                                        handleFilesSelected(e.target.files);
                                    }
                                }}
                                multiple
                                accept="image/*,application/pdf,video/*"
                                className="hidden"
                            />
                        </div>

                        {/* Search Media Library */}
                        <div className="relative mb-3">
                            <Search className="absolute left-2.5 top-1/2 h-3 w-3 -translate-y-1/2 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="Search library..."
                                value={mediaSearchText}
                                onChange={(e) => setMediaSearchText(e.target.value)}
                                className="w-full rounded-lg border border-border bg-background/50 pl-8 pr-2.5 py-1 text-[11px] focus:outline-none text-foreground"
                            />
                            {mediaSearchText && (
                                <button
                                    onClick={() => setMediaSearchText("")}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                >
                                    <X className="h-2.5 w-2.5" />
                                </button>
                            )}
                        </div>

                        {/* Drag & Drop Zone */}
                        <div
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            className={`border border-dashed rounded-xl p-3 mb-3 text-center transition-all flex flex-col items-center justify-center min-h-[90px] ${
                                isDragging
                                    ? "border-brand-magenta bg-brand-magenta/10 scale-[0.98] shadow-glow"
                                    : "border-white/10 hover:border-brand-magenta/30 bg-background/20 hover:bg-background/40"
                            }`}
                        >
                            <Upload className={`h-5 w-5 mb-1.5 transition-transform duration-300 ${isDragging ? "animate-bounce text-brand-magenta" : "text-muted-foreground"}`} />
                            <p className="text-[10px] font-semibold text-foreground">
                                {isDragging ? "Drop to upload!" : "Drag & drop files here"}
                            </p>
                            <p className="text-[8px] text-muted-foreground mt-0.5">
                                or click "Upload File" above
                            </p>
                        </div>

                        {filteredMediaList.length === 0 ? (
                            <div className="flex flex-col items-center justify-center text-center py-6">
                                <ImageIcon className="h-6 w-6 text-muted-foreground mb-1.5" />
                                <p className="text-[10px] font-semibold text-muted-foreground">No assets found</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto pr-1">
                                {filteredMediaList.map((file) => (
                                    <div key={file.id} className="relative group rounded-lg border border-white/5 overflow-hidden bg-background">
                                        {file.type === "image" ? (
                                            <img src={file.url} className="h-16 w-full object-cover" alt="" />
                                        ) : (
                                            <div className="h-16 w-full flex items-center justify-center bg-white/5 text-[10px] font-bold text-muted-foreground">
                                                {file.type.toUpperCase()}
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-black/75 opacity-0 group-hover:opacity-100 flex flex-col justify-between p-1 transition-all">
                                            <span className="text-[8px] text-white truncate font-semibold" title={file.name}>
                                                {file.name}
                                            </span>
                                            
                                            {/* File Asset URL Clipboard Copier */}
                                            {file.url && file.url !== "#" && (
                                                <button
                                                    onClick={() => {
                                                        navigator.clipboard.writeText(file.url);
                                                        toast.success(`Copied URL for "${file.name}"`);
                                                    }}
                                                    className="bg-brand-blue/80 hover:bg-brand-blue text-white rounded px-1.5 py-0.5 text-[8px] font-bold mx-auto select-all cursor-pointer transition shadow"
                                                >
                                                    Copy Link
                                                </button>
                                            )}

                                            <div className="flex items-center justify-between mt-auto">
                                                <span className="text-[7px] text-white/70">{file.size}</span>
                                                <Trash2
                                                    className="h-3 w-3 text-rose-400 cursor-pointer hover:scale-110"
                                                    onClick={() => handleDeleteMedia(file.id)}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                        <button
                            onClick={handleAddMediaMock}
                            className="mt-2 text-[9px] text-brand-magenta hover:underline text-left cursor-pointer"
                        >
                            + Quick Add Mock Image Asset
                        </button>
                    </div>

                    {/* Navigation Menu Editor */}
                    <div className="rounded-2xl border border-white/10 bg-card/40 p-4 backdrop-blur-xl">
                        <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
                            Header Navigation Menu
                        </div>

                        {headerLinks.length === 0 ? (
                            <div className="flex flex-col items-center justify-center text-center py-6 mb-3">
                                <p className="text-[11px] font-semibold text-muted-foreground">No nav links yet</p>
                            </div>
                        ) : (
                            <div className="space-y-1.5 max-h-36 overflow-y-auto mb-3 pr-1">
                                {headerLinks.map((link) => (
                                    <div key={link.id} className="flex items-center justify-between rounded-xl bg-white/5 px-3 py-1.5 text-[11px]">
                                        <span className="font-semibold text-foreground">{link.label}</span>
                                        <span className="font-mono text-muted-foreground text-[9px]">{link.to}</span>
                                        <Trash2
                                            className="h-3 w-3 text-muted-foreground hover:text-rose-400 cursor-pointer"
                                            onClick={() => handleDeleteNavLink(link.id)}
                                        />
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="space-y-2 border-t border-white/5 pt-3">
                            <div className="grid grid-cols-2 gap-1.5">
                                <input
                                    type="text"
                                    placeholder="Label"
                                    value={newNavLink.label}
                                    onChange={(e) => setNewNavLink({ ...newNavLink, label: e.target.value })}
                                    className="rounded-lg border border-border bg-background px-2 py-1 text-[10px] text-foreground focus:outline-none focus:border-brand-magenta transition-colors"
                                />
                                <input
                                    type="text"
                                    placeholder="Route"
                                    value={newNavLink.to}
                                    onChange={(e) => setNewNavLink({ ...newNavLink, to: e.target.value })}
                                    className="rounded-lg border border-border bg-background px-2 py-1 text-[10px] text-foreground focus:outline-none focus:border-brand-magenta transition-colors"
                                />
                            </div>
                            <button
                                onClick={handleAddNavLink}
                                className="w-full rounded-lg bg-brand-blue text-white py-1.5 text-[10px] font-bold shadow-md hover:opacity-90 transition cursor-pointer"
                            >
                                Add Navigation Link
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Page Creation Modal */}
            <AnimatePresence>
                {isCreatePageModalOpen && (
                    <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-card border border-white/10 rounded-2xl p-6 max-w-sm w-full shadow-elegant space-y-4 text-foreground"
                        >
                            <div className="flex items-center justify-between border-b border-white/5 pb-3">
                                <h3 className="font-display font-bold text-sm tracking-tight">Create New CMS Page</h3>
                                <button
                                    onClick={() => {
                                        setIsCreatePageModalOpen(false);
                                        setNewPageName("");
                                        setNewPagePath("");
                                    }}
                                    className="text-muted-foreground hover:text-foreground p-1 rounded transition cursor-pointer"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </div>
                            <form onSubmit={handleCreatePageSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-[10px] uppercase font-bold text-muted-foreground mb-1.5 tracking-wider">
                                        Page Name
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Portfolio"
                                        value={newPageName}
                                        onChange={(e) => setNewPageName(e.target.value)}
                                        className="w-full rounded-xl border border-border bg-background px-3.5 py-2 text-xs text-foreground focus:outline-none focus:border-brand-magenta transition-colors"
                                        required
                                        autoFocus
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] uppercase font-bold text-muted-foreground mb-1.5 tracking-wider">
                                        Page Path / Route
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="e.g. /portfolio"
                                        value={newPagePath}
                                        onChange={(e) => setNewPagePath(e.target.value)}
                                        className="w-full rounded-xl border border-border bg-background px-3.5 py-2 text-xs text-foreground focus:outline-none focus:border-brand-magenta transition-colors"
                                        required
                                    />
                                    <p className="text-[9px] text-muted-foreground mt-1">
                                        Must start with / and be a unique route.
                                    </p>
                                </div>
                                <div className="flex items-center gap-2 pt-2">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsCreatePageModalOpen(false);
                                            setNewPageName("");
                                            setNewPagePath("");
                                        }}
                                        className="flex-1 rounded-xl border border-white/10 hover:bg-white/5 py-2.5 text-xs font-semibold transition text-center cursor-pointer"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 rounded-xl bg-brand-magenta text-white py-2.5 text-xs font-semibold shadow-md hover:opacity-90 transition text-center cursor-pointer"
                                    >
                                        Create Page
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}