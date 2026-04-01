import { ExternalLink, Facebook, Github, Globe, Instagram, Linkedin, Mail, Twitter, Youtube } from 'lucide-react';

export function getSocialIcon(platform: string) {
  const normalized = platform.toLowerCase();

  if (normalized.includes('git')) return Github;
  if (normalized.includes('insta')) return Instagram;
  if (normalized.includes('face') || normalized === 'fb') return Facebook;
  if (normalized.includes('linke')) return Linkedin;
  if (normalized.includes('mail') || normalized.includes('emai')) return Mail;
  if (normalized.includes('twit') || normalized === 'x') return Twitter;
  if (normalized.includes('youtu')) return Youtube;
  if (normalized.includes('web') || normalized.includes('site') || normalized.includes('portfolio')) return Globe;

  return ExternalLink;
}

function looksLikeEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function getSocialHref(platform: string, value?: string | null) {
  const trimmed = value?.trim() || '';
  if (!trimmed) return '#';

  const normalizedPlatform = platform.toLowerCase();

  if (trimmed.startsWith('mailto:')) {
    const email = trimmed.replace(/^mailto:/i, '').trim();
    return `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}`;
  }

  if (normalizedPlatform.includes('mail') || normalizedPlatform.includes('emai') || looksLikeEmail(trimmed)) {
    return `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(trimmed)}`;
  }

  if (/^(https?:\/\/|tel:|sms:|whatsapp:)/i.test(trimmed)) {
    return trimmed;
  }

  return `https://${trimmed.replace(/^\/+/, '')}`;
}
