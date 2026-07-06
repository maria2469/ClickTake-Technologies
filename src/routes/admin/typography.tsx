import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useMemo, useRef } from "react";
import { supabase } from "@/lib/supabaseClient";
import { motion } from "framer-motion";
import {
    Save, Search, X, Check, Upload, Type, Eye, RotateCcw,
    ChevronDown, ChevronUp, Trash2, Plus, FileText, RefreshCw
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/typography")({
    head: () => ({
        meta: [
            { title: "Typography Engine — ClickTake Admin Portal" },
            { name: "description", content: "Manage fonts, typography settings, and font pairing presets." },
        ],
    }),
    component: TypographyManager,
});

/* ─── Types ─── */

interface FontConfig {
    font_family: string;
    font_source: "google" | "custom" | "adobe";
    font_weight: string;
    line_height: number;
    letter_spacing: string;
    text_transform: string;
    preload: boolean;
    font_file_url: string;
    font_file_format: string;
}

interface TypographyRow extends FontConfig {
    id: string;
    element: string;
    created_at: string;
    updated_at: string;
}

interface FontPreset {
    id: string;
    name: string;
    description: string;
    config: Record<string, Partial<FontConfig>>;
    is_builtin: boolean;
}

/* ─── Element Definitions ─── */

const ELEMENTS: { key: string; label: string; cssVar: string; preview: string }[] = [
    { key: "heading_h1", label: "Heading H1", cssVar: "--font-heading-h1", preview: "The quick brown fox" },
    { key: "heading_h2", label: "Heading H2", cssVar: "--font-heading-h2", preview: "The quick brown fox" },
    { key: "heading_h3", label: "Heading H3", cssVar: "--font-heading-h3", preview: "The quick brown fox" },
    { key: "body", label: "Body Text", cssVar: "--font-body", preview: "Lorem ipsum dolor sit amet, consectetur adipiscing elit." },
    { key: "nav", label: "Navigation", cssVar: "--font-nav", preview: "Services  ·  Work  ·  About  ·  Contact" },
    { key: "button", label: "Buttons", cssVar: "--font-button", preview: "Get Started  ·  Learn More  ·  Submit" },
    { key: "quote", label: "Quotes", cssVar: "--font-quote", preview: "\"Design is not just what it looks like.\"" },
    { key: "code", label: "Code", cssVar: "--font-code", preview: "const App = () => <div>Hello</div>;" },
    { key: "pricing_number", label: "Pricing Numbers", cssVar: "--font-pricing", preview: "$99  ·  $199  ·  $499" },
];

/* ─── Google Fonts Curated List ─── */

interface GoogleFontEntry {
    family: string;
    category: string;
    weights: string[];
}

