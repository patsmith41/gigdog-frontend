// src/app/sitemap.ts
import { MetadataRoute } from 'next';

// This is a minimal, valid sitemap that will pass the build.
// We will add dynamic data from your API in a future step.
const SITE_URL = 'https://gigdog.live'; // IMPORTANT: Use your real domain here

export default function sitemap(): MetadataRoute.Sitemap {
  
  const staticUrls = [
    { url: SITE_URL, lastModified: new Date(), changeFrequency: 'daily' as const, priority: 1.0 },
    { url: `${SITE_URL}/venues`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.8 },
    { url: `${SITE_URL}/about`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.5 },
    { url: `${SITE_URL}/contact`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.5 },
  ];

  return staticUrls;
}