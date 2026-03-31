import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Lock, Mail, Loader2 } from 'lucide-react';

/**
 * Admin Login Page - Minimalist & Secure
 * Restricted to your admin credentials (no sign up)
 */
export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      toast.success('Access Granted — Welcome back, Ruler.');
      navigate('/admin/dashboard');
    } catch (error: any) {
      toast.error(error.message || 'Access Denied — Invalid credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-6">
      <motion.div 
        className="max-w-md w-full space-y-8 p-12 border border-border bg-accent/5 rounded-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="text-center space-y-2">
          <div className="mx-auto size-12 flex items-center justify-center rounded-full bg-primary/10 mb-4">
            <Lock className="size-6 text-primary" />
          </div>
          <h1 className="text-3xl font-light tracking-widest uppercase">Admin Access</h1>
          <p className="text-muted-foreground font-light text-sm">Portfolio Management Gateway</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-xs font-light tracking-widest uppercase text-muted-foreground">Master Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="yours@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="pl-10 font-light rounded-sm"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-xs font-light tracking-widest uppercase text-muted-foreground">Passphrase</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="pl-10 font-light rounded-sm"
              />
            </div>
          </div>

          <Button 
            type="submit" 
            disabled={loading}
            className="w-full py-6 font-light tracking-widest uppercase"
          >
            {loading ? <Loader2 className="size-4 animate-spin" /> : 'AUTHENTICATE'}
          </Button>
        </form>
      </motion.div>
    </div>
  );
}
