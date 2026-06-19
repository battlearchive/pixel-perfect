import { createFileRoute } from "@tanstack/react-router";
import { listBattles } from "@/lib/battles.functions";

const DOMAIN = "https://battlearchive.com";

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const battles = await listBattles();

        const staticPages = [
          { url: "/", priority: "1.0", changefreq: "weekly" },
          { url: "/battles", priority: "0.9", changefreq: "weekly" },
          { url: "/timeline", priority: "0.8", changefreq: "monthly" },
          { url: "/about", priority: "0.5", changefreq: "monthly" },
        ];

        const battlePages = battles.map((b) => ({
          url: `/battles/${b.slug}`,
          priority: "0.9",
          changefreq: "monthly",
        }));

        const allPages = [...staticPages, ...battlePages];

        const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages
  .map(
    (p) => `  <url>
    <loc>${DOMAIN}${p.url}</loc>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`,
  )
  .join("\n")}
</urlset>`;

        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml; charset=utf-8",
            "Cache-Control": "public, max-age=3600, s-maxage=86400",
          },
        });
      },
    },
  },
});
