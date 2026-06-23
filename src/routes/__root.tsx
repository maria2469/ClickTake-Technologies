import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
  useRouterState,
  ScrollRestoration,
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
  console.error("🚨 ROUTE ERROR:", error);

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

        <ScrollRestoration />
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

  console.log("🌍 CURRENT PATH:", pathname);

  useEffect(() => {
    // Only track public-facing page views (ignore admin portal traffic)
    if (pathname && !pathname.startsWith('/admin')) {
      supabase.from('page_views').insert({ path: pathname }).then(({ error }) => {
        if (error) console.error("Page view tracking skipped (SQL table missing):", error.message);
      });
    }
  }, [pathname]);

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