const GOOGLE_FONTS: GoogleFontEntry[] = [
    { family: "Inter", category: "sans-serif", weights: ["100", "200", "300", "400", "500", "600", "700", "800", "900"] },
    { family: "Roboto", category: "sans-serif", weights: ["100", "300", "400", "500", "700", "900"] },
    { family: "Open Sans", category: "sans-serif", weights: ["300", "400", "500", "600", "700", "800"] },
    { family: "Montserrat", category: "sans-serif", weights: ["100", "200", "300", "400", "500", "600", "700", "800", "900"] },
    { family: "Lato", category: "sans-serif", weights: ["100", "300", "400", "700", "900"] },
    { family: "Poppins", category: "sans-serif", weights: ["100", "200", "300", "400", "500", "600", "700", "800", "900"] },
    { family: "DM Sans", category: "sans-serif", weights: ["100", "200", "300", "400", "500", "600", "700", "800"] },
    { family: "Playfair Display", category: "serif", weights: ["400", "500", "600", "700", "800", "900"] },
    { family: "Merriweather", category: "serif", weights: ["300", "400", "700", "900"] },
    { family: "DM Serif Display", category: "serif", weights: ["400"] },
    { family: "DM Serif Text", category: "serif", weights: ["400"] },
    { family: "Libre Baskerville", category: "serif", weights: ["400", "700"] },
    { family: "Source Serif 4", category: "serif", weights: ["200", "300", "400", "500", "600", "700", "800", "900"] },
    { family: "Lora", category: "serif", weights: ["400", "500", "600", "700"] },
    { family: "Crimson Text", category: "serif", weights: ["400", "600", "700"] },
    { family: "EB Garamond", category: "serif", weights: ["400", "500", "600", "700", "800"] },
    { family: "Bitter", category: "serif", weights: ["100", "200", "300", "400", "500", "600", "700", "800", "900"] },
    { family: "Space Grotesk", category: "sans-serif", weights: ["300", "400", "500", "600", "700"] },
    { family: "Space Mono", category: "monospace", weights: ["400", "700"] },
    { family: "JetBrains Mono", category: "monospace", weights: ["100", "200", "300", "400", "500", "600", "700", "800"] },
    { family: "Fira Code", category: "monospace", weights: ["300", "400", "500", "600", "700"] },
    { family: "Source Code Pro", category: "monospace", weights: ["200", "300", "400", "500", "600", "700", "800", "900"] },
    { family: "IBM Plex Mono", category: "monospace", weights: ["100", "200", "300", "400", "500", "600", "700"] },
    { family: "Work Sans", category: "sans-serif", weights: ["100", "200", "300", "400", "500", "600", "700", "800", "900"] },
    { family: "Plus Jakarta Sans", category: "sans-serif", weights: ["200", "300", "400", "500", "600", "700", "800"] },
    { family: "Manrope", category: "sans-serif", weights: ["200", "300", "400", "500", "600", "700", "800"] },
    { family: "Sora", category: "sans-serif", weights: ["100", "200", "300", "400", "500", "600", "700", "800"] },
    { family: "Figtree", category: "sans-serif", weights: ["300", "400", "500", "600", "700", "800", "900"] },
    { family: "Outfit", category: "sans-serif", weights: ["100", "200", "300", "400", "500", "600", "700", "800", "900"] },
    { family: "Nunito", category: "sans-serif", weights: ["200", "300", "400", "500", "600", "700", "800", "900"] },
    { family: "Raleway", category: "sans-serif", weights: ["100", "200", "300", "400", "500", "600", "700", "800", "900"] },
    { family: "Oswald", category: "sans-serif", weights: ["200", "300", "400", "500", "600", "700"] },
    { family: "Barlow", category: "sans-serif", weights: ["100", "200", "300", "400", "500", "600", "700", "800", "900"] },
    { family: "Barlow Condensed", category: "sans-serif", weights: ["100", "200", "300", "400", "500", "600", "700", "800", "900"] },
    { family: "Archivo", category: "sans-serif", weights: ["100", "200", "300", "400", "500", "600", "700", "800", "900"] },
    { family: "Syne", category: "sans-serif", weights: ["400", "500", "600", "700", "800"] },
    { family: "Clash Display", category: "sans-serif", weights: ["200", "300", "400", "500", "600", "700"] },
    { family: "Cabinet Grotesk", category: "sans-serif", weights: ["100", "200", "300", "400", "500", "600", "700", "800", "900"] },
    { family: "Unbounded", category: "display", weights: ["200", "300", "400", "500", "600", "700", "800", "900"] },
    { family: "Instrument Sans", category: "sans-serif", weights: ["400", "500", "600", "700"] },
    { family: "Hanken Grotesk", category: "sans-serif", weights: ["100", "200", "300", "400", "500", "600", "700", "800", "900"] },
    { family: "Public Sans", category: "sans-serif", weights: ["100", "200", "300", "400", "500", "600", "700", "800", "900"] },
    { family: "Fira Sans", category: "sans-serif", weights: ["100", "200", "300", "400", "500", "600", "700", "800", "900"] },
    { family: "Source Sans 3", category: "sans-serif", weights: ["200", "300", "400", "500", "600", "700", "800", "900"] },
    { family: "Noto Sans", category: "sans-serif", weights: ["100", "200", "300", "400", "500", "600", "700", "800", "900"] },
    { family: "Roboto Condensed", category: "sans-serif", weights: ["100", "200", "300", "400", "500", "600", "700", "800", "900"] },
    { family: "Red Hat Display", category: "sans-serif", weights: ["300", "400", "500", "600", "700", "800", "900"] },
    { family: "Epilogue", category: "sans-serif", weights: ["100", "200", "300", "400", "500", "600", "700", "800", "900"] },
    { family: "Jakarta Sans", category: "sans-serif", weights: ["200", "300", "400", "500", "600", "700", "800"] },
    { family: "Be Vietnam Pro", category: "sans-serif", weights: ["100", "200", "300", "400", "500", "600", "700", "800", "900"] },
    { family: "Jost", category: "sans-serif", weights: ["100", "200", "300", "400", "500", "600", "700", "800", "900"] },
    { family: "Commissioner", category: "sans-serif", weights: ["100", "200", "300", "400", "500", "600", "700", "800", "900"] },
    { family: "Abril Fatface", category: "display", weights: ["400"] },
    { family: "Bebas Neue", category: "display", weights: ["400"] },
    { family: "Anton", category: "display", weights: ["400"] },
    { family: "Fraunces", category: "serif", weights: ["100", "200", "300", "400", "500", "600", "700", "800", "900"] },
    { family: "Cormorant Garamond", category: "serif", weights: ["300", "400", "500", "600", "700"] },
    { family: "Alice", category: "serif", weights: ["400"] },
    { family: "Spectral", category: "serif", weights: ["200", "300", "400", "500", "600", "700", "800"] },
    { family: "Tinos", category: "serif", weights: ["400", "700"] },
    { family: "Newsreader", category: "serif", weights: ["200", "300", "400", "500", "600", "700", "800"] },
];

