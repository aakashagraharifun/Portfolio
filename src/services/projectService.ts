import { supabase } from '@/lib/supabase';
import { Project, ProjectCategory } from '@/types';

/**
 * Service for fetching projects from Supabase
 * Replaces static local files with dynamic backend data
 */
export async function getAllProjects(): Promise<Project[]> {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching projects:', error);
    return [];
  }

  return mapSupabaseToProject(data);
}

export async function getFeaturedProjects(limit = 4): Promise<Project[]> {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .not('highlight', 'is', null) // Only featured/highlighted projects
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching featured projects:', error);
    return [];
  }

  return mapSupabaseToProject(data);
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) {
    console.error('Error fetching project by slug:', error);
    return null;
  }

  const projects = mapSupabaseToProject([data]);
  return projects.length > 0 ? projects[0] : null;
}

/**
 * Mapper to ensure Supabase data matches our Frontend Types
 */
function mapSupabaseToProject(data: any[]): Project[] {
  return data.map(p => ({
    id: p.id,
    title: p.title,
    slug: p.slug,
    category: p.category as ProjectCategory,
    year: p.year,
    coverImage: p.cover_image || '/placeholder-project.jpg',
    images: Array.isArray(p.images) ? p.images : [], // Placeholder for gallery images
    description: p.description || '',
    client: p.client || '',
    location: p.location || '',
    liveUrl: p.live_url || '',
    githubUrl: p.github_url || '',
    techStack: Array.isArray(p.tech_stack) ? p.tech_stack : [],
    highlight: p.highlight || undefined
  }));
}
