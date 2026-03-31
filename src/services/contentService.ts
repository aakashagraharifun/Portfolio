import { supabase } from '@/lib/supabase';
import { Project, ProjectCategory } from '@/types';

/**
 * MASTER CONTENT SERVICE - STABLE VERSION
 * Optimized with safety guards to prevent UI crashes if tables are missing
 */

// PROJECTS
export async function getFeaturedProjects(limit = 4): Promise<Project[]> {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);
      
    if (error || !data) return [];
    return mapSupabaseToProject(data);
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
export async function getGalleryImages(limit = 8) {
  try {
    const { data, error } = await supabase
      .from('gallery')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);
      
    if (error || !data) return [];
    return data;
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

// MAPPER - Safety checks for each field
function mapSupabaseToProject(data: any[]): Project[] {
  if (!Array.isArray(data)) return [];
  return data.map(p => ({
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
    highlight: p.highlight || undefined
  }));
}
