import { supabase } from '@/lib/supabase';
import { Win } from '@/types';

export async function getAllWins(): Promise<Win[]> {
  const { data, error } = await supabase
    .from('wins')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching wins:', error);
    return [];
  }

  return data.map(w => ({
    id: w.id,
    title: w.title,
    position: w.position,
    description: w.description || '',
    certificateUrl: w.certificate_url,
    eventDate: w.event_date || '2026',
    slug: w.slug
  }));
}
