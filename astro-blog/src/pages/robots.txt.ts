import type { APIRoute } from "astro";

const getRobotsTxt = (site: URL) => {
  const sitemapURL = new URL("sitemap.xml", site).href;
  const templateSitemapURL = new URL(
    "tools/n8n_template/sitemap.xml",
    site
  ).href;

  return [
    "User-agent: *",
    "Content-Signal: ai-train=no, search=yes, ai-input=yes",
    "Allow: /",
    "Allow: /archives/",
    "Allow: /tags/",
    "Allow: /tools/n8n_template/model-detail.html?model=*",
    "",
    "Disallow: /vendors/",
    "Disallow: /fonts/",
    "Disallow: /fancybox/",
    "",
    "User-agent: Googlebot",
    "Disallow:",
    "User-agent: Googlebot-image",
    "Disallow:",
    "",
    "",
    `Sitemap: ${sitemapURL}`,
    `Sitemap: ${templateSitemapURL}`,
  ].join("\n");
};

export const GET: APIRoute = ({ site }) => {
  if (!site) {
    throw new Error("The site URL is required to render robots.txt.");
  }
  return new Response(getRobotsTxt(site));
};
