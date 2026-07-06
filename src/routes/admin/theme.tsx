import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/lib/supabaseClient";
import { motion, AnimatePresence } from "framer-motion";
import {
  Save, Palette, Eye, X, Monitor, Tablet, Smartphone,
  Check, ChevronDown, ChevronUp, Sparkles, RefreshCw,
  Star, RotateCcw, Globe, FileText, Layout,
  Maximize2, Minimize2, PanelRight, Settings2,
  ArrowUpDown, Square, Circle, Layers,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/theme")({
  head: () => ({
    meta: [
      { title: "Theme Engine — ClickTake Admin Portal" },
      { name: "description", content: "Manage global themes, component styles, and per-page theme overrides." },
    ],
  }),
  component: ThemeManager,
});

/* ─── Types ─── */

interface ThemeConfig {
  display_name?: string;
  colors?: Record<string, string>;
  gradients?: Record<string, string>;
  shadows?: Record<string, string>;
  layout_density?: "compact" | "normal" | "airy";
  component_style?: {
    border_radius?: "sharp" | "rounded" | "pill";
    shadow?: "hard" | "soft" | "glow";
    button_style?: "filled" | "outline" | "glass";
    card_style?: "flat" | "elevated" | "glass";
  };
  spacing?: {
    section_padding?: string;
    container_max_width?: string;
    gap?: string;
  };
  typography?: {
    heading_font?: string;
    body_font?: string;
  };
}

interface ThemeRow {
  id: string;
  name: string;
  slug: string;
  description: string;
  thumbnail_url: string;
  is_active: boolean;
  is_default: boolean;
  parent_theme_id: string | null;
  config: ThemeConfig;
  created_at: string;
  updated_at: string;
}

interface PageRow {
  id: string;
  title: string;
  slug: string;
  theme_id: string | null;
}

/* ─── Built-in Theme Color Previews (for card visuals) ─── */

const THEME_SWATCHES: Record<string, { bg: string; accent: string; label: string }> = {
  "default": { bg: "from-zinc-900 via-slate-900 to-zinc-900", accent: "bg-gradient-to-r from-brand-pink via-brand-magenta to-brand-blue", label: "Original" },
  "tech-noir": { bg: "from-cyan-950 via-slate-950 to-violet-950", accent: "bg-gradient-to-r from-brand-cyan via-teal-400 to-brand-magenta", label: "Noir" },
  "corporate-clean": { bg: "from-blue-50 via-white to-slate-50", accent: "bg-gradient-to-r from-blue-600 to-brand-blue", label: "Clean" },
  "bold-agency": { bg: "from-orange-950 via-rose-950 to-stone-950", accent: "bg-gradient-to-r from-amber-400 via-rose-500 to-brand-magenta", label: "Bold" },
};

/* ─── Component ─── */

