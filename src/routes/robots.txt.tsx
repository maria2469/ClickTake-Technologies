import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/robots/txt")({
  component: RobotsPage,
});

const SITE_URL = "https://clicktake.co";

function RobotsPage() {
  const text = `User-agent: *
Allow: /
Disallow: /admin

Sitemap: ${SITE_URL}/sitemap.xml
`;

  return (
    <pre style={{ whiteSpace: "pre-wrap", fontFamily: "monospace", padding: 20, background: "#f5f5f5" }}>
      {text}
    </pre>
  );
}
