import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, CheckCircle2, Send, Sparkles, AlertCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';

// Validation schema
const contactFormSchema = z.object({
  name: z.string().trim().min(2, { message: 'NAME REQUIRED' }),
  email: z.string().trim().email({ message: 'VALID EMAIL REQUIRED' }),
  projectType: z.enum(['collaboration', 'freelance', 'startup', 'other'], {
    required_error: 'MISSION TYPE REQUIRED',
  }),
  message: z.string().trim().min(10, { message: 'TELL ME THE STORY (min 10 chars)' }),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: '',
      email: '',
      projectType: undefined,
      message: '',
    },
  });

  const onSubmit = async (data: ContactFormValues) => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('messages').insert([{
        name: data.name,
        email: data.email,
        project_type: data.projectType,
        message: data.message,
        status: 'unread'
      }]);

      if (error) throw error;

      setIsSuccess(true);
      form.reset();
      setTimeout(() => setIsSuccess(false), 8000);
    } catch (error: any) {
      form.setError('root', { message: 'TRANSMISSION FAILED. TRY AGAIN.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative">
      <AnimatePresence mode="wait">
        {isSuccess ? (
          <motion.div
            key="success"
            className="bg-primary border-4 border-black p-12 text-center space-y-6 shadow-[16px_16px_0px_black]"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -20 }}
          >
            <div className="size-20 bg-black rounded-full mx-auto flex items-center justify-center">
              <CheckCircle2 className="size-10 text-primary" />
            </div>
            <div className="space-y-2">
              <h3 className="text-4xl font-black uppercase tracking-tighter italic leading-none">
                MISSION <br />LOGGED.
              </h3>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60">
                TRANSITIONING TO RESPONSE PHASE...
              </p>
            </div>
            <Button 
              onClick={() => setIsSuccess(false)}
              className="bg-black text-primary font-black uppercase tracking-widest h-12"
            >
              SEND ANOTHER
            </Button>
          </motion.div>
        ) : (
          <motion.div
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Name Field */}
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel className="text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-2">
                          NAME
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="YOUR NAME"
                            className="bg-white border-4 border-black h-16 font-black uppercase tracking-tighter text-xl focus-visible:ring-primary rounded-none shadow-[8px_8px_0px_black]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-[10px] font-black uppercase italic" />
                      </FormItem>
                    )}
                  />

                  {/* Email Field */}
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel className="text-[10px] font-black uppercase tracking-[0.3em]">
                          E-MAIL
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="EMAIL@DOMAIN.COM"
                            className="bg-white border-4 border-black h-16 font-black uppercase tracking-tighter text-xl focus-visible:ring-primary rounded-none shadow-[8px_8px_0px_black]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-[10px] font-black uppercase italic" />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Project Type Select */}
                <FormField
                  control={form.control}
                  name="projectType"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel className="text-[10px] font-black uppercase tracking-[0.3em]">
                        MISSION_CATEGORY
                      </FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-white border-4 border-black h-16 font-black uppercase tracking-tighter text-xl focus:ring-primary rounded-none shadow-[8px_8px_0px_black]">
                            <SelectValue placeholder="SELECT TYPE" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-white border-4 border-black rounded-none">
                          <SelectItem value="collaboration" className="font-black uppercase tracking-widest text-xs py-3 focus:bg-primary">
                            COLLABORATION
                          </SelectItem>
                          <SelectItem value="freelance" className="font-black uppercase tracking-widest text-xs py-3 focus:bg-primary">
                            FREELANCE
                          </SelectItem>
                          <SelectItem value="startup" className="font-black uppercase tracking-widest text-xs py-3 focus:bg-primary">
                            STARTUP
                          </SelectItem>
                          <SelectItem value="other" className="font-black uppercase tracking-widest text-xs py-3 focus:bg-primary">
                            OTHER
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-[10px] font-black uppercase italic" />
                    </FormItem>
                  )}
                />

                {/* Message Textarea */}
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel className="text-[10px] font-black uppercase tracking-[0.3em]">
                        MISSION_DESCRIPTION
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="THE STORY..."
                          className="min-h-[200px] bg-white border-4 border-black font-medium text-lg focus-visible:ring-primary rounded-none p-6 shadow-[8px_8px_0px_black] resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-[10px] font-black uppercase italic" />
                    </FormItem>
                  )}
                />

                {/* Root Error Message */}
                {form.formState.errors.root && (
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="p-4 bg-red-50 border-2 border-red-600 flex items-center gap-3 text-red-600 font-black uppercase text-[10px] tracking-widest"
                  >
                    <AlertCircle className="size-4" />
                    {form.formState.errors.root.message}
                  </motion.div>
                )}

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-20 bg-primary text-black border-4 border-black font-black uppercase text-xl italic tracking-tighter hover:translate-x-2 hover:-translate-y-2 hover:shadow-[12px_12px_0px_black] transition-all duration-300 enabled:active:scale-95"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-4">
                      <Loader2 className="size-6 animate-spin" />
                      TRANSMITTING...
                    </div>
                  ) : (
                    <div className="flex items-center gap-4">
                      INITIATE TRANSMISSION <Send className="size-6" />
                    </div>
                  )}
                </Button>
              </form>
            </Form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
