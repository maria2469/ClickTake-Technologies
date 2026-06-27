import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/sitemap/xml")({
  component: SitemapPage,
});

const SITE_URL = "https://clicktake.co";

const PAGES = [
  "/",
  "/about",
  "/contact",
  "/portfolio",
  "/resources",
  "/services",
  "/services/seo",
  "/services/starter-kit",
  "/services/ai/chatbots",
  "/services/ai/llm",
  "/services/ai/cv-nlp",
  "/services/ai/prompt-engineering",
  "/services/creative/graphic-design",
  "/services/creative/video-production",
  "/services/web/full-stack",
  "/services/web/auth",
  "/services/web/python-backend",
  "/services/web/saas",
  "/services/digital-marketing/cro",
  "/services/digital-marketing/paid-advertising",
  "/services/digital-marketing/content-strategy",
  "/legal/terms",
  "/legal/privacy",
  "/legal/cookies",
];

function SitemapPage() {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${PAGES.map((page) => `  <url>
    <loc>${SITE_URL}${page}</loc>
    <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${page === "/" ? "1.0" : "0.8"}</priority>
  </url>`).join("\n")}
</urlset>`;

  return (
    <pre style={{ whiteSpace: "pre-wrap", fontFamily: "monospace", padding: 20, background: "#f5f5f5" }}>
      {xml}
    </pre>
  );
}
