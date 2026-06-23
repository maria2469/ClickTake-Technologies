import { createFileRoute, notFound } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { SEOHead } from "@/components/SEOHead";
import { BackgroundScene } from "@/components/BackgroundScene";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CustomCursor } from "@/components/CustomCursor";

export const Route = createFileRoute("/$")({
  component: DynamicPage,
});

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
}

function DynamicPage() {
  const { _splat } = Route.useParams();
  const slug = "/" + (_splat || "");

  const [page, setPage] = useState<CMSPage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchPage = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("pages")
          .select("*")
          .eq("slug", slug)
          .eq("is_published", true)
          .single();

        if (error || !data) {
          setError(true);
        } else {
          setPage(data);
        }
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchPage();
  }, [slug]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-foreground">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-magenta border-t-transparent"></div>
      </div>
    );
  }

  if (error || !page) {
    // Return a 404-like experience if page doesn't exist
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background text-foreground px-4 text-center">
        <h1 className="text-7xl font-bold font-display text-gradient">404</h1>
        <h2 className="mt-4 text-xl font-semibold">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or isn't published yet.
        </p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Dynamic SEO Tags */}
      <SEOHead
        title={page.meta_title || page.title}
        description={page.meta_description}
        canonical={page.canonical_url || undefined}
        ogImage={page.og_image_url || undefined}
      />

      <BackgroundScene />
      <CustomCursor />
      <Navbar />

      <main className="relative z-10 pt-32 pb-24 mx-auto max-w-4xl px-4 min-h-[70vh]">
        {/* If no blocks, at least show the title */}
        {(!page.blocks || page.blocks.length === 0) && (
          <h1 className="font-display text-4xl font-bold tracking-tight text-gradient mb-8">
            {page.title}
          </h1>
        )}

        {/* Dynamic Blocks Renderer */}
        <div className="space-y-8">
          {page.blocks?.map((block) => {
            if (block.type === "header") {
              return (
                <h2 key={block.id} className="font-display text-3xl font-bold tracking-tight text-gradient">
                  {block.content}
                </h2>
              );
            }
            if (block.type === "text") {
              return (
                <div
                  key={block.id}
                  className="prose prose-invert prose-brand max-w-none text-muted-foreground leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: block.content }}
                />
              );
            }
            if (block.type === "button") {
              return (
                <div key={block.id} className="pt-2">
                  <a
                    href={block.meta || "#"}
                    className="inline-flex rounded-full bg-gradient-brand px-6 py-2.5 text-sm font-bold text-white shadow-lg hover:scale-105 transition-transform"
                  >
                    {block.content}
                  </a>
                </div>
              );
            }
            if (block.type === "media" && block.content) {
              return (
                <div key={block.id} className="my-8 overflow-hidden rounded-2xl border border-white/10 shadow-2xl">
                  <img
                    src={block.content}
                    alt="CMS Media"
                    className="w-full h-auto object-cover"
                  />
                </div>
              );
            }
            return null;
          })}
        </div>
      </main>

      <Footer />
    </div>
  );
}
