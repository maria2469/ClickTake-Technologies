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
import { useEffect } from "react";
import { HelmetProvider } from "react-helmet-async";
import { Toaster } from "sonner";

import appCss from "../styles.css?url";

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

  // ✅ SSR-safe pathname
  const pathname = useRouterState({
    select: (s) => s.location.pathname,
  });


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

  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <div className="relative min-h-screen overflow-x-hidden">
          {/* ───── BACKGROUND LAYER ───── */}
          <div className="fixed inset-0 z-0">
            <BackgroundScene />
          </div>

          {/* ───── CONTENT LAYER ───── */}
          <main className="relative z-10">
            <Outlet />
          </main>
          
          <Toaster position="top-right" theme="dark" />
        </div>
      </QueryClientProvider>
    </HelmetProvider>
  );
}