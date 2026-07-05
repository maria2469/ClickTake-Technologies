import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
  useRouterState,
} from "@tanstack/react-router";

import { BackgroundScene } from "@/components/BackgroundScene";
import { supabase } from "@/lib/supabaseClient";
import { useEffect, useState } from "react";
import { BackgroundsProvider, useBackgroundsContext, getSectionBackground, bgToStyle, videoStyle } from "@/components/BackgroundRenderer";
import { HelmetProvider } from "react-helmet-async";
import { Toaster } from "sonner";

import appCss from "../styles.css?url";

/* ───────────────── TYPOGRAPHY LOADER ───────────────── */

const FONT_ELEMENT_MAP: Record<string, string> = {
  heading_h1: "--font-heading-h1", heading_h2: "--font-heading-h2", heading_h3: "--font-heading-h3",
  body: "--font-body", nav: "--font-nav", button: "--font-button",
  quote: "--font-quote", code: "--font-code", pricing_number: "--font-pricing",
};

function FontLoader() {
  useEffect(() => {
    const root = document.documentElement;
    const loaded = new Set<string>();

    supabase.from("cms_typography").select("*").then(({ data, error }) => {
      if (error) { console.error("FontLoader: failed to fetch typography", error); return; }
      if (!data) return;
      const families = new Map<string, Set<string>>();

      for (const r of data) {
        const cssVar = FONT_ELEMENT_MAP[r.element];
        if (!cssVar) continue;
        const fontValue = `"${r.font_family}", ${r.element === "code" ? "monospace" : "sans-serif"}`;
        root.style.setProperty(cssVar, fontValue);

        if (r.element === "body") {
          root.style.setProperty("--font-sans", `"${r.font_family}", ui-sans-serif, system-ui, sans-serif`);
        }
        if (r.element === "heading_h1") {
          root.style.setProperty("--font-display", `"${r.font_family}", ui-sans-serif, system-ui, sans-serif`);
        }

        if (r.font_source === "custom" && r.font_file_url && !loaded.has(r.font_file_url)) {
          loaded.add(r.font_file_url);
          const id = `font-face-${r.element}`;
          if (!document.getElementById(id)) {
            const style = document.createElement("style");
            style.id = id;
            style.textContent = `@font-face{font-family:"${r.font_family}";src:url("${r.font_file_url}") format("${r.font_file_format || "woff2"}");font-weight:${r.font_weight};font-display:swap}`;
            document.head.appendChild(style);
          }
        }

        if (r.font_source !== "google") continue;
        if (!families.has(r.font_family)) families.set(r.font_family, new Set());
        for (const w of (r.font_weight || "400").split(",")) families.get(r.font_family)!.add(w.trim());
      }

      // Inject Google Fonts link
      if (families.size > 0) {
        const params = Array.from(families.entries())
          .map(([family, weights]) => `${family.replace(/ /g, "+")}:wght@${Array.from(weights).sort().join(";")}`)
          .join("&family=");
        const href = `https://fonts.googleapis.com/css2?family=${params}&display=swap`;
        if (!document.getElementById("google-fonts-link")) {
          const link = document.createElement("link");
          link.id = "google-fonts-link";
          link.rel = "stylesheet";
          link.href = href;
          document.head.appendChild(link);
        }
      }

      // Inject runtime style tag with ALL typography properties
      const existing = document.getElementById("typography-runtime");
      if (existing) existing.remove();
      const STYLE_SEL: Record<string, string> = {
        body: "body",
        heading_h1: "h1",
        heading_h2: "h2",
        heading_h3: "h3",
        nav: "nav, header nav a, .nav-link",
        button: "button, .btn, [role=\"button\"]",
        quote: "blockquote, .quote",
        code: "code, pre, code *, pre *",
        pricing_number: ".pricing-number, .price, .pricing .amount",
      };
      const css = data.map(r => {
        const sel = STYLE_SEL[r.element];
        if (!sel) return "";
        const family = `"${r.font_family}", ${r.element === "code" ? "monospace" : "sans-serif"}`;
        const weight = r.font_weight || "400";
        const height = r.line_height || 1.5;
        const spacing = r.letter_spacing ? `${parseFloat(r.letter_spacing)}em` : "0em";
        const transform = r.text_transform || "none";
        return `${sel}{font-family:${family};font-weight:${weight};line-height:${height};letter-spacing:${spacing};text-transform:${transform}}`;
      }).filter(Boolean).join("");
      const style = document.createElement("style");
      style.id = "typography-runtime";
      style.textContent = css;
      document.head.appendChild(style);
    });

    // Adobe Fonts
    supabase.from("site_settings").select("value").eq("key", "adobe_fonts_kit_id").maybeSingle().then(({ data }) => {
      const kitId = data?.value;
      if (kitId && !document.getElementById("adobe-fonts")) {
        const link = document.createElement("link");
        link.id = "adobe-fonts";
        link.rel = "stylesheet";
        link.href = `https://use.typekit.net/${kitId}.css`;
        document.head.appendChild(link);
      }
    });
  }, []);

  return null;
}

/* ───────────────── NOT FOUND ───────────────── */


function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold">404</h1>

        <h2 className="mt-4 text-xl font-semibold">
          Page not found
        </h2>

        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist.
        </p>

        <Link
          to="/"
          className="mt-6 inline-flex rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground"
        >
          Go home
        </Link>
      </div>
    </div>
  );
}

