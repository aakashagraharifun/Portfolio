import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { isPinnedText, setPinnedText, stripPinnedMarker } from '@/lib/pinnedContent';
import { 
  Plus, Trash2, LogOut, Loader2, Image as ImageIcon, ExternalLink, 
  Github, Code2, Trophy, Rocket, GraduationCap, Briefcase, 
  Sparkles, History, Send, Camera, BookOpen, Layers, Share2, User, Star, Pencil
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const navigate = useNavigate();
  const initialProjectForm = {
    title: '',
    category: 'webapp',
    year: '2026',
    description: '',
    tech_stack: '',
    live_url: '',
    github_url: '',
    cover_image: null as File | null
  };
  const initialTimelineForm = { year: '2026', title: '', description: '', icon_type: 'sparkles' };
  const initialGalleryForm = { caption: '', image: null as File | null };
  const initialBlogForm = { title: '', excerpt: '', content: '', cover_image: null as File | null };
  const initialSkillForm = { name: '', category: 'technical' };
  const initialSocialForm = { platform: '', url: '' };

  // Data Store
  const [projects, setProjects] = useState<any[]>([]);
  const [timeline, setTimeline] = useState<any[]>([]);
  const [gallery, setGallery] = useState<any[]>([]);
  const [blogs, setBlogs] = useState<any[]>([]);
  const [skills, setSkills] = useState<any[]>([]);
  const [socials, setSocials] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>(null);

  // Form States
  const [projectForm, setProjectForm] = useState(initialProjectForm);
  const [timelineForm, setTimelineForm] = useState(initialTimelineForm);
  const [galleryForm, setGalleryForm] = useState(initialGalleryForm);
  const [blogForm, setBlogForm] = useState(initialBlogForm);
  const [skillForm, setSkillForm] = useState(initialSkillForm);
  const [socialForm, setSocialForm] = useState(initialSocialForm);
  const [profileForm, setProfileForm] = useState({ name: '', tagline: 'FULL STACK BUILDER.', bio: '', location: 'INDIA', portrait: null as File | null });
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [editingTimelineId, setEditingTimelineId] = useState<string | null>(null);
  const [editingGalleryId, setEditingGalleryId] = useState<string | null>(null);
  const [editingBlogId, setEditingBlogId] = useState<string | null>(null);
  const [editingSkillId, setEditingSkillId] = useState<string | null>(null);
  const [editingSocialId, setEditingSocialId] = useState<string | null>(null);

  const slugify = (value: string) =>
    value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');

  const jumpToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const resetProjectEditor = () => {
    setProjectForm(initialProjectForm);
    setEditingProjectId(null);
    setIsAdding(false);
  };

  const resetTimelineEditor = () => {
    setTimelineForm(initialTimelineForm);
    setEditingTimelineId(null);
  };

  const resetGalleryEditor = () => {
    setGalleryForm(initialGalleryForm);
    setEditingGalleryId(null);
  };

  const resetBlogEditor = () => {
    setBlogForm(initialBlogForm);
    setEditingBlogId(null);
  };

  const resetSkillEditor = () => {
    setSkillForm(initialSkillForm);
    setEditingSkillId(null);
  };

  const resetSocialEditor = () => {
    setSocialForm(initialSocialForm);
    setEditingSocialId(null);
  };

  const startEditProject = (project: any) => {
    setEditingProjectId(project.id);
    setIsAdding(true);
    setProjectForm({
      title: project.title || '',
      category: project.category || 'webapp',
      year: project.year || '2026',
      description: project.description || '',
      tech_stack: Array.isArray(project.tech_stack) ? project.tech_stack.join(', ') : '',
      live_url: project.live_url || '',
      github_url: project.github_url || '',
      cover_image: null
    });
    jumpToTop();
  };

  const startEditTimeline = (item: any) => {
    setEditingTimelineId(item.id);
    setTimelineForm({
      year: item.year || '2026',
      title: stripPinnedMarker(item.title) || '',
      description: item.description || '',
      icon_type: item.icon_type || 'sparkles'
    });
    jumpToTop();
  };

  const startEditGallery = (item: any) => {
    setEditingGalleryId(item.id);
    setGalleryForm({
      caption: stripPinnedMarker(item.caption) || '',
      image: null
    });
    jumpToTop();
  };

  const startEditBlog = (item: any) => {
    setEditingBlogId(item.id);
    setBlogForm({
      title: item.title || '',
      excerpt: item.excerpt || '',
      content: item.content || '',
      cover_image: null
    });
    jumpToTop();
  };

  const startEditSkill = (item: any) => {
    setEditingSkillId(item.id);
    setSkillForm({
      name: item.name || '',
      category: item.category || 'technical'
    });
    jumpToTop();
  };

  const startEditSocial = (item: any) => {
    setEditingSocialId(item.id);
    setSocialForm({
      platform: item.platform || '',
      url: item.url || ''
    });
    jumpToTop();
  };

  const buildPayload = async (
    table: string,
    data: any,
    file?: File,
    bucket?: string,
    existingItem?: any
  ) => {
    const finalData = { ...data };

    if (file && bucket) {
      const url = await uploadFile(file, bucket);
      if (table === 'gallery') finalData.image_url = url;
      else finalData.cover_image = url;
    }

    if (table === 'projects') {
      const parsedTechStack = typeof data.tech_stack === 'string'
        ? data.tech_stack.split(',').map((s: string) => s.trim()).filter(Boolean)
        : Array.isArray(data.tech_stack)
          ? data.tech_stack
          : [];

      finalData.title = data.title?.trim() || '';
      finalData.category = data.category?.trim() || 'webapp';
      finalData.year = data.year?.trim() || '2026';
      finalData.description = data.description?.trim() || '';
      finalData.tech_stack = parsedTechStack.length ? parsedTechStack : null;
      finalData.live_url = data.live_url?.trim() || null;
      finalData.github_url = data.github_url?.trim() || null;
      finalData.slug = slugify(finalData.title);
    }

    if (table === 'timeline') {
      finalData.year = data.year?.trim() || '2026';
      finalData.title = setPinnedText(data.title?.trim() || '', isPinnedText(existingItem?.title)) || '';
      finalData.description = data.description?.trim() || '';
      finalData.icon_type = data.icon_type || 'sparkles';
    }

    if (table === 'gallery') {
      finalData.caption = setPinnedText(data.caption?.trim() || '', isPinnedText(existingItem?.caption)) || '';
    }

    if (table === 'blog') {
      finalData.title = data.title?.trim() || '';
      finalData.excerpt = data.excerpt?.trim() || '';
      finalData.content = data.content?.trim() || '';
      finalData.slug = slugify(finalData.title);
    }

    if (table === 'skills') {
      finalData.name = data.name?.trim() || '';
      finalData.category = data.category || 'technical';
    }

    if (table === 'socials') {
      finalData.platform = data.platform?.trim() || '';
      finalData.url = data.url?.trim() || '';
    }

    const { image, portrait, ...payload } = finalData;

    if (payload.cover_image instanceof File || payload.cover_image === null || payload.cover_image === '') {
      delete payload.cover_image;
    }

    if (payload.image_url === null || payload.image_url === '') {
      delete payload.image_url;
    }

    return payload;
  };

  useEffect(() => {
    checkUser();
    fetchAllData();
  }, []);

  async function checkUser() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) navigate('/admin');
  }

  async function fetchAllData() {
    setLoading(true);
    try {
      const results = await Promise.allSettled([
        supabase.from('projects').select('*').order('created_at', { ascending: false }),
        supabase.from('timeline').select('*').order('sort_order', { ascending: true }),
        supabase.from('gallery').select('*').order('created_at', { ascending: false }),
        supabase.from('blog').select('*').order('created_at', { ascending: false }),
        supabase.from('skills').select('*').order('name', { ascending: true }),
        supabase.from('socials').select('*').order('platform', { ascending: true }),
        supabase.from('profile').select('*').single()
      ]);

      setProjects(results[0].status === 'fulfilled' ? (results[0].value.data || []) : []);
      setTimeline(results[1].status === 'fulfilled' ? (results[1].value.data || []) : []);
      setGallery(results[2].status === 'fulfilled' ? (results[2].value.data || []) : []);
      setBlogs(results[3].status === 'fulfilled' ? (results[3].value.data || []) : []);
      setSkills(results[4].status === 'fulfilled' ? (results[4].value.data || []) : []);
      setSocials(results[5].status === 'fulfilled' ? (results[5].value.data || []) : []);
      
      if (results[6].status === 'fulfilled' && results[6].value.data) {
        const p = results[6].value.data;
        setProfile(p);
        setProfileForm({ name: p.name, tagline: p.tagline, bio: p.bio, location: p.location, portrait: null });
      }
    } catch (err: any) { toast.error("Data Load Issue: " + err.message); } finally { setLoading(false); }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/admin');
  };

  const uploadFile = async (file: File, bucket: string) => {
    const fileName = `${Math.random()}.${file.name.split('.').pop()}`;
    const { error } = await supabase.storage.from(bucket).upload(fileName, file);
    if (error) throw error;
    const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(fileName);
    return publicUrl;
  };

  const handleCreate = async (table: string, data: any, resetForm: any, file?: File, bucket?: string) => {
    setFormLoading(true);
    try {
      const payloadToInsert = await buildPayload(table, data, file, bucket);
      
      console.log(`[SHIP DEBUG] Table: ${table}`, payloadToInsert);

      const { error } = await supabase.from(table).insert([payloadToInsert]);
      if (error) throw error;
      toast.success('Successfully Added.');
      setIsAdding(false);
      resetForm();
      fetchAllData();
    } catch (err: any) { 
      console.error("[SHIP ERROR]:", err);
      toast.error(err.message); 
    } finally { setFormLoading(false); }
  };

  const handleUpdate = async (
    table: string,
    id: string,
    data: any,
    resetForm: () => void,
    file?: File,
    bucket?: string,
    existingItem?: any
  ) => {
    setFormLoading(true);
    try {
      const payload = await buildPayload(table, data, file, bucket, existingItem);
      const { error } = await supabase.from(table).update(payload).match({ id });
      if (error) throw error;
      toast.success('Updated successfully.');
      resetForm();
      fetchAllData();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (table: string, id: string) => {
    if (!confirm('Permanent deletion. Proceed?')) return;
    try {
      const { error } = await supabase.from(table).delete().match({ id });
      if (error) throw error;
      toast.success('Removed.');
      fetchAllData();
    } catch (err: any) { toast.error(err.message); }
  };

  const handleTogglePin = async (table: 'projects' | 'timeline' | 'gallery', item: any) => {
    const pinFieldMap = {
      projects: 'highlight',
      timeline: 'title',
      gallery: 'caption'
    } as const;

    const field = pinFieldMap[table];
    const nextPinnedState = !isPinnedText(item[field]);
    const nextValue = setPinnedText(item[field], nextPinnedState);

    try {
      const { error } = await supabase
        .from(table)
        .update({ [field]: nextValue })
        .match({ id: item.id });

      if (error) throw error;
      toast.success(nextPinnedState ? 'Pinned to homepage.' : 'Removed from homepage.');
      fetchAllData();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleProfileUpdate = async () => {
    setFormLoading(true);
    try {
      let finalData: any = { name: profileForm.name, tagline: profileForm.tagline, bio: profileForm.bio, location: profileForm.location };
      if (profileForm.portrait) {
        finalData.portrait_url = await uploadFile(profileForm.portrait, 'project-images');
      }
      const { error } = await supabase.from('profile').update(finalData).match({ id: profile?.id });
      if (error) throw error;
      toast.success('Identity Updated.');
      fetchAllData();
    } catch (err: any) { toast.error(err.message); } finally { setFormLoading(false); }
  };

  const activeProject = projects.find((item) => item.id === editingProjectId);
  const activeGalleryItem = gallery.find((item) => item.id === editingGalleryId);
  const activeBlog = blogs.find((item) => item.id === editingBlogId);

  if (loading) return (
    <div className="h-screen w-full flex items-center justify-center bg-white">
      <Loader2 className="size-12 animate-spin text-primary opacity-50" />
    </div>
  );

  return (
    <div className="min-h-screen bg-white selection:bg-primary">
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b-8 border-primary py-6 px-6 md:px-12 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="bg-black text-primary px-4 py-1 font-black text-sm uppercase">AA ADMIN</div>
          <span className="text-[10px] font-bold uppercase text-muted-foreground hidden md:block italic">Master Level Control System</span>
        </div>
        <button onClick={handleLogout} className="text-xs font-black uppercase tracking-[0.2em] border-b-2 border-black pb-1 hover:text-primary transition-colors">
          EXIT EDITOR
        </button>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12 md:px-12 pb-48">
        <Tabs defaultValue="projects" className="space-y-16">
          <div className="overflow-x-auto hide-scrollbar -mx-6 px-6 border-b-2 border-border mb-12">
            <TabsList className="bg-transparent gap-10 border-none h-auto p-0 mb-0">
              {['projects', 'timeline', 'gallery', 'blog', 'skills', 'socials', 'identity'].map(tab => (
                <TabsTrigger 
                  key={tab} 
                  value={tab} 
                  className="data-[state=active]:text-black data-[state=active]:after:w-full relative after:absolute after:bottom-0 after:left-0 after:h-2 after:bg-primary after:w-0 after:transition-all after:duration-500 rounded-none bg-transparent p-0 pb-4 uppercase font-black text-xs tracking-widest text-black/40"
                >
                  {tab}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {/* PROJECTS */}
          <TabsContent value="projects" className="space-y-12 animate-in fade-in slide-in-from-bottom-2">
            <div className="flex items-center justify-between">
              <h2 className="text-4xl font-black uppercase tracking-tighter italic">Projects</h2>
              <Button
                onClick={() => (editingProjectId || isAdding) ? resetProjectEditor() : setIsAdding(true)}
                className="bg-black text-primary h-12 font-black uppercase"
              >
                {editingProjectId ? 'CANCEL EDIT' : isAdding ? 'CANCEL' : 'ADD NEW'}
              </Button>
            </div>
            {(isAdding || Boolean(editingProjectId)) && (
               <form
                 onSubmit={(e) => {
                   e.preventDefault();
                   if (editingProjectId) {
                     handleUpdate('projects', editingProjectId, projectForm, resetProjectEditor, projectForm.cover_image as File, 'project-images', activeProject);
                   } else {
                     handleCreate('projects', projectForm, resetProjectEditor, projectForm.cover_image as File, 'project-images');
                   }
                 }}
                 className="bg-primary p-12 border-4 border-black space-y-6"
               >
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <h3 className="text-xl font-black uppercase tracking-[0.2em] text-black">
                      {editingProjectId ? 'Edit Project' : 'Create Project'}
                    </h3>
                    {editingProjectId && (
                      <Button type="button" onClick={resetProjectEditor} variant="outline" className="border-2 border-black bg-white font-black uppercase">
                        Cancel Edit
                      </Button>
                    )}
                  </div>
                  <Input placeholder="Project Name" className="bg-white h-14" value={projectForm.title} onChange={e => setProjectForm({...projectForm, title: e.target.value})} />
                  <div className="grid md:grid-cols-2 gap-6">
                    <Input placeholder="Category (webapp, hackathon...)" className="bg-white text-black" value={projectForm.category} onChange={e => setProjectForm({...projectForm, category: e.target.value})} />
                    <Input placeholder="Year" className="bg-white text-black" value={projectForm.year} onChange={e => setProjectForm({...projectForm, year: e.target.value})} />
                  </div>
                  <Textarea placeholder="Description" className="bg-white min-h-[150px] text-black" value={projectForm.description} onChange={e => setProjectForm({...projectForm, description: e.target.value})} />
                  <Input
                    placeholder="Tech Stack (React, Supabase, Tailwind...)"
                    className="bg-white text-black"
                    value={projectForm.tech_stack}
                    onChange={e => setProjectForm({...projectForm, tech_stack: e.target.value})}
                  />
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="relative">
                      <ExternalLink className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-black/50 pointer-events-none" />
                      <Input
                        type="url"
                        placeholder="Project / Website Link (https://...)"
                        className="bg-white text-black pl-12"
                        value={projectForm.live_url}
                        onChange={e => setProjectForm({...projectForm, live_url: e.target.value})}
                      />
                    </div>
                    <div className="relative">
                      <Github className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-black/50 pointer-events-none" />
                      <Input
                        type="url"
                        placeholder="GitHub Link (https://github.com/...)"
                        className="bg-white text-black pl-12"
                        value={projectForm.github_url}
                        onChange={e => setProjectForm({...projectForm, github_url: e.target.value})}
                      />
                    </div>
                  </div>
                  {activeProject?.cover_image && editingProjectId && (
                    <div className="space-y-3">
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-black/60">Current Cover</p>
                      <img src={activeProject.cover_image} alt={activeProject.title} className="h-32 w-48 object-cover border-2 border-black bg-white" />
                    </div>
                  )}
                  <Input type="file" className="bg-white h-auto" onChange={e => setProjectForm({...projectForm, cover_image: e.target.files?.[0] || null})} />
                  <Button disabled={formLoading} className="w-full bg-black text-primary h-14 font-black">
                    {editingProjectId ? 'UPDATE PROJECT' : 'SHIP PROJECT'}
                  </Button>
               </form>
            )}
            <div className="grid gap-4">
              {projects.map(p => (
                <div key={p.id} className="p-4 border-4 border-black bg-white flex justify-between items-center group">
                  <div className="flex items-center gap-4">
                    <img src={p.cover_image} className="size-16 object-cover border-2 border-black" />
                    <div>
                      <div className="flex items-center gap-3">
                        <h4 className="font-black text-lg">{p.title}</h4>
                        {isPinnedText(p.highlight) && (
                          <span className="bg-primary px-2 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-black border border-black">
                            Pinned
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] text-muted-foreground uppercase font-black">{p.year}</span>
                        {p.live_url && (
                          <a
                            href={p.live_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-black/60 hover:text-black transition-colors"
                            aria-label={`Open ${p.title} live site`}
                          >
                            <ExternalLink className="size-4" />
                          </a>
                        )}
                        {p.github_url && (
                          <a
                            href={p.github_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-black/60 hover:text-black transition-colors"
                            aria-label={`Open ${p.title} GitHub repository`}
                          >
                            <Github className="size-4" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button onClick={() => startEditProject(p)} variant="ghost" className="text-black/50 hover:text-black">
                      <Pencil className="size-4" />
                    </Button>
                    <Button
                      onClick={() => handleTogglePin('projects', p)}
                      variant="ghost"
                      className={isPinnedText(p.highlight) ? 'text-primary' : 'text-black/40'}
                    >
                      <Star className={isPinnedText(p.highlight) ? 'fill-current' : ''} />
                    </Button>
                    <Button onClick={() => handleDelete('projects', p.id)} variant="ghost" className="text-destructive"><Trash2 /></Button>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* TIMELINE */}
          <TabsContent value="timeline" className="space-y-12 animate-in fade-in slide-in-from-bottom-2">
            <h2 className="text-4xl font-black uppercase tracking-tighter italic">The Journey</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (editingTimelineId) {
                  const existingTimeline = timeline.find((item) => item.id === editingTimelineId);
                  handleUpdate('timeline', editingTimelineId, timelineForm, resetTimelineEditor, undefined, undefined, existingTimeline);
                } else {
                  handleCreate('timeline', timelineForm, resetTimelineEditor);
                }
              }}
              className="bg-primary/5 p-8 border-4 border-black grid gap-6"
            >
               <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <h3 className="text-lg font-black uppercase tracking-[0.2em] text-black">
                    {editingTimelineId ? 'Edit Milestone' : 'Add Milestone'}
                  </h3>
                  {editingTimelineId && (
                    <Button type="button" onClick={resetTimelineEditor} variant="outline" className="border-2 border-black bg-white font-black uppercase">
                      Cancel Edit
                    </Button>
                  )}
               </div>
               <div className="grid md:grid-cols-2 gap-6">
                  <Input placeholder="Year (e.g. 2024)" className="bg-white" value={timelineForm.year} onChange={e => setTimelineForm({...timelineForm, year: e.target.value})} />
                  <Input placeholder="Milestone Title" className="bg-white" value={timelineForm.title} onChange={e => setTimelineForm({...timelineForm, title: e.target.value})} />
               </div>
               <Textarea placeholder="Short description" className="bg-white" value={timelineForm.description} onChange={e => setTimelineForm({...timelineForm, description: e.target.value})} />
               <Button className="bg-black text-primary font-black uppercase h-12">
                 {editingTimelineId ? 'UPDATE MILESTONE' : 'ADD MILESTONE'}
               </Button>
            </form>
            <div className="grid gap-4">
               {timeline.map(t => (
                  <div key={t.id} className="p-6 border-2 border-black flex justify-between items-center bg-white">
                     <div>
                       <span className="text-xs font-black text-primary">{t.year}</span>
                       <div className="flex items-center gap-3">
                         <h4 className="font-black text-xl">{stripPinnedMarker(t.title) || 'Untitled Milestone'}</h4>
                         {isPinnedText(t.title) && (
                           <span className="bg-primary px-2 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-black border border-black">
                             Pinned
                           </span>
                         )}
                       </div>
                     </div>
                     <div className="flex items-center gap-1">
                       <Button onClick={() => startEditTimeline(t)} variant="ghost" className="text-black/50 hover:text-black">
                         <Pencil className="size-4" />
                       </Button>
                       <Button
                         onClick={() => handleTogglePin('timeline', t)}
                         variant="ghost"
                         className={isPinnedText(t.title) ? 'text-primary' : 'text-black/40'}
                       >
                         <Star className={isPinnedText(t.title) ? 'fill-current' : ''} />
                       </Button>
                       <Button onClick={() => handleDelete('timeline', t.id)} variant="ghost"><Trash2 className="size-4" /></Button>
                     </div>
                  </div>
               ))}
            </div>
          </TabsContent>

          {/* GALLERY */}
          <TabsContent value="gallery" className="space-y-12 animate-in fade-in slide-in-from-bottom-2">
            <h2 className="text-4xl font-black uppercase tracking-tighter italic">Gallery Feed</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (editingGalleryId) {
                  handleUpdate('gallery', editingGalleryId, galleryForm, resetGalleryEditor, galleryForm.image as File, 'project-images', activeGalleryItem);
                } else {
                  handleCreate('gallery', galleryForm, resetGalleryEditor, galleryForm.image as File, 'project-images');
                }
              }}
              className="bg-primary p-12 border-4 border-black space-y-6"
            >
               <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <h3 className="text-lg font-black uppercase tracking-[0.2em] text-black">
                    {editingGalleryId ? 'Edit Moment' : 'Post Moment'}
                  </h3>
                  {editingGalleryId && (
                    <Button type="button" onClick={resetGalleryEditor} variant="outline" className="border-2 border-black bg-white font-black uppercase">
                      Cancel Edit
                    </Button>
                  )}
               </div>
               <Input placeholder="Moment Caption" className="bg-white" value={galleryForm.caption} onChange={e => setGalleryForm({...galleryForm, caption: e.target.value})} />
               {activeGalleryItem?.image_url && editingGalleryId && (
                 <img src={activeGalleryItem.image_url} alt={activeGalleryItem.caption || 'Gallery item'} className="h-32 w-32 object-cover border-2 border-black bg-white" />
               )}
               <Input type="file" className="bg-white h-auto" onChange={e => setGalleryForm({...galleryForm, image: e.target.files?.[0] || null})} />
               <Button disabled={formLoading} className="w-full bg-black text-primary font-black uppercase h-14">
                 {editingGalleryId ? 'UPDATE MOMENT' : 'POST TO GALLERY'}
               </Button>
            </form>
            <div className="grid md:grid-cols-3 gap-6">
              {gallery.map(g => (
                <div key={g.id} className="relative aspect-square border-4 border-black group overflow-hidden bg-white">
                  {isPinnedText(g.caption) && (
                    <div className="absolute left-4 top-4 z-10 bg-primary px-3 py-1 text-[10px] font-black uppercase tracking-[0.25em] text-black border-2 border-black">
                      Pinned
                    </div>
                  )}
                  <img src={g.image_url} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all" />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                    <Button onClick={() => startEditGallery(g)} variant="ghost" className="text-white">
                      <Pencil className="size-4" />
                    </Button>
                    <Button
                      onClick={() => handleTogglePin('gallery', g)}
                      variant="ghost"
                      className={isPinnedText(g.caption) ? 'text-primary' : 'text-white'}
                    >
                      <Star className={isPinnedText(g.caption) ? 'fill-current' : ''} />
                    </Button>
                    <Button onClick={() => handleDelete('gallery', g.id)} variant="ghost" className="text-primary"><Trash2 /></Button>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* BLOG */}
          <TabsContent value="blog" className="space-y-12 animate-in fade-in slide-in-from-bottom-2">
            <h2 className="text-4xl font-black uppercase tracking-tighter italic">Blog Engine</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (editingBlogId) {
                  handleUpdate('blog', editingBlogId, blogForm, resetBlogEditor, blogForm.cover_image as File, 'project-images', activeBlog);
                } else {
                  handleCreate('blog', blogForm, resetBlogEditor, blogForm.cover_image as File, 'project-images');
                }
              }}
              className="bg-primary/5 p-12 border-4 border-black space-y-6"
            >
               <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <h3 className="text-lg font-black uppercase tracking-[0.2em] text-black">
                    {editingBlogId ? 'Edit Article' : 'Create Article'}
                  </h3>
                  {editingBlogId && (
                    <Button type="button" onClick={resetBlogEditor} variant="outline" className="border-2 border-black bg-white font-black uppercase">
                      Cancel Edit
                    </Button>
                  )}
               </div>
               <Input placeholder="Article Title" className="bg-white text-xl font-black uppercase" value={blogForm.title} onChange={e => setBlogForm({...blogForm, title: e.target.value})} />
               <Input placeholder="Short Excerpt" className="bg-white font-bold" value={blogForm.excerpt} onChange={e => setBlogForm({...blogForm, excerpt: e.target.value})} />
               <Textarea placeholder="Article Content (Markdown supported)" className="bg-white min-h-[300px]" value={blogForm.content} onChange={e => setBlogForm({...blogForm, content: e.target.value})} />
               {activeBlog?.cover_image && editingBlogId && (
                 <img src={activeBlog.cover_image} alt={activeBlog.title} className="h-32 w-48 object-cover border-2 border-black bg-white" />
               )}
               <Input type="file" className="bg-white h-auto" onChange={e => setBlogForm({...blogForm, cover_image: e.target.files?.[0] || null})} />
               <Button disabled={formLoading} className="w-full bg-black text-primary font-black h-16 uppercase">
                 {editingBlogId ? 'UPDATE ARTICLE' : 'PUBLISH ARTICLE'}
               </Button>
            </form>
            <div className="grid gap-4">
               {blogs.map(b => (
                  <div key={b.id} className="p-6 border-2 border-black flex justify-between items-center bg-white group">
                     <div className="flex gap-4 items-center">
                        <div className="bg-black text-primary p-2"><BookOpen className="size-5" /></div>
                        <h4 className="font-black text-lg group-hover:text-primary transition-colors">{b.title}</h4>
                     </div>
                     <div className="flex items-center gap-1">
                       <Button onClick={() => startEditBlog(b)} variant="ghost" className="text-black/50 hover:text-black">
                         <Pencil className="size-4" />
                       </Button>
                       <Button onClick={() => handleDelete('blog', b.id)} variant="ghost"><Trash2 className="size-4 text-muted-foreground hover:text-destructive" /></Button>
                     </div>
                  </div>
               ))}
            </div>
          </TabsContent>

          {/* SKILLS */}
          <TabsContent value="skills" className="space-y-12 animate-in fade-in slide-in-from-bottom-2">
            <h2 className="text-4xl font-black uppercase tracking-tighter italic">Stack Power</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (editingSkillId) {
                  const existingSkill = skills.find((item) => item.id === editingSkillId);
                  handleUpdate('skills', editingSkillId, skillForm, resetSkillEditor, undefined, undefined, existingSkill);
                } else {
                  handleCreate('skills', skillForm, resetSkillEditor);
                }
              }}
              className="bg-primary p-8 border-4 border-black flex flex-col md:flex-row gap-6"
            >
               <Input placeholder="Skill Name (e.g. Next.js)" className="bg-white" value={skillForm.name} onChange={e => setSkillForm({...skillForm, name: e.target.value})} />
               <select className="bg-white border-2 border-black px-4 font-black uppercase text-xs" value={skillForm.category} onChange={e => setSkillForm({...skillForm, category: e.target.value})}>
                 <option value="technical">Technical</option>
                 <option value="design">Design</option>
                 <option value="tools">Tools</option>
               </select>
               <Button className="bg-black text-primary font-black h-12 px-12 uppercase">
                 {editingSkillId ? 'UPDATE SKILL' : 'ADD SKILL'}
               </Button>
               {editingSkillId && (
                 <Button type="button" onClick={resetSkillEditor} variant="outline" className="border-2 border-black bg-white font-black uppercase h-12 px-8">
                   Cancel
                 </Button>
               )}
            </form>
            <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
              {skills.map(s => (
                <div key={s.id} className="p-4 border-2 border-black flex justify-between items-center bg-white hover:bg-primary transition-all group">
                   <div className="flex items-center gap-3"><Star className="size-4" /><span className="font-black uppercase text-xs">{s.name}</span></div>
                   <div className="flex items-center">
                     <Button onClick={() => startEditSkill(s)} variant="ghost" className="size-8 p-0 opacity-0 group-hover:opacity-100 text-black/60">
                       <Pencil className="size-4" />
                     </Button>
                     <Button onClick={() => handleDelete('skills', s.id)} variant="ghost" className="size-8 p-0 opacity-0 group-hover:opacity-100"><Trash2 className="size-4" /></Button>
                   </div>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* SOCIALS */}
          <TabsContent value="socials" className="space-y-12 animate-in fade-in slide-in-from-bottom-2">
            <h2 className="text-4xl font-black uppercase tracking-tighter italic">Live Channels</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (editingSocialId) {
                  const existingSocial = socials.find((item) => item.id === editingSocialId);
                  handleUpdate('socials', editingSocialId, socialForm, resetSocialEditor, undefined, undefined, existingSocial);
                } else {
                  handleCreate('socials', socialForm, resetSocialEditor);
                }
              }}
              className="bg-primary p-12 border-4 border-black flex flex-col md:flex-row gap-6"
            >
               <Input placeholder="Platform Name (GitHub, Email...)" className="bg-white" value={socialForm.platform} onChange={e => setSocialForm({...socialForm, platform: e.target.value})} />
               <Input placeholder="https://... or mailto:..." className="bg-white" value={socialForm.url} onChange={e => setSocialForm({...socialForm, url: e.target.value})} />
               <Button className="bg-black text-primary font-black uppercase h-14 px-12">
                 {editingSocialId ? 'UPDATE CHANNEL' : 'SAVE CHANNEL'}
               </Button>
               {editingSocialId && (
                 <Button type="button" onClick={resetSocialEditor} variant="outline" className="border-2 border-black bg-white font-black uppercase h-14 px-8">
                   Cancel
                 </Button>
               )}
            </form>
            <div className="grid md:grid-cols-2 gap-4">
              {socials.map(s => (
                <div key={s.id} className="p-6 border-2 border-black flex justify-between items-center bg-white hover:border-primary transition-colors">
                  <div className="flex items-center gap-4 text-black">
                    <Share2 className="size-5" />
                    <div className="space-y-1">
                      <span className="block font-black uppercase tracking-widest text-xs">{s.platform}</span>
                      <span className="block text-[10px] text-black/50">{s.url}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button onClick={() => startEditSocial(s)} variant="ghost" className="text-black/50 hover:text-black">
                      <Pencil className="size-4" />
                    </Button>
                    <Button onClick={() => handleDelete('socials', s.id)} variant="ghost"><Trash2 className="size-4" /></Button>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* IDENTITY */}
          <TabsContent value="identity" className="space-y-12 animate-in fade-in slide-in-from-bottom-2">
            <h2 className="text-4xl font-black uppercase tracking-tighter italic">The Builder Brand</h2>
            <div className="bg-primary/5 p-12 border-4 border-black space-y-10 max-w-4xl">
               <div className="grid md:grid-cols-2 gap-10">
                  <div className="space-y-4">
                    <Label className="font-black uppercase text-[10px]">Real Name</Label>
                    <Input value={profileForm.name} onChange={e => setProfileForm({...profileForm, name: e.target.value})} className="bg-white h-14" />
                  </div>
                  <div className="space-y-4">
                    <Label className="font-black uppercase text-[10px]">Origin/Location</Label>
                    <Input value={profileForm.location} onChange={e => setProfileForm({...profileForm, location: e.target.value})} className="bg-white h-14" />
                  </div>
               </div>
               <div className="space-y-4">
                  <Label className="font-black uppercase text-[10px]">Brand Tagline</Label>
                  <Input value={profileForm.tagline} onChange={e => setProfileForm({...profileForm, tagline: e.target.value})} className="bg-white h-16 text-2xl font-black italic uppercase" />
               </div>
               <div className="space-y-4">
                  <Label className="font-black uppercase text-[10px]">Full Mission (Bio)</Label>
                  <Textarea value={profileForm.bio} onChange={e => setProfileForm({...profileForm, bio: e.target.value})} className="bg-white min-h-[250px] text-lg font-medium" />
               </div>
               <div className="space-y-4">
                  <Label className="font-black uppercase text-[10px]">Profile Portrait</Label>
                  <Input type="file" className="bg-white h-auto" onChange={e => setProfileForm({...profileForm, portrait: e.target.files?.[0] || null})} />
               </div>
               <Button onClick={handleProfileUpdate} disabled={formLoading} className="w-full h-20 bg-black text-primary font-black uppercase shadow-[10px_10px_0px_rgba(255,214,0,1)] hover:shadow-none transition-all">
                  {formLoading ? 'EVOLVING...' : 'UPDATE IDENTITY'}
               </Button>
            </div>
          </TabsContent>

        </Tabs>
      </main>
    </div>
  );
}
