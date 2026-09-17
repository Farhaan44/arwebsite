import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  
  const baseUrl = "https://www.architectshahbazahmed.com";

  
  const corePages = ["", "/project", "/service", "/about", "/contact"].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: route === "" ? 1.0 : 0.8,
  }));


  const legalPages = ["/privacy", "/terms", "/disclaimer"].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "yearly" as const,
    priority: 0.5,
  }));

  return [...corePages, ...legalPages];
}