function ThemeManager() {
  const [themes, setThemes] = useState<ThemeRow[]>([]);
  const [pages, setPages] = useState<PageRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [selectedThemeId, setSelectedThemeId] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [showPerPageOverride, setShowPerPageOverride] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setFetchError(null);
    const [themeRes, pageRes] = await Promise.all([
      supabase.from("cms_themes").select("*").order("created_at"),
      supabase.from("pages").select("id, title, slug, theme_id").order("title"),
    ]);
    if (themeRes.error) {
      setFetchError(themeRes.error.message);
      console.error("ThemeEngine: failed to fetch themes", themeRes.error);
    } else if (themeRes.data) {
      setThemes(themeRes.data as ThemeRow[]);
    }
    if (pageRes.data) setPages(pageRes.data as PageRow[]);
    setLoading(false);
  };

  const activeTheme = themes.find(t => t.is_active);
  const defaultTheme = themes.find(t => t.is_default);
  const selectedTheme = themes.find(t => t.id === selectedThemeId) || null;

  const setActiveTheme = async (slug: string) => {
    setSaving(true);
    // Deactivate all, then activate one
    const { error: deactivateErr } = await supabase.from("cms_themes").update({ is_active: false }).neq("slug", "nonexistent");
    if (deactivateErr) { toast.error("Failed to deactivate themes"); setSaving(false); return; }
    const { error: activateErr } = await supabase.from("cms_themes").update({ is_active: true }).eq("slug", slug);
    if (activateErr) { toast.error("Failed to activate theme"); setSaving(false); return; }
    await loadData();
    toast.success(`Theme applied — "${themes.find(t => t.slug === slug)?.name}"`);
    setSaving(false);
  };

  const setAsDefault = async (id: string) => {
    setSaving(true);
    await supabase.from("cms_themes").update({ is_default: false }).neq("id", id);
    const { error } = await supabase.from("cms_themes").update({ is_default: true, is_active: true }).eq("id", id);
    if (error) { toast.error("Failed to set default"); } else { toast.success("Default theme updated"); }
    await loadData();
    setSaving(false);
  };

  const handlePreview = (slug: string) => {
    sessionStorage.setItem("theme_preview_slug", slug);
    window.open("/", "_blank");
  };

  const updatePageTheme = async (pageId: string, themeId: string | null) => {
    const { error } = await supabase.from("pages").update({ theme_id: themeId }).eq("id", pageId);
    if (error) { toast.error("Failed to update page theme"); return; }
    setPages(prev => prev.map(p => p.id === pageId ? { ...p, theme_id: themeId } : p));
    toast.success("Page theme override updated");
  };

  const updateConfig = async (field: string, value: any) => {
    if (!selectedTheme) return;
    const newConfig = { ...selectedTheme.config };
    // Handle nested paths like "component_style.border_radius"
    const parts = field.split(".");
    let obj: any = newConfig;
    for (let i = 0; i < parts.length - 1; i++) {
      if (!obj[parts[i]]) obj[parts[i]] = {};
      obj = obj[parts[i]];
    }
    obj[parts[parts.length - 1]] = value;

    const { error } = await supabase.from("cms_themes").update({ config: newConfig }).eq("id", selectedTheme.id);
    if (error) { toast.error("Failed to update theme config"); return; }
    setThemes(prev => prev.map(t => t.id === selectedTheme.id ? { ...t, config: newConfig } : t));
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64"><RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" /></div>
  );

  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      {/* ── Header ── */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="flex items-center justify-center w-7 h-7 rounded-xl bg-gradient-to-br from-amber-500 to-brand-pink text-white">
              <Palette className="h-4 w-4" />
            </span>
            <h1 className="font-display text-2xl font-bold tracking-tight">Global Theme Engine</h1>
          </div>
          <p className="text-xs text-muted-foreground ml-9">Create, preview, and apply complete visual themes. Content stays the same — the look changes entirely.</p>
        </div>
      </div>
      <div className="h-px bg-gradient-to-r from-amber-500/30 via-rose-500/30 to-transparent" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ── Left: Theme Library ── */}
        <div className="lg:col-span-2 space-y-4">
          {/* Theme Cards Grid */}
          {themes.length === 0 ? (
            <div className="col-span-full rounded-2xl border border-white/10 bg-card/40 p-8 backdrop-blur-xl text-center">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/5 mx-auto mb-3">
                <Database className="h-5 w-5 text-muted-foreground" />
              </div>
              <p className="text-xs font-bold mb-1">No themes found</p>
              <p className="text-[9px] text-muted-foreground mb-3 max-w-xs mx-auto">
                {fetchError
                  ? `Database error: ${fetchError}. Make sure the cms_themes table exists in Supabase.`
                  : "The database migration has not been run yet. Open your Supabase SQL Editor and run the migration script to create the cms_themes table and seed the built-in themes."}
              </p>
              <button
                onClick={() => { loadData(); }}
                className="inline-flex items-center gap-1.5 text-[9px] font-bold px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
              >
                <RefreshCw className="h-3 w-3" /> Retry
              </button>
            </div>
          ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {themes.map(theme => {
              const swatch = THEME_SWATCHES[theme.slug] || THEME_SWATCHES["default"];
              const isActive = theme.is_active;
              const isDefault = theme.is_default;
              const isSelected = selectedThemeId === theme.id;
              return (
                <motion.div
                  key={theme.id}
                  layout
                  className={`relative rounded-2xl border overflow-hidden transition-all duration-300 cursor-pointer group ${
                    isActive ? "border-brand-magenta/40 shadow-lg shadow-brand-magenta/10" : "border-white/10 hover:border-white/20"
                  } ${isSelected ? "ring-2 ring-brand-magenta/50" : ""}`}
                  onClick={() => setSelectedThemeId(isSelected ? null : theme.id)}
                >
                  {/* Preview Banner */}
                  <div className={`h-32 relative bg-gradient-to-br ${swatch.bg} flex items-center justify-center overflow-hidden`}>
                    <div className={`absolute inset-0 opacity-20 ${swatch.accent}`} />
                    <div className="relative z-10 flex flex-col items-center gap-2">
                      <div className={`w-16 h-10 rounded-lg ${swatch.accent} shadow-lg`} />
                      <span className="text-[9px] font-bold uppercase tracking-widest text-white/80">{swatch.label}</span>
                    </div>
                    {/* Active badge */}
                    {isActive && (
                      <div className="absolute top-2 right-2 flex items-center gap-1 bg-emerald-500/20 backdrop-blur-md border border-emerald-500/30 rounded-full px-2.5 py-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-[8px] font-bold text-emerald-400 uppercase tracking-wider">Live</span>
                      </div>
                    )}
                    {isDefault && !isActive && (
                      <div className="absolute top-2 right-2 flex items-center gap-1 bg-amber-500/20 backdrop-blur-md border border-amber-500/30 rounded-full px-2.5 py-1">
                        <Star className="h-2.5 w-2.5 text-amber-400" />
                        <span className="text-[8px] font-bold text-amber-400 uppercase tracking-wider">Default</span>
                      </div>
                    )}
                  </div>

                  {/* Card Body */}
                  <div className="p-3.5 space-y-2.5 bg-card/40 backdrop-blur-xl">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-xs font-bold truncate">{theme.config?.display_name || theme.name}</h3>
                        {theme.parent_theme_id && (
                          <span className="text-[7px] text-muted-foreground bg-white/5 px-1 py-0.5 rounded font-mono">extends</span>
                        )}
                      </div>
                      <p className="text-[9px] text-muted-foreground mt-0.5 line-clamp-2">{theme.description}</p>
                    </div>

                    {/* Density + Style chips */}
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className={`text-[7px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider ${
                        theme.config?.layout_density === "compact" ? "bg-brand-cyan/10 text-brand-cyan border border-brand-cyan/20" :
                        theme.config?.layout_density === "airy" ? "bg-brand-magenta/10 text-brand-magenta border border-brand-magenta/20" :
                        "bg-white/5 text-muted-foreground border border-white/10"
                      }`}>
                        {theme.config?.layout_density || "normal"}
                      </span>
                      <span className="text-[7px] text-muted-foreground bg-white/5 px-1.5 py-0.5 rounded-full capitalize border border-white/10">
                        {theme.config?.component_style?.border_radius || "rounded"}
                      </span>
                      <span className="text-[7px] text-muted-foreground bg-white/5 px-1.5 py-0.5 rounded-full capitalize border border-white/10">
                        {theme.config?.component_style?.card_style || "glass"}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1.5 pt-1" onClick={e => e.stopPropagation()}>
                      {!isActive && (
                        <button onClick={() => setActiveTheme(theme.slug)} disabled={saving}
                          className="flex-1 flex items-center justify-center gap-1 rounded-lg bg-brand-magenta/15 text-brand-magenta border border-brand-magenta/20 px-2 py-1.5 text-[9px] font-bold hover:bg-brand-magenta/25 transition-all duration-200 cursor-pointer disabled:opacity-50">
                          <Check className="h-3 w-3" /> Apply
                        </button>
                      )}
                      <button onClick={() => handlePreview(theme.slug)}
                        className="flex items-center justify-center gap-1 rounded-lg bg-white/5 text-muted-foreground border border-white/10 px-2 py-1.5 text-[9px] font-bold hover:bg-white/10 hover:text-foreground transition-all duration-200 cursor-pointer">
                        <Eye className="h-3 w-3" /> Preview
                      </button>
                      {!isDefault && (
                        <button onClick={() => setAsDefault(theme.id)} disabled={saving}
                          className="flex items-center justify-center gap-1 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-1.5 text-[9px] font-bold hover:bg-amber-500/20 transition-all duration-200 cursor-pointer disabled:opacity-50">
                          <Star className="h-3 w-3" />
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>)}

          {/* ── Per-Page Theme Override ── */}
          <div className="rounded-2xl border border-white/10 bg-card/40 backdrop-blur-xl overflow-hidden">
            <button
              onClick={() => setShowPerPageOverride(!showPerPageOverride)}
              className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-brand-cyan" />
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Per-Page Theme Override</span>
              </div>
              {showPerPageOverride ? <ChevronUp className="h-3.5 w-3.5 text-muted-foreground" /> : <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />}
            </button>
            {showPerPageOverride && (
              <div className="px-4 pb-4">
                <p className="text-[9px] text-muted-foreground mb-3">Assign a different theme to specific pages. The page will use its assigned theme instead of the global active theme.</p>
                <div className="space-y-1.5 max-h-72 overflow-y-auto">
                  {pages.map(page => (
                    <div key={page.id} className="flex items-center justify-between gap-3 rounded-lg bg-background/30 border border-white/5 px-3 py-2">
                      <div className="flex-1 min-w-0">
                        <div className="text-[10px] font-medium truncate">{page.title || page.slug}</div>
                        <div className="text-[8px] text-muted-foreground">/{page.slug}</div>
                      </div>
                      <select
                        value={page.theme_id || ""}
                        onChange={(e) => updatePageTheme(page.id, e.target.value || null)}
                        className="shrink-0 rounded-lg border border-border bg-background/50 px-2 py-1 text-[9px] focus:outline-none cursor-pointer"
                      >
                        <option value="">Use global theme</option>
                        {themes.map(t => (
                          <option key={t.id} value={t.id}>{t.config?.display_name || t.name}{t.is_active ? " (live)" : ""}</option>
                        ))}
                      </select>
                    </div>
                  ))}
                  {pages.length === 0 && (
                    <p className="text-[10px] text-muted-foreground text-center py-4">No pages found.</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Right: Theme Editor Panel ── */}
        <div className="lg:col-span-1 space-y-4">
          {selectedTheme ? (
            <ThemeEditorPanel theme={selectedTheme} updateConfig={updateConfig} themes={themes} />
          ) : (
            <div className="rounded-2xl border border-white/10 bg-card/40 p-6 backdrop-blur-xl text-center">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/5 mx-auto mb-3">
                <PanelRight className="h-5 w-5 text-muted-foreground" />
              </div>
              <p className="text-xs text-muted-foreground">Select a theme card to edit its settings</p>
              <p className="text-[9px] text-muted-foreground mt-1">Adjust component styles, spacing, layout density, and more.</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Theme Editor Sub-Panel ─── */

function ThemeEditorPanel({ theme, updateConfig, themes }: { theme: ThemeRow; updateConfig: (field: string, value: any) => void; themes: ThemeRow[] }) {
  const config = theme.config || {};
  const cs = config.component_style || {};

  const parentTheme = theme.parent_theme_id ? themes.find(t => t.id === theme.parent_theme_id) : null;

  return (
    <div className="rounded-2xl border border-white/10 bg-card/40 backdrop-blur-xl overflow-hidden">
      <div className="h-0.5 bg-gradient-to-r from-amber-500 via-rose-500 to-brand-magenta" />
      <div className="p-4 space-y-4 text-[10px]">
        {/* Theme Info */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="flex items-center justify-center w-5 h-5 rounded-lg bg-amber-500/10 text-amber-400">
              <Settings2 className="h-3 w-3" />
            </span>
            <h3 className="font-bold uppercase tracking-wider text-muted-foreground">{config.display_name || theme.name}</h3>
          </div>
          {parentTheme && (
            <div className="flex items-center gap-1 text-[8px] text-muted-foreground bg-white/5 rounded-lg px-2 py-1">
              <ArrowUpDown className="h-2.5 w-2.5" />
              Extends: <span className="font-bold text-foreground">{parentTheme.config?.display_name || parentTheme.name}</span>
            </div>
          )}
        </div>

        <div className="h-px bg-white/5" />

        {/* Theme Inheritance */}
        <div>
          <label className="block font-bold text-muted-foreground mb-1 uppercase tracking-wider">Theme Inheritance</label>
          <select
            value={theme.parent_theme_id || ""}
            onChange={(e) => updateConfig("parent_theme_id", e.target.value || null)}
            className="w-full rounded-lg border border-border bg-background/50 px-2 py-1.5 text-[10px] focus:outline-none cursor-pointer"
          >
            <option value="">None (standalone)</option>
            {themes.filter(t => t.id !== theme.id).map(t => (
              <option key={t.id} value={t.id}>{t.config?.display_name || t.name}</option>
            ))}
          </select>
          <p className="text-[8px] text-muted-foreground mt-0.5">Child themes inherit all properties from the parent, then override specific values.</p>
        </div>

        <div className="h-px bg-white/5" />

        {/* Layout Density */}
        <div>
          <label className="block font-bold text-muted-foreground mb-1 uppercase tracking-wider">Layout Density</label>
          <div className="flex gap-1.5">
            {(["compact", "normal", "airy"] as const).map(d => (
              <button key={d} onClick={() => updateConfig("layout_density", d)}
                className={`flex-1 flex flex-col items-center gap-1 py-2 rounded-lg border transition-all duration-200 cursor-pointer ${
                  config.layout_density === d
                    ? "bg-brand-magenta/15 border-brand-magenta/30 text-foreground"
                    : "border-white/5 text-muted-foreground hover:border-white/20"
                }`}>
                {d === "compact" ? <Minimize2 className="h-3.5 w-3.5" /> :
                 d === "airy" ? <Maximize2 className="h-3.5 w-3.5" /> :
                 <Layout className="h-3.5 w-3.5" />}
                <span className="text-[8px] font-bold capitalize">{d}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="h-px bg-white/5" />

        {/* Component Style - Border Radius */}
        <div>
          <label className="block font-bold text-muted-foreground mb-1 uppercase tracking-wider">Border Radius</label>
          <div className="flex gap-1.5">
            {(["sharp", "rounded", "pill"] as const).map(r => (
              <button key={r} onClick={() => updateConfig("component_style.border_radius", r)}
                className={`flex-1 flex items-center justify-center gap-1 py-2 rounded-lg border transition-all duration-200 cursor-pointer ${
                  cs.border_radius === r
                    ? "bg-brand-magenta/15 border-brand-magenta/30 text-foreground"
                    : "border-white/5 text-muted-foreground hover:border-white/20"
                }`}>
                {r === "sharp" ? <Square className="h-3 w-3" /> :
                 r === "pill" ? <Circle className="h-3 w-3" /> :
                 <Layers className="h-3 w-3" />}
                <span className="text-[8px] font-bold capitalize">{r}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Component Style - Shadow */}
        <div>
          <label className="block font-bold text-muted-foreground mb-1 uppercase tracking-wider">Shadow Style</label>
          <div className="flex gap-1.5">
            {(["hard", "soft", "glow"] as const).map(s => (
              <button key={s} onClick={() => updateConfig("component_style.shadow", s)}
                className={`flex-1 py-2 rounded-lg border text-[8px] font-bold transition-all duration-200 cursor-pointer ${
                  cs.shadow === s
                    ? "bg-brand-magenta/15 border-brand-magenta/30 text-foreground"
                    : "border-white/5 text-muted-foreground hover:border-white/20"
                }`}>
                {s === "hard" ? "Hard" : s === "soft" ? "Soft" : "Glow"}
              </button>
            ))}
          </div>
        </div>

        {/* Component Style - Button + Card */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block font-bold text-muted-foreground mb-1 uppercase tracking-wider">Button Style</label>
            <select value={cs.button_style || "filled"} onChange={(e) => updateConfig("component_style.button_style", e.target.value)}
              className="w-full rounded-lg border border-border bg-background/50 px-2 py-1.5 text-[10px] focus:outline-none cursor-pointer">
              <option value="filled">Filled</option>
              <option value="outline">Outline</option>
              <option value="glass">Glass</option>
            </select>
          </div>
          <div>
            <label className="block font-bold text-muted-foreground mb-1 uppercase tracking-wider">Card Style</label>
            <select value={cs.card_style || "glass"} onChange={(e) => updateConfig("component_style.card_style", e.target.value)}
              className="w-full rounded-lg border border-border bg-background/50 px-2 py-1.5 text-[10px] focus:outline-none cursor-pointer">
              <option value="flat">Flat</option>
              <option value="elevated">Elevated</option>
              <option value="glass">Glass</option>
            </select>
          </div>
        </div>

        <div className="h-px bg-white/5" />

        {/* Spacing */}
        <div>
          <label className="block font-bold text-muted-foreground mb-1 uppercase tracking-wider">Spacing Profile</label>
          <div className="space-y-2">
            <div>
              <label className="text-[8px] text-muted-foreground">Section Padding</label>
              <select value={config.spacing?.section_padding || "py-24 md:py-32"}
                onChange={(e) => updateConfig("spacing.section_padding", e.target.value)}
                className="w-full rounded-lg border border-border bg-background/50 px-2 py-1.5 text-[10px] focus:outline-none cursor-pointer">
                <option value="py-16 md:py-24">Compact (py-16/24)</option>
                <option value="py-24 md:py-32">Normal (py-24/32)</option>
                <option value="py-32 md:py-40">Airy (py-32/40)</option>
                <option value="py-32 md:py-44">Expansive (py-32/44)</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[8px] text-muted-foreground">Container Width</label>
                <select value={config.spacing?.container_max_width || "max-w-7xl"}
                  onChange={(e) => updateConfig("spacing.container_max_width", e.target.value)}
                  className="w-full rounded-lg border border-border bg-background/50 px-2 py-1.5 text-[10px] focus:outline-none cursor-pointer">
                  <option value="max-w-5xl">Narrow</option>
                  <option value="max-w-7xl">Standard</option>
                  <option value="max-w-full">Full Width</option>
                </select>
              </div>
              <div>
                <label className="text-[8px] text-muted-foreground">Grid Gap</label>
                <select value={config.spacing?.gap || "gap-8"}
                  onChange={(e) => updateConfig("spacing.gap", e.target.value)}
                  className="w-full rounded-lg border border-border bg-background/50 px-2 py-1.5 text-[10px] focus:outline-none cursor-pointer">
                  <option value="gap-4">Tight</option>
                  <option value="gap-6">Compact</option>
                  <option value="gap-8">Normal</option>
                  <option value="gap-10">Loose</option>
                  <option value="gap-12">Expansive</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="h-px bg-white/5" />

        {/* Active status indicator */}
        <div className="flex items-center justify-between">
          <div>
            <label className="block font-bold text-muted-foreground uppercase tracking-wider">Status</label>
            <p className="text-[8px] text-muted-foreground mt-0.5">{theme.is_active ? "Currently live on website" : "Not active"}</p>
          </div>
          <span className={`flex items-center gap-1.5 text-[9px] font-bold px-2.5 py-1 rounded-full ${
            theme.is_active ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20" : "bg-zinc-500/15 text-zinc-400 border border-zinc-500/20"
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${theme.is_active ? "bg-emerald-400 animate-pulse" : "bg-zinc-400"}`} />
            {theme.is_active ? "Live" : "Inactive"}
          </span>
        </div>
      </div>
    </div>
  );
}
