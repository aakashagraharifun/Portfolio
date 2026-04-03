import { supabase } from '@/lib/supabase';
import { isPinnedText, sortPinnedFirst, stripPinnedMarker } from '@/lib/pinnedContent';
import { Project, ProjectCategory } from '@/types';

/**
 * MASTER CONTENT SERVICE - STABLE VERSION
 * Optimized with safety guards to prevent UI crashes if tables are missing
 */

function normalizeGalleryItems(data: any[]) {
  if (!Array.isArray(data)) return [];

  return sortPinnedFirst(
    data.map((item) => ({
      ...item,
      caption: stripPinnedMarker(item.caption) || '',
      isPinned: isPinnedText(item.caption)
    })),
    (item) => Boolean(item.isPinned)
  );
}

function normalizeTimelineItems(data: any[], sortPinned = true) {
  if (!Array.isArray(data)) return [];

  const items = data.map((item) => ({
    ...item,
    title: stripPinnedMarker(item.title) || 'Untitled Milestone',
    isPinned: isPinnedText(item.title)
  }));

  if (sortPinned) {
    return sortPinnedFirst(items, (item) => Boolean(item.isPinned));
  }

  return items;
}

// PROJECTS
export async function getFeaturedProjects(limit = 4): Promise<Project[]> {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100);
      
    if (error || !data) return [];
    return mapSupabaseToProject(data)
      .filter((project) => project.isPinned)
      .slice(0, limit);
  } catch (e) {
    console.error("Project fetch failed:", e);
    return [];
  }
}

// BLOGS
export async function getLatestBlogs(limit = 3) {
  try {
    const { data, error } = await supabase
      .from('blog')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);
      
    if (error || !data) return [];
    return data;
  } catch (e) {
    console.error("Blog fetch failed:", e);
    return [];
  }
}

// GALLERY
export async function getGalleryImages(limit?: number, pinnedOnly = false) {
  try {
    const { data, error } = await supabase
      .from('gallery')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error || !data) return [];

    const normalized = normalizeGalleryItems(data);
    const filtered = pinnedOnly ? normalized.filter((item) => item.isPinned) : normalized;
    return typeof limit === 'number' ? filtered.slice(0, limit) : filtered;
  } catch (e) {
    console.error("Gallery fetch failed:", e);
    return [];
  }
}

// SKILLS
export async function getSkills() {
  try {
    const { data, error } = await supabase
      .from('skills')
      .select('*')
      .order('name', { ascending: true });
      
    if (error || !data) return [];
    return data;
  } catch (e) {
    console.error("Skills fetch failed:", e);
    return [];
  }
}

// SOCIALS
export async function getSocials() {
  try {
    const { data, error } = await supabase
      .from('socials')
      .select('*')
      .order('platform', { ascending: true });
      
    if (error || !data) return [];
    return data;
  } catch (e) {
    console.error("Socials fetch failed:", e);
    return [];
  }
}

// TIMELINE
export async function getTimeline(pinnedOnly = false, sortPinned = true) {
  try {
    const { data, error } = await supabase
      .from('timeline')
      .select('*')
      .order('sort_order', { ascending: true });
      
    if (error || !data) return [];

    const normalized = normalizeTimelineItems(data, sortPinned);
    return pinnedOnly ? normalized.filter((item) => item.isPinned) : normalized;
  } catch (e) {
    console.error("Timeline fetch failed:", e);
    return [];
  }
}

export async function getHomepageTimeline() {
  const items = await getTimeline(false);
  if (!Array.isArray(items)) return [];
  return items.filter((item) => item.isPinned);
}

// MAPPER - Safety checks for each field
function mapSupabaseToProject(data: any[]): Project[] {
  if (!Array.isArray(data)) return [];
  return sortPinnedFirst(data.map(p => ({
    id: p.id,
    title: p.title || 'Untitled Project',
    slug: p.slug || 'untitled',
    category: (p.category as ProjectCategory) || 'webapp',
    year: p.year || '2026',
    coverImage: p.cover_image || '/placeholder-project.jpg',
    images: Array.isArray(p.images) ? p.images : [],
    description: p.description || '',
    client: p.client || '',
    location: p.location || '',
    liveUrl: p.live_url || '',
    githubUrl: p.github_url || '',
    techStack: Array.isArray(p.tech_stack) ? p.tech_stack : [],
    highlight: stripPinnedMarker(p.highlight) || undefined,
    isPinned: isPinnedText(p.highlight)
  })), (project) => Boolean(project.isPinned));
}
