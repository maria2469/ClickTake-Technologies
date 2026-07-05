import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

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
}

function getPatternCSS(pattern_type: string): string | null {
  const c = "rgba(255,255,255,0.12)";
  switch (pattern_type) {
    case "dots": return `radial-gradient(circle, ${c} 1px, transparent 1px)`;
    case "grid": return `linear-gradient(${c} 1px, transparent 1px), linear-gradient(90deg, ${c} 1px, transparent 1px)`;
    case "stripes": return `repeating-linear-gradient(45deg, transparent, transparent 4px, ${c} 4px, ${c} 8px)`;
    case "checkers": return `conic-gradient(${c} 25%, transparent 25% 50%, ${c} 50% 75%, transparent 75%)`;
    case "zigzag": return `repeating-linear-gradient(-45deg, transparent, transparent 4px, ${c} 4px, ${c} 8px), repeating-linear-gradient(45deg, transparent, transparent 4px, ${c} 4px, ${c} 8px)`;
    default: return null;
  }
}

export function bgToStyle(bg: BackgroundConfig): React.CSSProperties {
  const style: React.CSSProperties = {};

  switch (bg.bg_type) {
    case "solid":
      style.backgroundColor = bg.solid_color || "#0a0a0f";
      break;
    case "gradient":
      style.backgroundImage = `linear-gradient(${bg.gradient_direction || "to right"}, ${bg.gradient_color_1 || bg.solid_color}, ${bg.gradient_color_2 || bg.solid_color})`;
      break;
    case "image": {
      const url = bg.image_desktop || bg.image_tablet || bg.image_mobile;
      if (url) style.backgroundImage = `url(${url})`;
      break;
    }
    case "video":
      style.backgroundColor = bg.solid_color || "#0a0a0f";
      break;
    case "pattern": {
      style.backgroundColor = bg.solid_color || "#0a0a0f";
      const pat = getPatternCSS(bg.pattern_type);
      if (pat) style.backgroundImage = pat;
      break;
    }
    case "animated":
      if (bg.solid_color) style.backgroundColor = bg.solid_color;
      break;
  }

  if (bg.bg_type === "pattern") {
    style.backgroundSize = bg.pattern_type === "stripes" || bg.pattern_type === "zigzag" ? "12px 12px" : "20px 20px";
    style.backgroundRepeat = "repeat";
    style.backgroundPosition = "0 0";
    style.backgroundAttachment = bg.parallax ? "fixed" : "scroll";
  } else {
    const hasImage = bg.bg_type === "image" && !!(bg.image_desktop || bg.image_tablet || bg.image_mobile);
    style.backgroundSize = bg.sizing === "custom" ? "auto" : bg.sizing || "cover";
    style.backgroundPosition = bg.custom_position || "center";
    style.backgroundRepeat = hasImage && bg.sizing !== "repeat" ? "no-repeat" : "repeat";
    style.backgroundAttachment = bg.parallax ? "fixed" : bg.attachment || "scroll";
  }

  return style;
}

export function videoStyle(bg: BackgroundConfig): React.CSSProperties {
  const fit = bg.sizing === "contain" ? "contain" : bg.sizing === "fill" ? "fill" : bg.sizing === "none" ? "none" : "cover";
  return {
    objectFit: fit as any,
    objectPosition: bg.sizing === "custom" ? (bg.custom_position || "center") : "center",
  };
}

export function overlayStyle(bg: BackgroundConfig): React.CSSProperties {
  if (!bg.overlay_color) return {};
  return {
    position: "absolute",
    inset: 0,
    backgroundColor: bg.overlay_color,
    opacity: (bg.overlay_opacity || 0) / 100,
    mixBlendMode: (bg.overlay_blend_mode as any) || "normal",
    pointerEvents: "none",
  };
}

export function useBackgrounds() {
  const [backgrounds, setBackgrounds] = useState<BackgroundConfig[]>([]);

  useEffect(() => {
    const fetchBg = () =>
      supabase.from("cms_backgrounds").select("*").eq("is_active", true).then(({ data }) => {
        if (data) setBackgrounds(data);
      });

    fetchBg();

    const channel = supabase
      .channel("public-backgrounds")
      .on("postgres_changes", { event: "*", schema: "public", table: "cms_backgrounds" }, fetchBg)
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  return backgrounds;
}

const BackgroundsContext = createContext<BackgroundConfig[]>([]);

export function BackgroundsProvider({ children }: { children: React.ReactNode }) {
  const backgrounds = useBackgrounds();
  return <BackgroundsContext.Provider value={backgrounds}>{children}</BackgroundsContext.Provider>;
}

export function useBackgroundsContext() {
  return useContext(BackgroundsContext);
}

export function getSectionBackground(backgrounds: BackgroundConfig[], section: string): BackgroundConfig | undefined {
  return backgrounds.find((bg) => bg.section === section) || backgrounds.find((bg) => bg.section === "global");
}

interface BackgroundWrapperProps {
  background: BackgroundConfig | undefined;
  children: React.ReactNode;
  className?: string;
}

export function CtaSection({ children, className = "relative z-10 py-24 px-4" }: { children: React.ReactNode; className?: string }) {
  const ctaBg = getSectionBackground(useBackgroundsContext(), "cta");
  if (!ctaBg) return <section className={className}>{children}</section>;
  return (
    <section className={className} style={bgToStyle(ctaBg)}>
      {ctaBg.bg_type === "video" && (ctaBg.video_desktop || ctaBg.video_tablet || ctaBg.video_mobile) && (
        <video autoPlay muted loop playsInline className="absolute inset-0 w-full h-full" style={videoStyle(ctaBg)}
          src={ctaBg.video_desktop || ctaBg.video_tablet || ctaBg.video_mobile || undefined} />
      )}
      {ctaBg.overlay_color && <div style={overlayStyle(ctaBg)} />}
      <div className="relative z-10">{children}</div>
    </section>
  );
}

export function BackgroundSection({ background, children, className = "" }: BackgroundWrapperProps) {
  if (!background) return <section className={className}>{children}</section>;

  return (
    <section className={`relative ${className}`} style={bgToStyle(background)}>
      {background.overlay_color && <div style={overlayStyle(background)} />}
      {background.bg_type === "video" && (background.video_desktop || background.video_tablet || background.video_mobile) && (
        <video
          autoPlay muted loop playsInline
          className="absolute inset-0 w-full h-full"
          style={{ zIndex: 0, ...videoStyle(background) }}
          src={background.video_desktop || background.video_tablet || background.video_mobile || undefined}
        />
      )}
      <div className="relative z-10">{children}</div>
    </section>
  );
}
