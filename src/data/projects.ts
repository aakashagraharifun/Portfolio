import type { Project } from '@/types';

export const projects: Project[] = [
  {
    id: '1',
    title: 'CrewSpace AI',
    category: 'hackathon',
    year: '2026',
    slug: 'crewspace-ai',
    // Replace with your own screenshot
    coverImage: '/projects/crewspace.png',
    description: 'AI-powered workflow and collaboration platform that allows users to manage tasks, agents, and automation in a unified system. Built during GCU Hackathon (EUPHUISM 2026) under intense time constraints — and won 1st place with a ₹10,000 cash prize.',
    client: 'GCU Hackathon — EUPHUISM 2026',
    location: 'Guwahati, Assam',
    liveUrl: 'https://crewspace-ai.vercel.app/',
    githubUrl: 'https://github.com/vxwshxl/CrewSpace',
    techStack: ['React', 'AI Workflows', 'Automation', 'Vercel'],
    highlight: '🥇 1st Place Winner',
    images: [
      {
        id: '1-1',
        src: '/projects/crewspace.png',
        alt: 'CrewSpace AI Dashboard',
        aspectRatio: 'landscape'
      }
    ]
  },
  {
    id: '2',
    title: 'Pulse Global',
    category: 'webapp',
    year: '2026',
    slug: 'pulse-global',
    coverImage: '/projects/pulseglobal.png',
    description: 'Real-time global news aggregation platform that fetches and displays live headlines using APIs and intelligent filtering logic. Designed for fast, distraction-free news consumption.',
    liveUrl: 'https://pulseglobal.netlify.app/',
    techStack: ['JavaScript', 'APIs', 'RSS', 'Netlify'],
    images: [
      {
        id: '2-1',
        src: '/projects/pulseglobal.png',
        alt: 'Pulse Global news dashboard',
        aspectRatio: 'landscape'
      }
    ]
  },
  {
    id: '3',
    title: 'Intellaris Studio',
    category: 'startup',
    year: '2026',
    slug: 'intellaris-studio',
    coverImage: '/projects/intellaris.png',
    description: 'Contributing to a startup product focused on scalable UI systems and modern web experiences. Working on frontend architecture, component design, and user-facing features in a real product environment.',
    client: 'Intellaris Studio',
    liveUrl: 'https://studio.intellaris.co/',
    techStack: ['React', 'UI Systems', 'Design Tokens'],
    highlight: '🚀 Startup Experience',
    images: [
      {
        id: '3-1',
        src: '/projects/intellaris.png',
        alt: 'Intellaris Studio platform',
        aspectRatio: 'landscape'
      }
    ]
  },
  {
    id: '4',
    title: 'CodeWar 7.0 Prototype',
    category: 'hackathon',
    year: '2026',
    slug: 'codewar-prototype',
    coverImage: '/projects/codewar.png',
    description: 'Rapidly built functional prototype during CodeWar 7.0 at AEC Coding Club, solving a real-world problem under extreme time pressure. Secured 2nd place against strong competition.',
    client: 'AEC Coding Club — CodeWar 7.0',
    githubUrl: 'https://github.com/vxwshxl/1e',
    techStack: ['JavaScript', 'Chrome APIs'],
    highlight: '🥈 2nd Place Winner',
    images: [
      {
        id: '4-1',
        src: '/projects/codewar.png',
        alt: 'CodeWar hackathon prototype',
        aspectRatio: 'landscape'
      }
    ]
  },
  {
    id: '5',
    title: 'MegaRoof',
    category: 'business',
    year: '2025',
    slug: 'megaroof',
    coverImage: '/projects/megaroof.png',
    description: 'Designed and developed a service-based business website with focus on lead generation, structured information architecture, and professional presentation for a roofing company.',
    liveUrl: 'https://megaroof.netlify.app/',
    techStack: ['HTML', 'CSS', 'JavaScript'],
    images: [
      {
        id: '5-1',
        src: '/projects/megaroof.png',
        alt: 'MegaRoof business website',
        aspectRatio: 'landscape'
      }
    ]
  },
  {
    id: '6',
    title: 'SkyWea',
    category: 'utility',
    year: '2025',
    slug: 'skywea',
    coverImage: '/projects/skywea.png',
    description: 'Minimal weather dashboard displaying real-time environmental data — temperature, humidity, wind speed, and forecasts — using weather APIs with a clean, focused interface.',
    liveUrl: 'https://skywea.netlify.app/',
    techStack: ['JavaScript', 'Weather API'],
    images: [
      {
        id: '6-1',
        src: '/projects/skywea.png',
        alt: 'SkyWea weather dashboard',
        aspectRatio: 'landscape'
      }
    ]
  },
  {
    id: '7',
    title: 'Chemical Flames',
    category: 'creative',
    year: '2025',
    slug: 'chemical-flames',
    coverImage: '/projects/chemicalflames.png',
    description: 'Web-based interactive experience exploring chemical reactions and flame behavior through vivid visual simulations. A creative coding project blending science with art.',
    liveUrl: 'https://chemicalflames.netlify.app/',
    techStack: ['HTML', 'CSS', 'JavaScript'],
    images: [
      {
        id: '7-1',
        src: '/projects/chemicalflames.png',
        alt: 'Chemical Flames interactive visualization',
        aspectRatio: 'landscape'
      }
    ]
  },
  {
    id: '8',
    title: 'BookEvently',
    category: 'webapp',
    year: '2025',
    slug: 'bookevently',
    coverImage: '/projects/bookevently.png',
    description: 'Event booking interface with custom UI improvements in responsiveness, flow, and interaction design. Built as a deep-dive into React component architecture and state management.',
    liveUrl: 'https://bookevently.netlify.app/',
    techStack: ['React'],
    images: [
      {
        id: '8-1',
        src: '/projects/bookevently.png',
        alt: 'BookEvently event booking UI',
        aspectRatio: 'landscape'
      }
    ]
  },
  {
    id: '9',
    title: 'Aakash Poems',
    category: 'creative',
    year: '2025',
    slug: 'aakash-poems',
    coverImage: '/projects/aakashpoems.png',
    description: 'A personal writing platform where I publish poetry and expressive content. A creative outlet that sits alongside my technical work — because building isn\'t only about code.',
    liveUrl: 'https://aakashpoems.cloud/',
    techStack: ['Web Platform'],
    images: [
      {
        id: '9-1',
        src: '/projects/aakashpoems.png',
        alt: 'Aakash Poems creative platform',
        aspectRatio: 'landscape'
      }
    ]
  }
];

// Helper function to get project by slug
export const getProjectBySlug = (slug: string): Project | undefined => {
  return projects.find(project => project.slug === slug);
};

// Helper function to get projects by category
export const getProjectsByCategory = (category: string): Project[] => {
  if (category === 'all') return projects;
  return projects.filter(project => project.category === category);
};

// Helper function to get featured projects (first 4)
export const getFeaturedProjects = (): Project[] => {
  return projects.slice(0, 4);
};

// Helper function to get next/previous project
export const getAdjacentProjects = (currentSlug: string): { prev: Project | null; next: Project | null } => {
  const currentIndex = projects.findIndex(p => p.slug === currentSlug);
  
  return {
    prev: currentIndex > 0 ? projects[currentIndex - 1] : null,
    next: currentIndex < projects.length - 1 ? projects[currentIndex + 1] : null
  };
};
