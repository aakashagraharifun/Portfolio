import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Plus, Trash2, LogOut, Loader2, Image as ImageIcon, ExternalLink, Github, Code2, Trophy } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

/**
 * Admin Dashboard - CMS for Portfolio
 * Manage projects, upload cover images, and edit project details
 */
export default function AdminDashboard() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const navigate = useNavigate();

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    category: 'hackathon',
    year: new Date().getFullYear().toString(),
    description: '',
    client: '',
    location: '',
    live_url: '',
    github_url: '',
    tech_stack: '',
    highlight: '',
    cover_image: null as File | null
  });

  useEffect(() => {
    checkUser();
    fetchProjects();
  }, []);

  async function checkUser() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) navigate('/admin');
  }

  async function fetchProjects() {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProjects(data || []);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/admin');
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);

    try {
      let coverImageUrl = '';

      // 1. Upload Cover Image if exists
      if (formData.cover_image) {
        const file = formData.cover_image;
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('project-images')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('project-images')
          .getPublicUrl(filePath);

        coverImageUrl = publicUrl;
      }

      // 2. Insert Project into DB
      const { error } = await supabase.from('projects').insert([{
        title: formData.title,
        slug: formData.slug || formData.title.toLowerCase().replace(/\s+/g, '-'),
        category: formData.category,
        year: formData.year,
        description: formData.description,
        client: formData.client,
        location: formData.location,
        live_url: formData.live_url,
        github_url: formData.github_url,
        tech_stack: formData.tech_stack.split(',').map(s => s.trim()),
        highlight: formData.highlight,
        cover_image: coverImageUrl
      }]);

      if (error) throw error;

      toast.success('Project Shipped — Legend Status Updated.');
      setIsAdding(false);
      setFormData({
        title: '', slug: '', category: 'hackathon', year: '2026',
        description: '', client: '', location: '', live_url: '',
        github_url: '', tech_stack: '', highlight: '', cover_image: null
      });
      fetchProjects();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you certain? This action is irreversible.')) return;
    
    try {
      const { error } = await supabase.from('projects').delete().match({ id });
      if (error) throw error;
      toast.success('Project Deleted — Archives Updated.');
      fetchProjects();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-background relative selection:bg-primary/20">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border px-6 lg:px-8 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Trophy className="size-5 text-primary" />
            <h1 className="text-xl font-light tracking-widest uppercase">Admin Dashboard</h1>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors uppercase tracking-widest"
          >
            <LogOut className="size-4" />
            Sign Out
          </button>
        </div>
      </header>

      <main className="pt-24 pb-20 px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Actions */}
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-3xl font-light tracking-wide uppercase">Your Archive</h2>
          <Button onClick={() => setIsAdding(!isAdding)} className="rounded-sm">
            {isAdding ? 'Cancel' : <><Plus className="mr-2" /> New Entry</>}
          </Button>
        </div>

        {/* Add Project Form */}
        <AnimatePresence>
          {isAdding && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden mb-12"
            >
              <form onSubmit={handleCreateProject} className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8 border border-primary/20 bg-accent/5 rounded-sm">
                <div className="space-y-4">
                  <div>
                    <Label className="text-xs uppercase tracking-widest text-muted-foreground">Title</Label>
                    <Input 
                      placeholder="e.g. CrewSpace AI" 
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      required 
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-xs uppercase tracking-widest text-muted-foreground">Category</Label>
                      <Select defaultValue="hackathon" onValueChange={(val) => setFormData({...formData, category: val})}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent className="z-[100] bg-popover">
                          <SelectItem value="hackathon">Hackathon</SelectItem>
                          <SelectItem value="webapp">Web App</SelectItem>
                          <SelectItem value="startup">Startup</SelectItem>
                          <SelectItem value="business">Business</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-xs uppercase tracking-widest text-muted-foreground">Year</Label>
                      <Input 
                        placeholder="2026" 
                        value={formData.year}
                        onChange={(e) => setFormData({...formData, year: e.target.value})}
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs uppercase tracking-widest text-muted-foreground">Tech Stack (comma separated)</Label>
                    <Input 
                      placeholder="React, AI, Python" 
                      value={formData.tech_stack}
                      onChange={(e) => setFormData({...formData, tech_stack: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label className="text-xs uppercase tracking-widest text-muted-foreground">Cover Image</Label>
                    <div className="flex items-center gap-4 p-4 border border-dashed rounded-sm group hover:border-primary/50 transition-colors cursor-pointer relative overflow-hidden">
                      <ImageIcon className="size-6 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground font-light">
                        {formData.cover_image ? formData.cover_image.name : 'Upload hi-res image'}
                      </span>
                      <input 
                        type="file" 
                        className="absolute inset-0 opacity-0 cursor-pointer" 
                        onChange={(e) => setFormData({...formData, cover_image: e.target.files ? e.target.files[0] : null})}
                        accept="image/*"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label className="text-xs uppercase tracking-widest text-muted-foreground">Description</Label>
                    <Textarea 
                      placeholder="The story behind the build..." 
                      className="min-h-32" 
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-xs uppercase tracking-widest text-muted-foreground">Live URL</Label>
                      <Input 
                        placeholder="https://..." 
                        value={formData.live_url}
                        onChange={(e) => setFormData({...formData, live_url: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label className="text-xs uppercase tracking-widest text-muted-foreground">GitHub URL</Label>
                      <Input 
                        placeholder="https://github.com/..." 
                        value={formData.github_url}
                        onChange={(e) => setFormData({...formData, github_url: e.target.value})}
                      />
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs uppercase tracking-widest text-muted-foreground">Highlight Badge</Label>
                    <Input 
                      placeholder="e.g. 🥇 1st Place Winner" 
                      value={formData.highlight}
                      onChange={(e) => setFormData({...formData, highlight: e.target.value})}
                    />
                  </div>
                  <Button type="submit" disabled={formLoading} className="w-full h-12 uppercase tracking-widest">
                    {formLoading ? <Loader2 className="size-4 animate-spin mr-2" /> : 'Publish Entry'}
                  </Button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Existing Projects List */}
        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="size-12 animate-spin text-muted-foreground opacity-20" /></div>
        ) : (
          <div className="grid gap-6">
            {projects.map((project) => (
              <motion.div 
                key={project.id}
                layout
                className="group flex flex-col md:flex-row items-center gap-6 p-6 border border-border hover:border-primary/30 transition-all rounded-sm bg-accent/5 backdrop-blur-sm"
              >
                <div className="size-32 rounded-sm overflow-hidden bg-accent shrink-0 border border-border">
                  {project.cover_image ? (
                    <img src={project.cover_image} alt="" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center"><ImageIcon className="size-8 text-muted-foreground/30" /></div>
                  )}
                </div>
                
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="text-xs uppercase tracking-widest text-primary/70">{project.category} — {project.year}</span>
                    {project.highlight && <span className="text-[10px] uppercase tracking-tighter px-2 py-0.5 bg-primary/20 text-primary rounded-full">{project.highlight}</span>}
                  </div>
                  <h3 className="text-2xl font-light tracking-wide">{project.title}</h3>
                  <p className="text-muted-foreground text-sm line-clamp-1 font-light">{project.description}</p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-muted-foreground pr-4 border-r border-border">
                    {project.github_url && <Github className="size-4 hover:text-foreground cursor-pointer" />}
                    {project.live_url && <ExternalLink className="size-4 hover:text-foreground cursor-pointer" />}
                    {project.tech_stack && project.tech_stack.length > 0 && <Code2 className="size-4 text-primary/50" />}
                  </div>
                  <button 
                    onClick={() => handleDelete(project.id)}
                    className="p-3 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full transition-all"
                  >
                    <Trash2 className="size-5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