const GOOGLE_FONTS_MAP = new Map(GOOGLE_FONTS.map(f => [f.family, f]));

/* ─── Default Config ─── */

const DEFAULT_CONFIG: FontConfig = {
    font_family: "Inter",
    font_source: "google",
    font_weight: "400",
    line_height: 1.5,
    letter_spacing: "0",
    text_transform: "none",
    preload: false,
    font_file_url: "",
    font_file_format: "",
};

const DEFAULT_ELEMENT_CONFIGS: Record<string, FontConfig> = {
    heading_h1: { ...DEFAULT_CONFIG, font_weight: "800", line_height: 1.1, letter_spacing: "-0.02", preload: true },
    heading_h2: { ...DEFAULT_CONFIG, font_weight: "700", line_height: 1.2, letter_spacing: "-0.01", preload: true },
    heading_h3: { ...DEFAULT_CONFIG, font_weight: "600", line_height: 1.3, preload: true },
    body: { ...DEFAULT_CONFIG, font_weight: "400", line_height: 1.7 },
    nav: { ...DEFAULT_CONFIG },
    button: { ...DEFAULT_CONFIG },
    quote: { ...DEFAULT_CONFIG, font_weight: "400", line_height: 1.6 },
    code: { ...DEFAULT_CONFIG, font_family: "JetBrains Mono", font_weight: "400", line_height: 1.5, preload: true },
    pricing_number: { ...DEFAULT_CONFIG, font_weight: "800", line_height: 1, letter_spacing: "-0.02" },
};

/* ─── Component ─── */

