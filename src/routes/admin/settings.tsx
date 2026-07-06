import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
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

import { supabase } from "@/lib/supabaseClient";
import { logAudit } from "@/lib/logAudit";

function AdminSettingsPage() {
    const [settings, setSettings] = useState<Record<string, string>>({
        phone: "",
        email: "",
        address: "",
        logo_url: "",
        facebook_url: "",
        linkedin_url: "",
        twitter_url: "",
        instagram_url: "",
        youtube_url: "",
        ga4_measurement_id: "",
        gsc_verification_code: "",
        favicon_url: "",
        theme_accent: "magenta",
        cursor_type: "aperture",
    });

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const { data, error } = await supabase.from('site_settings').select('*');
                if (error) throw error;
                if (data) {
                    const newSettings = { ...settings };
                    data.forEach(item => {
                        newSettings[item.key] = item.value;
                    });
                    setSettings(newSettings);
                }
            } catch (err: any) {
                toast.error(`Failed to load settings: ${err.message}`);
            }
        };
        fetchSettings();
    }, []);

    const handleChange = (key: string, value: string) => {
        setSettings(prev => ({ ...prev, [key]: value }));
    };

    const handleSaveAll = async () => {
        const upserts = Object.keys(settings).map(key => ({ key, value: settings[key] }));
        try {
            const { error } = await supabase.from('site_settings').upsert(upserts, { onConflict: 'key' });
            if (error) throw error;
            await logAudit("Updated site settings", "settings", "global");
            toast.success("Settings saved successfully!");
        } catch (err: any) {
            toast.error(`Failed to save settings: ${err.message}`);
        }
    };

    const handleLogoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
            handleChange("logo_url", reader.result as string);
            toast.success(`${file.name} staged for upload`);
        };
        reader.readAsDataURL(file);
    };

    const handleRemoveLogo = () => {
        handleChange("logo_url", "");
        toast.error("Logo removed from staging");
    };

    const activeColorTheme =
        settings.theme_accent === "magenta"
            ? "from-brand-magenta to-brand-blue"
            : settings.theme_accent === "pink"
                ? "from-brand-pink to-brand-magenta"
                : settings.theme_accent === "cyan"
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
                            type="file"
                            accept="image/*"
                            onChange={handleLogoSelect}
                            className="hidden"
                            id="logo-upload-input"
                        />

                        {settings.logo_url ? (
                            <div className="flex items-center gap-3 bg-white/5 border border-white/5 rounded-xl p-3">
                                <div className="h-12 w-12 rounded-lg overflow-hidden ring-1 ring-border shrink-0 bg-background">
                                    <img src={settings.logo_url} alt="Logo preview" className="h-full w-full object-cover" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-[11px] font-semibold truncate">Logo staged</p>
                                    <span className="text-[9px] text-muted-foreground">Ready to publish</span>
                                </div>
                                <button
                                    onClick={handleRemoveLogo}
                                    className="text-muted-foreground hover:text-brand-pink p-1.5 shrink-0 hover:bg-white/5 rounded-lg"
                                    aria-label="Remove logo"
                                >
                                    <Trash2 className="h-3.5 w-3.5" />
                                </button>
                            </div>
                        ) : (
                            <label
                                htmlFor="logo-upload-input"
                                className="flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-white/10 bg-background/40 py-8 px-4 text-center cursor-pointer hover:border-brand-magenta/40 hover:bg-white/2 transition-all"
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
                                { id: "default", label: "Default (Theme)", color: "bg-white/20" },
                                { id: "magenta", label: "Brand Magenta", color: "bg-brand-magenta" },
                                { id: "pink", label: "Deep Pink", color: "bg-brand-pink" },
                                { id: "cyan", label: "Cool Cyan", color: "bg-brand-cyan" },
                                { id: "blue", label: "Slate Blue", color: "bg-brand-blue" },
                                { id: "emerald", label: "Emerald Green", color: "bg-emerald-500" },
                                { id: "amber", label: "Sunset Orange", color: "bg-amber-500" },
                                { id: "violet", label: "Royal Purple", color: "bg-violet-500" },
                                { id: "rose", label: "Crimson Red", color: "bg-rose-500" },
                            ].map((theme) => (
                                <button
                                    key={theme.id}
                                    onClick={() => handleChange("theme_accent", theme.id)}
                                    className={`flex items-center gap-2 rounded-xl border p-2.5 text-[11px] font-bold transition ${settings.theme_accent === theme.id ? "border-brand-magenta bg-white/5" : "border-white/5 hover:border-white/15"
                                        }`}
                                >
                                    <span className={`h-3 w-3 rounded-full ${theme.color} shrink-0`} />
                                    <span className="truncate">{theme.label}</span>
                                    {settings.theme_accent === theme.id && <Check className="h-3 w-3 text-brand-magenta ml-auto shrink-0" />}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Cursor Type picker */}
                    <div className="border-t border-white/5 pt-4">
                        <label className="block text-[10px] text-muted-foreground mb-2 uppercase font-semibold">
                            Cursor Style
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                            {[
                                { id: "aperture", label: "Aperture (Default)" },
                                { id: "dot", label: "Simple Dot" },
                                { id: "ring", label: "Hollow Ring" },
                                { id: "crosshair", label: "Crosshair" },
                                { id: "trail_only", label: "Comet Trail Only" },
                                { id: "glow_only", label: "Soft Glow Only" },
                                { id: "none", label: "System Default" },
                            ].map((cursor) => (
                                <button
                                    key={cursor.id}
                                    onClick={() => handleChange("cursor_type", cursor.id)}
                                    className={`flex items-center gap-2 rounded-xl border p-2.5 text-[11px] font-bold transition ${settings.cursor_type === cursor.id ? "border-brand-magenta bg-white/5" : "border-white/5 hover:border-white/15"
                                        }`}
                                >
                                    <span className="truncate">{cursor.label}</span>
                                    {settings.cursor_type === cursor.id && <Check className="h-3 w-3 text-brand-magenta ml-auto shrink-0" />}
                                </button>
                            ))}
                        </div>
                    </div>

                    <button
                        onClick={handleSaveAll}
                        className={`mt-5 w-full flex items-center justify-center gap-1.5 rounded-xl bg-linear-to-r ${activeColorTheme} text-white py-2.5 text-xs font-bold shadow-md hover:scale-[1.02] transition`}
                    >
                        <Save className="h-3.5 w-3.5" /> Save All Settings
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
                                value={settings.email}
                                onChange={(e) => handleChange("email", e.target.value)}
                                className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs focus:outline-none focus:border-brand-magenta transition-colors"
                            />
                        </div>
                        <div>
                            <label className="flex items-center gap-1.5 text-[10px] text-muted-foreground mb-1 uppercase font-semibold">
                                <Phone className="h-3 w-3" /> Contact Phone Number
                            </label>
                            <input
                                type="text"
                                value={settings.phone}
                                onChange={(e) => handleChange("phone", e.target.value)}
                                className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs focus:outline-none focus:border-brand-magenta transition-colors"
                            />
                        </div>
                        <div>
                            <label className="flex items-center gap-1.5 text-[10px] text-muted-foreground mb-1 uppercase font-semibold">
                                <MapPin className="h-3 w-3" /> HQ Address Location
                            </label>
                            <textarea
                                rows={3}
                                value={settings.address}
                                onChange={(e) => handleChange("address", e.target.value)}
                                className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs focus:outline-none focus:border-brand-magenta transition-colors resize-none"
                            />
                        </div>
                    </div>

                    <button
                        onClick={handleSaveAll}
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

                    <div className="space-y-3 flex-1">
                        <div>
                            <label className="flex items-center gap-1.5 text-[10px] text-muted-foreground mb-1 uppercase font-semibold">
                                <Linkedin className="h-3 w-3" /> LinkedIn Profile
                            </label>
                            <input
                                type="text"
                                value={settings.linkedin_url}
                                onChange={(e) => handleChange("linkedin_url", e.target.value)}
                                className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs focus:outline-none focus:border-brand-magenta transition-colors"
                            />
                        </div>
                        <div>
                            <label className="flex items-center gap-1.5 text-[10px] text-muted-foreground mb-1 uppercase font-semibold">
                                <Twitter className="h-3 w-3" /> Twitter Profile
                            </label>
                            <input
                                type="text"
                                value={settings.twitter_url}
                                onChange={(e) => handleChange("twitter_url", e.target.value)}
                                className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs focus:outline-none focus:border-brand-magenta transition-colors"
                            />
                        </div>
                        <div>
                            <label className="flex items-center gap-1.5 text-[10px] text-muted-foreground mb-1 uppercase font-semibold">
                                <Globe className="h-3 w-3" /> Facebook Profile
                            </label>
                            <input
                                type="text"
                                value={settings.facebook_url}
                                onChange={(e) => handleChange("facebook_url", e.target.value)}
                                className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs focus:outline-none focus:border-brand-magenta transition-colors"
                            />
                        </div>
                        <div>
                            <label className="flex items-center gap-1.5 text-[10px] text-muted-foreground mb-1 uppercase font-semibold">
                                <Instagram className="h-3 w-3" /> Instagram Profile
                            </label>
                            <input
                                type="text"
                                value={settings.instagram_url}
                                onChange={(e) => handleChange("instagram_url", e.target.value)}
                                className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs focus:outline-none focus:border-brand-magenta transition-colors"
                            />
                        </div>
                        <div>
                            <label className="flex items-center gap-1.5 text-[10px] text-muted-foreground mb-1 uppercase font-semibold">
                                <Globe className="h-3 w-3" /> YouTube Profile
                            </label>
                            <input
                                type="text"
                                value={settings.youtube_url}
                                onChange={(e) => handleChange("youtube_url", e.target.value)}
                                className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs focus:outline-none focus:border-brand-magenta transition-colors"
                            />
                        </div>
                    </div>

                    <button
                        onClick={handleSaveAll}
                        className="w-full rounded-xl bg-brand-blue text-white py-2.5 mt-4 text-xs font-bold shadow-md hover:scale-[1.02] transition"
                    >
                        Save Social Anchors
                    </button>
                </div>
            </div>

            {/* SEO & Tracking Panel */}
            <div className="grid gap-6 lg:grid-cols-3">
                <div className="rounded-2xl border border-white/10 bg-card/40 p-5 backdrop-blur-xl flex flex-col">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4 flex items-center gap-1.5">
                        <Globe className="h-3.5 w-3.5" /> SEO & Analytics
                    </h3>
                    <div className="space-y-3 flex-1">
                        <div>
                            <label className="flex items-center gap-1.5 text-[10px] text-muted-foreground mb-1 uppercase font-semibold">
                                GA4 Measurement ID
                            </label>
                            <input
                                type="text"
                                placeholder="e.g. G-XXXXXXXXXX"
                                value={settings.ga4_measurement_id}
                                onChange={(e) => handleChange("ga4_measurement_id", e.target.value)}
                                className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs focus:outline-none focus:border-brand-magenta transition-colors"
                            />
                        </div>
                        <div>
                            <label className="flex items-center gap-1.5 text-[10px] text-muted-foreground mb-1 uppercase font-semibold">
                                Google Search Console Verification Code
                            </label>
                            <input
                                type="text"
                                placeholder="e.g. abc123def456"
                                value={settings.gsc_verification_code}
                                onChange={(e) => handleChange("gsc_verification_code", e.target.value)}
                                className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs focus:outline-none focus:border-brand-magenta transition-colors"
                            />
                        </div>
                        <div>
                            <label className="flex items-center gap-1.5 text-[10px] text-muted-foreground mb-1 uppercase font-semibold">
                                <ImageIcon className="h-3 w-3" /> Favicon URL
                            </label>
                            <input
                                type="text"
                                placeholder="https://example.com/favicon.ico"
                                value={settings.favicon_url}
                                onChange={(e) => handleChange("favicon_url", e.target.value)}
                                className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs focus:outline-none focus:border-brand-magenta transition-colors"
                            />
                        </div>
                    </div>
                    <button
                        onClick={handleSaveAll}
                        className="w-full rounded-xl bg-gradient-brand text-white py-2.5 mt-4 text-xs font-bold shadow-md hover:scale-[1.02] transition"
                    >
                        Save SEO Config
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