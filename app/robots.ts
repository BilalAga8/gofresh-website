import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/login-admin", "/client-profile"],
    },
    sitemap: "https://gofresh-website.vercel.app/sitemap.xml",
  };
}