function TypographyManager() {
    const [typography, setTypography] = useState<Record<string, FontConfig>>({});
    const [presets, setPresets] = useState<FontPreset[]>([]);
    const [loading, setLoading] = useState(true);
    const [preloading, setPreloading] = useState(false);
    const [fontSearch, setFontSearch] = useState("");
    const [selectedElement, setSelectedElement] = useState("heading_h1");
    const [showFontPicker, setShowFontPicker] = useState(false);
    const [adobeKitId, setAdobeKitId] = useState("");
    const [saving, setSaving] = useState(false);
    const pickerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) setShowFontPicker(false);
        };
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, []);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        const { data: rows } = await supabase.from("cms_typography").select("*");
        const { data: presetRows } = await supabase.from("cms_font_presets").select("*").order("created_at");
        if (rows) {
            const map: Record<string, FontConfig> = {};
            for (const r of rows) {
                map[r.element] = {
                    font_family: r.font_family,
                    font_source: r.font_source as any,
                    font_weight: r.font_weight,
                    line_height: r.line_height,
                    letter_spacing: r.letter_spacing,
                    text_transform: r.text_transform,
                    preload: r.preload,
                    font_file_url: r.font_file_url || "",
                    font_file_format: r.font_file_format || "",
                };
            }
            setTypography(map);
        }
        if (presetRows) setPresets(presetRows as FontPreset[]);
        const { data: kitSetting } = await supabase.from("site_settings").select("value").eq("key", "adobe_fonts_kit_id").maybeSingle();
        if (kitSetting) setAdobeKitId(kitSetting.value);
        setLoading(false);
    };

    const activeConfig = typography[selectedElement] || DEFAULT_ELEMENT_CONFIGS[selectedElement] || DEFAULT_CONFIG;

    const updateField = (field: keyof FontConfig, value: any) => {
        setTypography(prev => ({
            ...prev,
            [selectedElement]: { ...(prev[selectedElement] || DEFAULT_ELEMENT_CONFIGS[selectedElement] || DEFAULT_CONFIG), [field]: value },
        }));
    };

    const saveAll = async () => {
        setSaving(true);
        const promises = ELEMENTS.map(async (el) => {
            const cfg = typography[el.key];
            if (!cfg) return;
            const { error } = await supabase.from("cms_typography").upsert({
                element: el.key,
                font_family: cfg.font_family,
                font_source: cfg.font_source,
                font_weight: cfg.font_weight,
                line_height: cfg.line_height,
                letter_spacing: cfg.letter_spacing,
                text_transform: cfg.text_transform,
                preload: cfg.preload,
                font_file_url: cfg.font_file_url || null,
                font_file_format: cfg.font_file_format || null,
            }, { onConflict: "element", ignoreDuplicates: false });
            if (error) throw error;
        });
        try {
            await Promise.all(promises);
            if (adobeKitId) {
                await supabase.from("site_settings").upsert({ key: "adobe_fonts_kit_id", value: adobeKitId, category: "fonts" }, { onConflict: "key" });
            }
            toast.success("Typography saved");
        } catch {
            toast.error("Failed to save");
        }
        setSaving(false);
    };

    const handleResetAll = async () => {
        const defaults = { ...DEFAULT_ELEMENT_CONFIGS };
        setTypography(defaults);
        setSaving(true);
        try {
            const promises = ELEMENTS.map(async (el) => {
                const cfg = defaults[el.key] || DEFAULT_CONFIG;
                const { error } = await supabase.from("cms_typography").upsert({
                    element: el.key,
                    font_family: cfg.font_family,
                    font_source: cfg.font_source,
                    font_weight: cfg.font_weight,
                    line_height: cfg.line_height,
                    letter_spacing: cfg.letter_spacing,
                    text_transform: cfg.text_transform,
                    preload: cfg.preload,
                }, { onConflict: "element", ignoreDuplicates: false });
                if (error) throw error;
            });
            await Promise.all(promises);
            toast.success("Reset to default fonts");
        } catch {
            toast.error("Failed to reset");
        }
        setSaving(false);
    };

    const applyPreset = (preset: FontPreset) => {
        const newTypo = { ...typography };
        for (const [el, cfg] of Object.entries(preset.config)) {
            newTypo[el] = { ...(newTypo[el] || DEFAULT_ELEMENT_CONFIGS[el] || DEFAULT_CONFIG), ...cfg as any };
        }
        setTypography(newTypo);
        toast.success(`Applied "${preset.name}"`);
    };

    const buildGoogleFontsUrl = () => {
        const families = new Map<string, Set<string>>();
        const entries = Object.entries(typography);
        if (entries.length === 0) return null;
        for (const [, cfg] of entries) {
            if (cfg.font_source !== "google") continue;
            if (!families.has(cfg.font_family)) families.set(cfg.font_family, new Set());
            for (const w of cfg.font_weight.split(",")) families.get(cfg.font_family)!.add(w.trim());
        }
        if (families.size === 0) return null;
        const params = Array.from(families.entries())
            .map(([family, weights]) => `${family.replace(/ /g, "+")}:wght@${Array.from(weights).sort().join(";")}`)
            .join("&family=");
        return `https://fonts.googleapis.com/css2?family=${params}&display=swap`;
    };

    const googleFontsUrl = useMemo(buildGoogleFontsUrl, [typography]);

    /* ── Render ── */

    if (loading) return (
        <div className="flex items-center justify-center h-64"><RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" /></div>
    );

    const filteredFonts = GOOGLE_FONTS.filter(f =>
        f.family.toLowerCase().includes(fontSearch.toLowerCase()) ||
        f.category.toLowerCase().includes(fontSearch.toLowerCase())
    );

    const selectedFontInfo = GOOGLE_FONTS_MAP.get(activeConfig.font_family);
    const allWeights = selectedFontInfo?.weights || ["100", "200", "300", "400", "500", "600", "700", "800", "900"];

    return (
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="flex items-center justify-center w-7 h-7 rounded-xl bg-gradient-to-br from-brand-magenta to-brand-blue text-white">
                            <Type className="h-4 w-4" />
                        </span>
                        <h1 className="font-display text-2xl font-bold tracking-tight">Advanced Typography Engine</h1>
                    </div>
                    <p className="text-xs text-muted-foreground ml-9">Manage fonts, weights, sizes, and professional pairing presets.</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                    <button onClick={handleResetAll} disabled={saving}
                        className="flex items-center gap-1.5 rounded-lg bg-brand-pink/10 text-brand-pink border border-brand-pink/20 px-3 py-2 text-[10px] font-bold hover:bg-rose-500/20 hover:border-brand-pink/30 transition-all duration-200 cursor-pointer disabled:opacity-50">
                        <RotateCcw className="h-3.5 w-3.5" /> Reset All
                    </button>
                    <button onClick={saveAll} disabled={saving}
                        className="flex items-center gap-1.5 rounded-xl bg-linear-to-r from-brand-magenta to-brand-blue px-4 py-2 text-xs font-semibold text-white hover:scale-[1.03] hover:shadow-lg hover:shadow-brand-magenta/20 transition-all duration-200 cursor-pointer disabled:opacity-50">
                        <Save className="h-3.5 w-3.5" /> {saving ? "Saving..." : "Save Typography"}
                    </button>
                </div>
            </div>
            <div className="h-px bg-gradient-to-r from-brand-magenta/30 via-brand-blue/30 to-transparent" />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* ── Left: Element List ── */}
                <div className="lg:col-span-1 space-y-4">
                    <div className="rounded-2xl border border-white/10 bg-card/40 p-4 backdrop-blur-xl">
                        <div className="flex items-center gap-2 mb-3">
                            <Type className="h-4 w-4 text-brand-magenta" />
                            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Elements</span>
                        </div>
                        <div className="space-y-1">
                            {ELEMENTS.map(el => {
                                const cfg = typography[el.key];
                                const isActive = selectedElement === el.key;
                                const hasCustom = !!cfg;
                                return (
                                        <button key={el.key} onClick={() => setSelectedElement(el.key)}
                                        className={`w-full text-left px-3 py-2.5 rounded-xl text-[10px] transition-all duration-200 cursor-pointer relative overflow-hidden ${isActive ? "bg-brand-magenta/15 border border-brand-magenta/30 text-foreground shadow-sm" : "hover:bg-white/5 border border-transparent text-muted-foreground"}`}>
                                            {isActive && <span className="absolute left-0 top-1 bottom-1 w-0.5 rounded-r-full bg-brand-magenta" />}
                                            <div className="flex items-center justify-between">
                                                <span className="font-bold tracking-tight">{el.label}</span>
                                                {hasCustom && <span className="text-[8px] font-bold text-brand-cyan bg-brand-cyan/10 px-1.5 py-0.5 rounded-full">set</span>}
                                            </div>
                                            <div className="text-[9px] mt-0.5 truncate opacity-70" style={{ fontFamily: cfg?.font_family || "Inter" }}>
                                                {cfg?.font_family || "Inter"} · {cfg?.font_weight || "400"}
                                            </div>
                                        </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* ── Font Sources ── */}
                    <div className="rounded-2xl border border-white/10 bg-card/40 p-4 backdrop-blur-xl">
                        <div className="flex items-center gap-2 mb-3">
                            <Eye className="h-4 w-4 text-brand-cyan" />
                            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Font Sources</span>
                        </div>
                        <div className="space-y-3">
                            <div>
                                <label className="flex items-center gap-1.5 text-[9px] font-bold text-muted-foreground mb-1">
                                    <span className="w-1 h-1 rounded-full bg-amber-400" />
                                    Adobe Fonts Kit ID
                                </label>
                                <div className="relative">
                                    <input type="text" placeholder="e.g., abc1234" value={adobeKitId} onChange={(e) => setAdobeKitId(e.target.value)}
                                        className="w-full rounded-lg border border-border bg-background/50 px-2.5 py-2 text-[10px] focus:outline-none focus:border-brand-cyan/40 focus:ring-1 focus:ring-brand-cyan/20 transition-all placeholder:text-muted-foreground/30" />
                                    {adobeKitId && (
                                        <button onClick={() => setAdobeKitId("")} className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                                            <X className="h-3 w-3" />
                                        </button>
                                    )}
                                </div>
                                <p className="text-[8px] text-muted-foreground mt-1">Enter your Typekit Kit ID to enable Adobe Fonts</p>
                            </div>
                        </div>
                        <div className="mt-3 pt-3 border-t border-white/5">
                            <label className="flex items-center gap-2.5 cursor-pointer group">
                                <button onClick={() => setPreloading(!preloading)}
                                    className={`shrink-0 w-8 h-4 rounded-full transition-colors cursor-pointer ${preloading ? "bg-emerald-500" : "bg-zinc-700 border border-white/20"}`}>
                                    <span className={`block w-3 h-3 rounded-full bg-white transition-transform ${preloading ? "translate-x-[17px]" : "translate-x-0.5"}`} />
                                </button>
                                <div>
                                    <span className="text-[10px] font-bold text-muted-foreground group-hover:text-foreground transition-colors">Preload Critical Fonts</span>
                                    <p className="text-[8px] text-muted-foreground">Prevents FOUT, improves Core Web Vitals</p>
                                </div>
                            </label>
                        </div>
                        {googleFontsUrl && (
                            <div className="mt-3 pt-3 border-t border-white/5">
                                <div className="flex items-center gap-1.5 mb-1">
                                    <span className="w-1 h-1 rounded-full bg-blue-400" />
                                    <span className="text-[8px] font-bold text-muted-foreground uppercase tracking-wider">Google Fonts URL</span>
                                </div>
                                <div className="text-[7px] text-muted-foreground/60 break-all font-mono bg-background/30 rounded-lg p-2 border border-white/5">
                                    {googleFontsUrl.length > 100 ? googleFontsUrl.substring(0, 100) + "..." : googleFontsUrl}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* ── Presets ── */}
                    <div className="rounded-2xl border border-white/10 bg-card/40 p-4 backdrop-blur-xl">
                        <div className="flex items-center gap-2 mb-3">
                            <FileText className="h-4 w-4 text-amber-400" />
                            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Font Pairing Presets</span>
                        </div>
                        <div className="space-y-2">
                            {presets.map((p, i) => (
                                <button key={p.id} onClick={() => applyPreset(p)}
                                    className="group w-full text-left border border-white/5 hover:border-brand-magenta/30 hover:bg-brand-magenta/[0.03] rounded-xl px-3 py-2.5 transition-all duration-200 cursor-pointer">
                                    <div className="flex items-center gap-2">
                                        <span className="flex items-center justify-center w-5 h-5 rounded-md bg-white/5 text-[8px] font-bold text-muted-foreground group-hover:bg-brand-magenta/10 group-hover:text-brand-magenta transition-colors">{i + 1}</span>
                                        <div>
                                            <div className="text-[10px] font-bold tracking-tight">{p.name}</div>
                                            <div className="text-[8px] text-muted-foreground mt-0.5 leading-relaxed">{p.description}</div>
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ── Right: Editor ── */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="rounded-2xl border border-white/10 bg-card/40 backdrop-blur-xl overflow-hidden">
                        <div className="h-0.5 bg-gradient-to-r from-brand-magenta via-brand-blue to-brand-cyan" />
                        <div className="p-4">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    <span className="flex items-center justify-center w-6 h-6 rounded-lg bg-brand-magenta/10 text-brand-magenta">
                                        <Type className="h-3.5 w-3.5" />
                                    </span>
                                    <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                        {ELEMENTS.find(e => e.key === selectedElement)?.label || selectedElement}
                                    </h3>
                                </div>
                                {!typography[selectedElement] && (
                                    <button onClick={() => setTypography(prev => ({ ...prev, [selectedElement]: { ...DEFAULT_ELEMENT_CONFIGS[selectedElement] || DEFAULT_CONFIG } }))}
                                        className="flex items-center gap-1 text-[9px] font-bold text-brand-cyan hover:text-brand-blue transition-colors">
                                        <Plus className="h-3 w-3" /> Customize
                                    </button>
                                )}
                            </div>

                            <motion.div key={selectedElement} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.18 }} className="space-y-4 text-[10px]">
                            {/* Font Family Picker */}
                            <div>
                                <label className="block font-bold text-muted-foreground mb-1 uppercase tracking-wider">Font Family</label>
                                <div className="relative" ref={pickerRef}>
                                    <button onClick={() => setShowFontPicker(!showFontPicker)}
                                        className="w-full flex items-center justify-between rounded-lg border border-border bg-background/50 px-2.5 py-2 text-xs focus:outline-none cursor-pointer">
                                        <span style={{ fontFamily: activeConfig.font_family }}>{activeConfig.font_family}</span>
                                        <ChevronDown className="h-3 w-3 text-muted-foreground" />
                                    </button>
                                            {showFontPicker && (
                                                <div className="absolute z-50 mt-1 w-full rounded-xl border border-white/10 bg-card shadow-2xl backdrop-blur-xl overflow-hidden">
                                                    <div className="p-2 border-b border-white/5">
                                                        <div className="flex items-center gap-1.5 bg-background/50 rounded-lg px-2 py-1">
                                                            <Search className="h-3 w-3 text-muted-foreground shrink-0" />
                                                            <input type="text" value={fontSearch} onChange={(e) => setFontSearch(e.target.value)} placeholder="Search 60 fonts..."
                                                                className="w-full bg-transparent text-[10px] focus:outline-none placeholder:text-muted-foreground/40" autoFocus />
                                                            {fontSearch && <X className="h-3 w-3 text-muted-foreground cursor-pointer shrink-0 hover:text-foreground transition-colors" onClick={() => { setFontSearch(""); }} />}
                                                        </div>
                                                    </div>
                                                    <div className="max-h-56 overflow-y-auto">
                                                        {filteredFonts.map(f => (
                                                            <button key={f.family} onClick={() => { updateField("font_family", f.family); setShowFontPicker(false); setFontSearch(""); }}
                                                                className={`w-full text-left px-3 py-2 text-[10px] transition-all duration-150 cursor-pointer flex items-center justify-between gap-2 ${activeConfig.font_family === f.family ? "bg-brand-blue/15 text-brand-blue font-medium" : "hover:bg-white/5"}`}>
                                                                <span style={{ fontFamily: f.family }} className="truncate">{f.family}</span>
                                                                <span className="shrink-0 text-[8px] text-muted-foreground bg-white/5 px-1.5 py-0.5 rounded-full capitalize">{f.category}</span>
                                                            </button>
                                                        ))}
                                                        {filteredFonts.length === 0 && (
                                                            <div className="px-3 py-6 text-center text-[10px] text-muted-foreground">
                                                                <p className="mb-2">No fonts match "{fontSearch}"</p>
                                                                <button onClick={() => { updateField("font_family", fontSearch); setShowFontPicker(false); setFontSearch(""); }}
                                                                    className="inline-flex items-center gap-1 text-brand-cyan hover:text-brand-blue transition-colors font-semibold">
                                                                    Use custom name: <span className="underline underline-offset-2">{fontSearch}</span>
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                </div>
                            </div>

                            {/* Font Weight */}
                            <div>
                                <label className="block font-bold text-muted-foreground mb-1 uppercase tracking-wider">Font Weight</label>
                                <select value={activeConfig.font_weight} onChange={(e) => updateField("font_weight", e.target.value)}
                                    className="w-full rounded-lg border border-border bg-background/50 px-2 py-1.5 text-[10px] focus:outline-none">
                                    {allWeights.map(w => (
                                        <option key={w} value={w}>{w} — {
                                            w === "100" ? "Thin" : w === "200" ? "Extra Light" : w === "300" ? "Light" :
                                            w === "400" ? "Regular" : w === "500" ? "Medium" : w === "600" ? "Semi Bold" :
                                            w === "700" ? "Bold" : w === "800" ? "Extra Bold" : "Black"
                                        }</option>
                                    ))}
                                </select>
                            </div>

                            {/* Line Height & Letter Spacing */}
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block font-bold text-muted-foreground mb-1 uppercase tracking-wider">Line Height</label>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[9px] text-muted-foreground">0.8</span>
                                        <input type="range" min="0.8" max="2.5" step="0.05" value={activeConfig.line_height} onChange={(e) => updateField("line_height", parseFloat(e.target.value))}
                                            className="flex-1 h-1 accent-brand-magenta cursor-pointer" />
                                        <span className="text-[9px] text-muted-foreground">2.5</span>
                                        <span className="text-[10px] font-mono text-muted-foreground w-8 text-right">{activeConfig.line_height.toFixed(2)}</span>
                                    </div>
                                </div>
                                <div>
                                    <label className="block font-bold text-muted-foreground mb-1 uppercase tracking-wider">Letter Spacing</label>
                                    <select value={activeConfig.letter_spacing} onChange={(e) => updateField("letter_spacing", e.target.value)}
                                        className="w-full rounded-lg border border-border bg-background/50 px-2 py-1.5 text-[10px] focus:outline-none">
                                        <option value="-0.05">-5% (Tight)</option>
                                        <option value="-0.02">-2% (Condensed)</option>
                                        <option value="-0.01">-1% (Slightly Tight)</option>
                                        <option value="0">0 (Normal)</option>
                                        <option value="0.01">+1% (Slightly Loose)</option>
                                        <option value="0.02">+2% (Loose)</option>
                                        <option value="0.05">+5% (Wide)</option>
                                        <option value="0.08">+8% (Very Wide)</option>
                                        <option value="0.1">+10% (Extended)</option>
                                        <option value="0.15">+15% (Extra Wide)</option>
                                        <option value="0.2">+20% (Max Wide)</option>
                                    </select>
                                </div>
                            </div>

                            {/* Text Transform */}
                            <div>
                                <label className="block font-bold text-muted-foreground mb-1 uppercase tracking-wider">Text Transform</label>
                                <div className="flex gap-1.5">
                                    {["none", "uppercase", "lowercase", "capitalize"].map(t => (
                                        <button key={t} onClick={() => updateField("text_transform", t)}
                                            className={`flex-1 py-1.5 rounded-lg text-[9px] font-bold border transition cursor-pointer ${
                                                activeConfig.text_transform === t ? "bg-brand-magenta/15 border-brand-magenta/30 text-foreground" : "border-white/5 text-muted-foreground hover:border-white/20"
                                            }`}>
                                            {t === "none" ? "Normal" : t.charAt(0).toUpperCase() + t.slice(1)}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Preload Toggle */}
                            <div className="flex items-center justify-between pt-2 border-t border-white/5">
                                <div>
                                    <label className="block font-bold text-muted-foreground uppercase tracking-wider">Preload</label>
                                    <p className="text-[8px] text-muted-foreground mt-0.5">Preload this font for faster rendering</p>
                                </div>
                                <button onClick={() => updateField("preload", !activeConfig.preload)}
                                    className={`w-9 h-5 rounded-full transition-colors cursor-pointer ${activeConfig.preload ? "bg-emerald-500" : "bg-zinc-700 border border-white/20"}`}>
                                    <span className={`block w-4 h-4 rounded-full bg-white transition-transform ${activeConfig.preload ? "translate-x-[18px]" : "translate-x-0.5"}`} />
                                </button>
                            </div>
                            </motion.div>
                        </div>
                    </div>

                    {/* Preview */}
                    <div className="rounded-2xl border border-white/10 bg-card/40 p-4 backdrop-blur-xl">
                        <div className="flex items-center gap-2 mb-3">
                            <Eye className="h-4 w-4 text-brand-cyan" />
                            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Live Preview</span>
                        </div>
                        <div className="rounded-xl bg-background/50 border border-white/5 p-4 divide-y divide-white/5">
                            {ELEMENTS.map(el => {
                                const cfg = typography[el.key] || DEFAULT_ELEMENT_CONFIGS[el.key] || DEFAULT_CONFIG;
                                const isH = el.key.startsWith("heading_");
                                const tag = isH ? el.key.replace("heading_h", "h") : "div";
                                const Tag = tag as keyof JSX.IntrinsicElements;
                                const baseSize = isH ? Math.max(4 - parseInt(tag.replace("h", "")), 1) : el.key === "code" ? 0.85 : el.key === "pricing_number" ? 2.5 : 1;
                                const isActivePreview = selectedElement === el.key;
                                return (
                                    <div key={el.key} className={`py-3 first:pt-0 last:pb-0 transition-all duration-200 ${isActivePreview ? "opacity-100" : "opacity-60 hover:opacity-90"}`}>
                                        <div className="flex items-center gap-1.5 mb-1">
                                            <span className={`w-1.5 h-1.5 rounded-full transition-colors ${isActivePreview ? "bg-brand-magenta" : "bg-white/20"}`} />
                                            <span className="text-[8px] text-muted-foreground uppercase tracking-wider">{el.label}</span>
                                        </div>
                                        <Tag style={{
                                            fontFamily: cfg.font_family,
                                            fontWeight: parseInt(cfg.font_weight),
                                            lineHeight: cfg.line_height,
                                            letterSpacing: `${parseFloat(cfg.letter_spacing)}em`,
                                            textTransform: cfg.text_transform as any,
                                            fontSize: `${baseSize}rem`,
                                        }} className="text-foreground">
                                            {el.preview}
                                        </Tag>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
