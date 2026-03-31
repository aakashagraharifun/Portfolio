import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { 
  Plus, Trash2, LogOut, Loader2, Image as ImageIcon, ExternalLink, 
  Github, Code2, Trophy, Rocket, GraduationCap, Briefcase, 
  Sparkles, History, Send, Camera, BookOpen, Layers, Share2, User, Star
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const navigate = useNavigate();

  // Data Store
  const [projects, setProjects] = useState<any[]>([]);
  const [timeline, setTimeline] = useState<any[]>([]);
  const [gallery, setGallery] = useState<any[]>([]);
  const [blogs, setBlogs] = useState<any[]>([]);
  const [skills, setSkills] = useState<any[]>([]);
  const [socials, setSocials] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>(null);

  // Form States
  const [projectForm, setProjectForm] = useState({ title: '', category: 'webapp', year: '2026', description: '', tech_stack: '', live_url: '', github_url: '', cover_image: null as File | null });
  const [timelineForm, setTimelineForm] = useState({ year: '2026', title: '', description: '', icon_type: 'sparkles' });
  const [galleryForm, setGalleryForm] = useState({ caption: '', image: null as File | null });
  const [blogForm, setBlogForm] = useState({ title: '', excerpt: '', content: '', cover_image: null as File | null });
  const [skillForm, setSkillForm] = useState({ name: '', category: 'technical' });
  const [socialForm, setSocialForm] = useState({ platform: '', url: '' });
  const [profileForm, setProfileForm] = useState({ name: '', tagline: 'FULL STACK BUILDER.', bio: '', location: 'INDIA', portrait: null as File | null });

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
      let finalData = { ...data };
      if (file && bucket) {
        const url = await uploadFile(file, bucket);
        if (table === 'gallery') finalData.image_url = url;
        else finalData.cover_image = url;
      }
      if (table === 'projects' && data.tech_stack && typeof data.tech_stack === 'string') finalData.tech_stack = data.tech_stack.split(',').map((s: string) => s.trim());
      if (table === 'blog') finalData.slug = data.title.toLowerCase().replace(/\s+/g, '-');

      const { error } = await supabase.from(table).insert([finalData]);
      if (error) throw error;
      toast.success('Successfully Added.');
      setIsAdding(false);
      resetForm();
      fetchAllData();
    } catch (err: any) { toast.error(err.message); } finally { setFormLoading(false); }
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
              <Button onClick={() => setIsAdding(!isAdding)} className="bg-black text-primary h-12 font-black uppercase">
                {isAdding ? 'CANCEL' : 'ADD NEW'}
              </Button>
            </div>
            {isAdding && (
               <form onSubmit={(e) => { e.preventDefault(); handleCreate('projects', projectForm, () => setProjectForm({ title: '', category: 'webapp', year: '2026', description: '', tech_stack: '', live_url: '', github_url: '', cover_image: null }), projectForm.cover_image as File, 'project-images') }} className="bg-primary p-12 border-4 border-black space-y-6">
                  <Input placeholder="Project Name" className="bg-white h-14" value={projectForm.title} onChange={e => setProjectForm({...projectForm, title: e.target.value})} />
                  <div className="grid md:grid-cols-2 gap-6">
                    <Input placeholder="Category (webapp, hackathon...)" className="bg-white text-black" value={projectForm.category} onChange={e => setProjectForm({...projectForm, category: e.target.value})} />
                    <Input placeholder="Year" className="bg-white text-black" value={projectForm.year} onChange={e => setProjectForm({...projectForm, year: e.target.value})} />
                  </div>
                  <Textarea placeholder="Description" className="bg-white min-h-[150px] text-black" value={projectForm.description} onChange={e => setProjectForm({...projectForm, description: e.target.value})} />
                  <Input type="file" className="bg-white h-auto" onChange={e => setProjectForm({...projectForm, cover_image: e.target.files?.[0] || null})} />
                  <Button disabled={formLoading} className="w-full bg-black text-primary h-14 font-black">SHIP PROJECT</Button>
               </form>
            )}
            <div className="grid gap-4">
              {projects.map(p => (
                <div key={p.id} className="p-4 border-4 border-black bg-white flex justify-between items-center group">
                  <div className="flex items-center gap-4">
                    <img src={p.cover_image} className="size-16 object-cover border-2 border-black" />
                    <div><h4 className="font-black text-lg">{p.title}</h4><span className="text-[10px] text-muted-foreground uppercase font-black">{p.year}</span></div>
                  </div>
                  <Button onClick={() => handleDelete('projects', p.id)} variant="ghost" className="text-destructive"><Trash2 /></Button>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* TIMELINE */}
          <TabsContent value="timeline" className="space-y-12 animate-in fade-in slide-in-from-bottom-2">
            <h2 className="text-4xl font-black uppercase tracking-tighter italic">The Journey</h2>
            <form onSubmit={(e) => { e.preventDefault(); handleCreate('timeline', timelineForm, () => setTimelineForm({ year: '2026', title: '', description: '', icon_type: 'gap' })) }} className="bg-primary/5 p-8 border-4 border-black grid gap-6">
               <div className="grid md:grid-cols-2 gap-6">
                  <Input placeholder="Year (e.g. 2024)" className="bg-white" value={timelineForm.year} onChange={e => setTimelineForm({...timelineForm, year: e.target.value})} />
                  <Input placeholder="Milestone Title" className="bg-white" value={timelineForm.title} onChange={e => setTimelineForm({...timelineForm, title: e.target.value})} />
               </div>
               <Textarea placeholder="Short description" className="bg-white" value={timelineForm.description} onChange={e => setTimelineForm({...timelineForm, description: e.target.value})} />
               <Button className="bg-black text-primary font-black uppercase h-12">ADD MILESTONE</Button>
            </form>
            <div className="grid gap-4">
               {timeline.map(t => (
                  <div key={t.id} className="p-6 border-2 border-black flex justify-between items-center bg-white">
                     <div><span className="text-xs font-black text-primary">{t.year}</span><h4 className="font-black text-xl">{t.title}</h4></div>
                     <Button onClick={() => handleDelete('timeline', t.id)} variant="ghost"><Trash2 className="size-4" /></Button>
                  </div>
               ))}
            </div>
          </TabsContent>

          {/* GALLERY */}
          <TabsContent value="gallery" className="space-y-12 animate-in fade-in slide-in-from-bottom-2">
            <h2 className="text-4xl font-black uppercase tracking-tighter italic">Gallery Feed</h2>
            <form onSubmit={(e) => { e.preventDefault(); handleCreate('gallery', galleryForm, () => setGalleryForm({ caption: '', image: null }), galleryForm.image as File, 'project-images') }} className="bg-primary p-12 border-4 border-black space-y-6">
               <Input placeholder="Moment Caption" className="bg-white" value={galleryForm.caption} onChange={e => setGalleryForm({...galleryForm, caption: e.target.value})} />
               <Input type="file" className="bg-white h-auto" onChange={e => setGalleryForm({...galleryForm, image: e.target.files?.[0] || null})} />
               <Button disabled={formLoading} className="w-full bg-black text-primary font-black uppercase h-14">POST TO GALLERY</Button>
            </form>
            <div className="grid md:grid-cols-3 gap-6">
              {gallery.map(g => (
                <div key={g.id} className="relative aspect-square border-4 border-black group overflow-hidden bg-white">
                  <img src={g.image_url} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all" />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button onClick={() => handleDelete('gallery', g.id)} variant="ghost" className="text-primary"><Trash2 /></Button>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* BLOG */}
          <TabsContent value="blog" className="space-y-12 animate-in fade-in slide-in-from-bottom-2">
            <h2 className="text-4xl font-black uppercase tracking-tighter italic">Blog Engine</h2>
            <form onSubmit={(e) => { e.preventDefault(); handleCreate('blog', blogForm, () => setBlogForm({ title: '', excerpt: '', content: '', cover_image: null }), blogForm.cover_image as File, 'project-images') }} className="bg-primary/5 p-12 border-4 border-black space-y-6">
               <Input placeholder="Article Title" className="bg-white text-xl font-black uppercase" value={blogForm.title} onChange={e => setBlogForm({...blogForm, title: e.target.value})} />
               <Input placeholder="Short Excerpt" className="bg-white font-bold" value={blogForm.excerpt} onChange={e => setBlogForm({...blogForm, excerpt: e.target.value})} />
               <Textarea placeholder="Article Content (Markdown supported)" className="bg-white min-h-[300px]" value={blogForm.content} onChange={e => setBlogForm({...blogForm, content: e.target.value})} />
               <Input type="file" className="bg-white h-auto" onChange={e => setBlogForm({...blogForm, cover_image: e.target.files?.[0] || null})} />
               <Button disabled={formLoading} className="w-full bg-black text-primary font-black h-16 uppercase">PUBLISH ARTICLE</Button>
            </form>
            <div className="grid gap-4">
               {blogs.map(b => (
                  <div key={b.id} className="p-6 border-2 border-black flex justify-between items-center bg-white group">
                     <div className="flex gap-4 items-center">
                        <div className="bg-black text-primary p-2"><BookOpen className="size-5" /></div>
                        <h4 className="font-black text-lg group-hover:text-primary transition-colors">{b.title}</h4>
                     </div>
                     <Button onClick={() => handleDelete('blog', b.id)} variant="ghost"><Trash2 className="size-4 text-muted-foreground hover:text-destructive" /></Button>
                  </div>
               ))}
            </div>
          </TabsContent>

          {/* SKILLS */}
          <TabsContent value="skills" className="space-y-12 animate-in fade-in slide-in-from-bottom-2">
            <h2 className="text-4xl font-black uppercase tracking-tighter italic">Stack Power</h2>
            <form onSubmit={(e) => { e.preventDefault(); handleCreate('skills', skillForm, () => setSkillForm({ name: '', category: 'technical' })) }} className="bg-primary p-8 border-4 border-black flex flex-col md:flex-row gap-6">
               <Input placeholder="Skill Name (e.g. Next.js)" className="bg-white" value={skillForm.name} onChange={e => setSkillForm({...skillForm, name: e.target.value})} />
               <select className="bg-white border-2 border-black px-4 font-black uppercase text-xs" value={skillForm.category} onChange={e => setSkillForm({...skillForm, category: e.target.value})}>
                 <option value="technical">Technical</option>
                 <option value="design">Design</option>
                 <option value="tools">Tools</option>
               </select>
               <Button className="bg-black text-primary font-black h-12 px-12 uppercase">ADD SKILL</Button>
            </form>
            <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
              {skills.map(s => (
                <div key={s.id} className="p-4 border-2 border-black flex justify-between items-center bg-white hover:bg-primary transition-all group">
                   <div className="flex items-center gap-3"><Star className="size-4" /><span className="font-black uppercase text-xs">{s.name}</span></div>
                   <Button onClick={() => handleDelete('skills', s.id)} variant="ghost" className="size-8 p-0 opacity-0 group-hover:opacity-100"><Trash2 className="size-4" /></Button>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* SOCIALS */}
          <TabsContent value="socials" className="space-y-12 animate-in fade-in slide-in-from-bottom-2">
            <h2 className="text-4xl font-black uppercase tracking-tighter italic">Live Channels</h2>
            <form onSubmit={(e) => { e.preventDefault(); handleCreate('socials', socialForm, () => setSocialForm({ platform: '', url: '' })) }} className="bg-primary p-12 border-4 border-black flex flex-col md:flex-row gap-6">
               <Input placeholder="Platform Name (GitHub, Email...)" className="bg-white" value={socialForm.platform} onChange={e => setSocialForm({...socialForm, platform: e.target.value})} />
               <Input placeholder="https://... or mailto:..." className="bg-white" value={socialForm.url} onChange={e => setSocialForm({...socialForm, url: e.target.value})} />
               <Button className="bg-black text-primary font-black uppercase h-14 px-12">SAVE CHANNEL</Button>
            </form>
            <div className="grid md:grid-cols-2 gap-4">
              {socials.map(s => (
                <div key={s.id} className="p-6 border-2 border-black flex justify-between items-center bg-white hover:border-primary transition-colors">
                  <div className="flex items-center gap-4 text-black"><Share2 className="size-5" /><span className="font-black uppercase tracking-widest text-xs">{s.platform}</span></div>
                  <Button onClick={() => handleDelete('socials', s.id)} variant="ghost"><Trash2 className="size-4" /></Button>
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