/* ───────────────── ERROR ───────────────── */

function ErrorComponent({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {

  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold">
          Something went wrong
        </h1>

        <button
          onClick={() => {
            router.invalidate();
            reset();
          }}
          className="mt-6 rounded-md bg-primary px-4 py-2 text-primary-foreground"
        >
          Try again
        </button>
      </div>
    </div>
  );
}

/* ───────────────── ROOT ROUTE ───────────────── */

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
}>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },

      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },

      {
        title: "ClickTake Technologies",
      },
    ],

    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),

  shellComponent: RootShell,

  component: RootComponent,

  notFoundComponent: NotFoundComponent,

  errorComponent: ErrorComponent,
});

/* ───────────────── SHELL ───────────────── */

function RootShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>

      <body className="bg-background text-foreground antialiased">
        {children}

        <Scripts />
      </body>
    </html>
  );
}

/* ───────────────── ROOT COMPONENT ───────────────── */

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <BackgroundsProvider>
      <HelmetProvider>
        <QueryClientProvider client={queryClient}>
          <RootContent />
        </QueryClientProvider>
      </HelmetProvider>
    </BackgroundsProvider>
  );
}

function RootContent() {
  const pathname = useRouterState({
    select: (s) => s.location.pathname,
  });

  const backgrounds = useBackgroundsContext();
  const globalBg = getSectionBackground(backgrounds, "global");


  useEffect(() => {
    // Only track public-facing page views (ignore admin portal traffic)
    if (pathname && !pathname.startsWith('/admin')) {
      supabase.from('page_views').insert({ path: pathname }).then(({ error }) => {
        if (error) { /* silently ignore page view tracking errors */ }      });
    }
  }, [pathname]);

  // Inject structured data (JSON-LD)
  useEffect(() => {
    if (!document.querySelector('script[type="application/ld+json"][data-org="clicktake"]')) {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute('data-org', 'clicktake');
      script.textContent = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Organization",
        name: "ClickTake Technologies",
        url: "https://clicktake.co",
        logo: "https://clicktake.co/logo.png",
        sameAs: [
          "https://linkedin.com/company/clicktake",
          "https://twitter.com/clicktake",
          "https://facebook.com/clicktake",
        ],
        contactPoint: {
          "@type": "ContactPoint",
          contactType: "sales",
          email: "hello@clicktake.co",
        },
      });
      document.head.appendChild(script);
    }
  }, []);

  // Inject GA4 + GSC meta tags from DB settings
  useEffect(() => {
    supabase.from('site_settings').select('key, value').in('key', ['ga4_measurement_id', 'gsc_verification_code']).then(({ data }) => {
      if (!data) return;
      const ga4Id = data.find(s => s.key === 'ga4_measurement_id')?.value;
      const gscCode = data.find(s => s.key === 'gsc_verification_code')?.value;

      // GSC meta tag
      if (gscCode && !document.querySelector('meta[name="google-site-verification"]')) {
        const meta = document.createElement('meta');
        meta.name = 'google-site-verification';
        meta.content = gscCode;
        document.head.appendChild(meta);
      }

      // GA4 script (avoid duplicate)
      if (ga4Id && !document.querySelector(`script[data-ga4="${ga4Id}"]`)) {
        const script1 = document.createElement('script');
        script1.setAttribute('data-ga4', ga4Id);
        script1.async = true;
        script1.src = `https://www.googletagmanager.com/gtag/js?id=${ga4Id}`;
        document.head.appendChild(script1);

        const script2 = document.createElement('script');
        script2.setAttribute('data-ga4', ga4Id);
        script2.textContent = `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)};gtag('js',new Date());gtag('config','${ga4Id}');`;
        document.head.appendChild(script2);
      }
    });
  }, []);

  const hasGlobalBg = globalBg?.bg_type && globalBg.is_active;

  return (
    <>
      <FontLoader />
      <div
      className="relative min-h-screen overflow-x-hidden"
      style={hasGlobalBg ? { ...bgToStyle(globalBg!), backgroundAttachment: 'fixed' } : {}}
    >
      {/* ───── VIDEO BACKGROUND (only with active global bg) ───── */}
      {hasGlobalBg && globalBg!.bg_type === "video" && (globalBg!.video_desktop || globalBg!.video_tablet || globalBg!.video_mobile) && (
        <video autoPlay muted loop playsInline className="fixed inset-0 w-full h-full"
          style={videoStyle(globalBg!)}
          src={globalBg!.video_desktop || globalBg!.video_tablet || globalBg!.video_mobile || undefined} />
      )}
      {/* ───── OVERLAY (only with active global bg) ───── */}
      {hasGlobalBg && globalBg!.overlay_color && (
        <div className="fixed inset-0 z-0 pointer-events-none" style={{
          backgroundColor: globalBg!.overlay_color,
          opacity: (globalBg!.overlay_opacity || 0) / 100,
          mixBlendMode: globalBg!.overlay_blend_mode as any,
        }} />
      )}

      {/* ───── DEFAULT BACKGROUND (only when no global bg is active) ───── */}
      {!hasGlobalBg && (
        <div className="fixed inset-0 z-0">
          <BackgroundScene />
        </div>
      )}

      {/* ───── CONTENT LAYER ───── */}
      <main className={`relative z-10 ${!hasGlobalBg ? 'bg-background' : ''}`}>
        <Outlet />
      </main>

      <Toaster position="top-right" theme="dark" />
    </div>
    </>
  );
}