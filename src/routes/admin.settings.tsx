import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef } from "react";
import { motion } from "framer-motion";
import {
    Settings,
    Image as ImageIcon,
    Upload,
    Trash2,
    Save,
    Mail,
    Phone,
    MapPin,
    Linkedin,
    Twitter,
    Github,
    Instagram,
    Globe,
    Check,
    Sparkles,
    RefreshCw,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/settings")({
    head: () => ({
        meta: [
            { title: "Config Settings — ClickTake Admin" },
            { name: "description", content: "Manage corporate branding, contact info, and social handles." },
        ],
    }),
    component: AdminSettingsPage,
});

interface SocialLink {
    id: string;
    platform: "linkedin" | "x" | "github" | "instagram";
    label: string;
    handle: string;
}

function AdminSettingsPage() {
    // Branding
    const [themeAccent, setThemeAccent] = useState("magenta");
    const [logoPreview, setLogoPreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Contact info — pre-filled with sample data, consistent with admin/index.tsx
    const [contactConfig, setContactConfig] = useState({
        email: "hello@clicktake.co",
        phone: "+44 121 288 8820",
        address: "Colmore Row, Birmingham, B3 3AG, UK",
    });

    // Social links — pre-filled, editable list
    const [socialLinks, setSocialLinks] = useState<SocialLink[]>([
        { id: "s1", platform: "linkedin", label: "LinkedIn Profile", handle: "linkedin.com/company/clicktake" },
        { id: "s2", platform: "x", label: "X (Twitter) Handle", handle: "x.com/clicktake" },
        { id: "s3", platform: "github", label: "GitHub Organization", handle: "github.com/clicktake-tech" },
        { id: "s4", platform: "instagram", label: "Instagram Handle", handle: "instagram.com/clicktake.tech" },
    ]);

    const platformIcon = (platform: SocialLink["platform"]) => {
        switch (platform) {
            case "linkedin":
                return Linkedin;
            case "x":
                return Twitter;
            case "github":
                return Github;
            case "instagram":
                return Instagram;
            default:
                return Globe;
        }
    };

    const handleLogoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => setLogoPreview(reader.result as string);
        reader.readAsDataURL(file);
        toast.success(`${file.name} staged for upload`);
    };

    const handleRemoveLogo = () => {
        setLogoPreview(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
        toast.error("Logo removed from staging");
    };

    const handleSocialChange = (id: string, value: string) => {
        setSocialLinks((prev) => prev.map((s) => (s.id === id ? { ...s, handle: value } : s)));
    };

    const handleSaveContact = () => {
        toast.success("Contact settings committed to API endpoints");
    };

    const handleSaveSocial = () => {
        toast.success("Social anchors synchronized");
    };

    const handleSaveBranding = () => {
        toast.success("Branding preferences saved successfully");
    };

    const activeColorTheme =
        themeAccent === "magenta"
            ? "from-brand-magenta to-brand-blue"
            : themeAccent === "pink"
                ? "from-brand-pink to-brand-magenta"
                : themeAccent === "cyan"
                    ? "from-brand-cyan to-brand-blue"
                    : "from-brand-pink to-brand-cyan";

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
                    <h1 className="font-display text-2xl font-bold tracking-tight">Configuration Settings</h1>
                    <p className="text-xs text-muted-foreground mt-1">
                        Manage corporate branding assets, contact handles, and social profile anchors.
                    </p>
                </div>
                <div className="hidden sm:flex items-center gap-1.5 rounded-full bg-white/5 border border-white/5 px-3 py-1.5 text-[10px] font-bold text-muted-foreground">
                    <Settings className="h-3.5 w-3.5" />
                    Global Site Config
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                {/* Branding & Logo Panel */}
                <div className="rounded-2xl border border-white/10 bg-card/40 p-5 backdrop-blur-xl flex flex-col">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">
                        Branding & Logo
                    </h3>

                    {/* Logo Dropzone — empty state */}
                    <div className="mb-5">
                        <label className="block text-[10px] text-muted-foreground mb-2 uppercase font-semibold">
                            Site Logo / Favicon
                        </label>

                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleLogoSelect}
                            className="hidden"
                            id="logo-upload-input"
                        />

                        {logoPreview ? (
                            <div className="flex items-center gap-3 bg-white/5 border border-white/5 rounded-xl p-3">
                                <div className="h-12 w-12 rounded-lg overflow-hidden ring-1 ring-border shrink-0 bg-background">
                                    <img src={logoPreview} alt="Logo preview" className="h-full w-full object-cover" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-[11px] font-semibold truncate">Logo staged</p>
                                    <span className="text-[9px] text-muted-foreground">Ready to publish</span>
                                </div>
                                <button
                                    onClick={handleRemoveLogo}
                                    className="text-muted-foreground hover:text-rose-400 p-1.5 shrink-0"
                                    aria-label="Remove logo"
                                >
                                    <Trash2 className="h-3.5 w-3.5" />
                                </button>
                            </div>
                        ) : (
                            <label
                                htmlFor="logo-upload-input"
                                className="flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-white/10 bg-background/40 py-8 px-4 text-center cursor-pointer hover:border-brand-magenta/40 hover:bg-white/[0.02] transition-all"
                            >
                                <div className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center">
                                    <ImageIcon className="h-4.5 w-4.5 text-muted-foreground" />
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-foreground">No logo uploaded yet</p>
                                    <p className="text-[9px] text-muted-foreground mt-0.5">
                                        Drag & drop or click to upload — PNG, SVG up to 2MB
                                    </p>
                                </div>
                                <span className="mt-1 inline-flex items-center gap-1 rounded-lg bg-white/5 border border-white/10 px-2.5 py-1 text-[9px] font-bold text-muted-foreground">
                                    <Upload className="h-3 w-3" /> Choose File
                                </span>
                            </label>
                        )}
                    </div>

                    {/* Accent color picker */}
                    <div className="border-t border-white/5 pt-4">
                        <label className="block text-[10px] text-muted-foreground mb-2 uppercase font-semibold">
                            Color Palette Accent
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                            {[
                                { id: "magenta", label: "Brand Magenta", color: "bg-brand-magenta" },
                                { id: "pink", label: "Deep Pink", color: "bg-brand-pink" },
                                { id: "cyan", label: "Cool Cyan", color: "bg-brand-cyan" },
                                { id: "blue", label: "Slate Blue", color: "bg-brand-blue" },
                            ].map((theme) => (
                                <button
                                    key={theme.id}
                                    onClick={() => setThemeAccent(theme.id)}
                                    className={`flex items-center gap-2 rounded-xl border p-2.5 text-[11px] font-bold transition ${themeAccent === theme.id ? "border-brand-magenta bg-white/5" : "border-white/5 hover:border-white/15"
                                        }`}
                                >
                                    <span className={`h-3 w-3 rounded-full ${theme.color} shrink-0`} />
                                    <span className="truncate">{theme.label}</span>
                                    {themeAccent === theme.id && <Check className="h-3 w-3 text-brand-magenta ml-auto shrink-0" />}
                                </button>
                            ))}
                        </div>
                    </div>

                    <button
                        onClick={handleSaveBranding}
                        className={`mt-5 w-full flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r ${activeColorTheme} text-white py-2.5 text-xs font-bold shadow-md hover:scale-[1.02] transition`}
                    >
                        <Save className="h-3.5 w-3.5" /> Save Branding
                    </button>
                </div>

                {/* Contact Information Panel */}
                <div className="rounded-2xl border border-white/10 bg-card/40 p-5 backdrop-blur-xl flex flex-col">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">
                        Contact Information
                    </h3>

                    <div className="space-y-3 flex-1">
                        <div>
                            <label className="flex items-center gap-1.5 text-[10px] text-muted-foreground mb-1 uppercase font-semibold">
                                <Mail className="h-3 w-3" /> Corporate Email Address
                            </label>
                            <input
                                type="email"
                                value={contactConfig.email}
                                onChange={(e) => setContactConfig({ ...contactConfig, email: e.target.value })}
                                className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs focus:outline-none focus:border-brand-magenta transition-colors"
                            />
                        </div>
                        <div>
                            <label className="flex items-center gap-1.5 text-[10px] text-muted-foreground mb-1 uppercase font-semibold">
                                <Phone className="h-3 w-3" /> Contact Phone Number
                            </label>
                            <input
                                type="text"
                                value={contactConfig.phone}
                                onChange={(e) => setContactConfig({ ...contactConfig, phone: e.target.value })}
                                className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs focus:outline-none focus:border-brand-magenta transition-colors"
                            />
                        </div>
                        <div>
                            <label className="flex items-center gap-1.5 text-[10px] text-muted-foreground mb-1 uppercase font-semibold">
                                <MapPin className="h-3 w-3" /> HQ Address Location
                            </label>
                            <textarea
                                rows={3}
                                value={contactConfig.address}
                                onChange={(e) => setContactConfig({ ...contactConfig, address: e.target.value })}
                                className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs focus:outline-none focus:border-brand-magenta transition-colors resize-none"
                            />
                        </div>
                    </div>

                    <button
                        onClick={handleSaveContact}
                        className="w-full rounded-xl bg-brand-magenta text-white py-2.5 text-xs font-bold shadow-md hover:scale-[1.02] transition mt-4"
                    >
                        Update Contact Profile
                    </button>
                </div>

                {/* Social Media Anchors Panel */}
                <div className="rounded-2xl border border-white/10 bg-card/40 p-5 backdrop-blur-xl flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                            Social Media Profile Anchors
                        </h3>
                        <Sparkles className="h-3.5 w-3.5 text-brand-magenta" />
                    </div>

                    {socialLinks.length === 0 ? (
                        <div className="flex-1 flex flex-col items-center justify-center text-center py-10">
                            <Globe className="h-8 w-8 text-muted-foreground mb-2" />
                            <p className="text-xs font-semibold">No social profiles linked</p>
                            <p className="text-[10px] text-muted-foreground mt-1">Add a platform to get started</p>
                        </div>
                    ) : (
                        <div className="space-y-3 flex-1">
                            {socialLinks.map((link) => {
                                const Icon = platformIcon(link.platform);
                                return (
                                    <div key={link.id}>
                                        <label className="flex items-center gap-1.5 text-[10px] text-muted-foreground mb-1 uppercase font-semibold">
                                            <Icon className="h-3 w-3" /> {link.label}
                                        </label>
                                        <input
                                            type="text"
                                            value={link.handle}
                                            onChange={(e) => handleSocialChange(link.id, e.target.value)}
                                            className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs focus:outline-none focus:border-brand-magenta transition-colors"
                                        />
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    <button
                        onClick={handleSaveSocial}
                        className="w-full rounded-xl bg-brand-blue text-white py-2.5 mt-4 text-xs font-bold shadow-md hover:scale-[1.02] transition"
                    >
                        Save Social Anchors
                    </button>
                </div>
            </div>

            {/* Footer status strip */}
            <div className="rounded-2xl border border-white/10 bg-card/40 p-4 backdrop-blur-xl flex items-center justify-between">
                <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                    <RefreshCw className="h-3.5 w-3.5 text-brand-cyan" />
                    Changes sync to production within 60 seconds of saving
                </div>
                <span className="text-[9px] font-mono text-muted-foreground">clicktake.co/config</span>
            </div>
        </motion.div>
    );
}