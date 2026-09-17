import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  // Replace this with your actual production URL
  const baseUrl = "https://www.architectshahbazahmed.com";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // This blocks crawlers from indexing individual project pages 
      // while still allowing the main "/project" index page to be scanned.
      disallow: ["/project/"], 
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}