import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/api/", "/maintenance", "/report/"],
      },
    ],
    sitemap: "https://mote-iq.com/sitemap.xml",
  };
}
