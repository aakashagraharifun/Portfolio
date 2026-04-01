/**
 * Core TypeScript interfaces for Aakash Agrahari's Portfolio
 * Adapted for a developer/builder portfolio
 */

export type ProjectCategory = 'hackathon' | 'webapp' | 'startup' | 'business' | 'creative' | 'utility';

export type AspectRatio = 'portrait' | 'landscape' | 'square';

export interface ProjectImage {
  id: string;
  src: string;
  alt: string;
  aspectRatio: AspectRatio;
  caption?: string;
}

export interface Project {
  id: string;
  title: string;
  category: ProjectCategory;
  year: string;
  coverImage: string;
  images: ProjectImage[];
  description: string;
  client?: string;
  camera?: string;
  location?: string;
  slug: string;
  liveUrl?: string;
  githubUrl?: string;
  techStack?: string[];
  highlight?: string;
  isPinned?: boolean;
}

export interface PhotographerInfo {
  name: string;
  tagline: string;
  heroIntroduction: string;
  biography: string;
  approach: string;
  awards: string[];
  clients: string[];
  education: string;
  location: string;
  email: string;
  phone: string;
  availability: string;
  socialLinks: {
    instagram?: string;
    linkedin?: string;
    behance?: string;
    github?: string;
    website?: string;
  };
  portraitImage: string;
}

export interface ContactSubmission {
  name: string;
  email: string;
  projectType: 'collaboration' | 'freelance' | 'startup' | 'other';
  message: string;
  timestamp: Date;
}
