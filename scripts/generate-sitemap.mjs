// Build-time sitemap generator
// Pulls live project + blog slugs from Supabase and emits public/sitemap.xml.
// Falls back to the static route list if Supabase is unreachable.
//
// Run before `vite build`:
//   "build": "node scripts/generate-sitemap.mjs && vite build"

import { writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createClient } from '@supabase/supabase-js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SITE_URL = process.env.SITE_URL || 'https://aakashagrahari.com.np';
const OUT = resolve(__dirname, '..', 'public', 'sitemap.xml');

const STATIC_ROUTES = [
  { path: '/', changefreq: 'weekly', priority: 1.0 },
  { path: '/portfolio', changefreq: 'weekly', priority: 0.9 },
  { path: '/about', changefreq: 'monthly', priority: 0.8 },
  { path: '/wins', changefreq: 'monthly', priority: 0.8 },
  { path: '/blog', changefreq: 'weekly', priority: 0.8 },
  { path: '/timeline', changefreq: 'monthly', priority: 0.6 },
  { path: '/gallery', changefreq: 'monthly', priority: 0.6 },
  { path: '/contact', changefreq: 'yearly', priority: 0.5 }
];

const today = new Date().toISOString().slice(0, 10);

async function fetchSlugs(table, slugCol = 'slug', dateCol = 'updated_at') {
  const url = process.env.VITE_SUPABASE_URL;
  const key = process.env.VITE_SUPABASE_ANON_KEY;
  if (!url || !key) {
    console.warn(`[sitemap] Skipping ${table} — Supabase env not set`);
    return [];
  }
  try {
    const supabase = createClient(url, key);
    const { data, error } = await supabase
      .from(table)
      .select(`${slugCol}, ${dateCol}`)
      .order(dateCol, { ascending: false });
    if (error) throw error;
    return (data || [])
      .filter((row) => row[slugCol])
      .map((row) => ({
        slug: row[slugCol],
        lastmod: row[dateCol] ? new Date(row[dateCol]).toISOString().slice(0, 10) : today
      }));
  } catch (err) {
    console.warn(`[sitemap] Could not fetch ${table}: ${err.message}`);
    return [];
  }
}

function urlEntry(loc, lastmod, changefreq, priority, image) {
  return [
    '  <url>',
    `    <loc>${loc}</loc>`,
    `    <lastmod>${lastmod}</lastmod>`,
    `    <changefreq>${changefreq}</changefreq>`,
    `    <priority>${priority}</priority>`,
    image
      ? `    <image:image><image:loc>${image}</image:loc></image:image>`
      : '',
    '  </url>'
  ]
    .filter(Boolean)
    .join('\n');
}

async function main() {
  const [projects, blogs] = await Promise.all([
    fetchSlugs('projects', 'slug', 'updated_at'),
    fetchSlugs('blog', 'slug', 'updated_at')
  ]);

  const entries = [];

  for (const route of STATIC_ROUTES) {
    entries.push(
      urlEntry(`${SITE_URL}${route.path}`, today, route.changefreq, route.priority)
    );
  }

  for (const p of projects) {
    entries.push(
      urlEntry(`${SITE_URL}/project/${p.slug}`, p.lastmod, 'monthly', 0.7)
    );
  }

  for (const b of blogs) {
    entries.push(
      urlEntry(`${SITE_URL}/blog/${b.slug}`, b.lastmod, 'monthly', 0.7)
    );
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${entries.join('\n')}
</urlset>
`;

  writeFileSync(OUT, xml, 'utf8');
  console.log(
    `[sitemap] Wrote ${STATIC_ROUTES.length + projects.length + blogs.length} URLs to ${OUT}`
  );
}

main().catch((e) => {
  console.error('[sitemap] generator failed:', e);
  process.exit(0); // never block the build
});
