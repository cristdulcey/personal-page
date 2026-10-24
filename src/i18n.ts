// All site copy in every supported language, plus language-independent
// profile data. Edit content here; the markup lives in src/layouts/Home.astro.

export type Lang = 'es' | 'en';

export const languages: Lang[] = ['es', 'en'];

// Data that does not change between languages
export const profile = {
  name: 'Cristian Dulcey',
  email: 'me@cristdulcey.com',
  photo: 'cristian.jpg',
  socials: [
    { name: 'GitHub', url: 'https://github.com/cristdulcey', icon: 'github' },
    { name: 'LinkedIn', url: 'https://www.linkedin.com/in/cristdulcey/', icon: 'linkedin' },
    { name: 'YouTube', url: 'https://www.youtube.com/@cristdulcey', icon: 'youtube' },
    { name: 'TikTok', url: 'https://www.tiktok.com/@cristdulcey', icon: 'tiktok' },
    { name: 'X', url: 'https://twitter.com/cristdulcey', icon: 'x' },
    { name: 'Instagram', url: 'https://www.instagram.com/cristdulcey/', icon: 'instagram' },
  ],
  contentLinks: {
    youtube: 'https://www.youtube.com/@cristdulcey',
    tiktok: 'https://www.tiktok.com/@cristdulcey',
    instagram: 'https://www.instagram.com/cristdulcey/',
    github: 'https://github.com/cristdulcey',
  },
};

// Visual header of each project card, keyed by the project's `key`.
// `image` (a path under public/, e.g. 'projects/chivo.jpg') takes
// precedence when present; otherwise a branded gradient banner with the
// emblem is rendered.
export type ProjectKey = 'chivo' | 'fenix' | 'walletguru' | 'maddroids';

export const projectMedia: Record<
  ProjectKey,
  { from: string; to: string; emblem: string; image?: string }
> = {
  chivo: { from: '#e2231a', to: '#7f1010', emblem: '₿' },
  fenix: { from: '#f59e0b', to: '#b91c1c', emblem: '🔥' },
  walletguru: { from: '#14b8a6', to: '#065f46', emblem: '🌐' },
  maddroids: { from: '#8247e5', to: '#341478', emblem: '🤖' },
};

export const translations = {
  es: {
    meta: {
      description:
        'Desarrollador de software colombiano con experiencia construyendo productos digitales de principio a fin: desde la infraestructura y el despliegue hasta las aplicaciones web y móviles que usan las personas todos los días.',
    },
    nav: {
      work: 'Qué hago',
      projects: 'Proyectos',
      content: 'Contenido',
      blog: 'Blog',
      contact: 'Contacto',
      langLabel: 'Idioma',
    },
    blog: {
      title: 'Blog',
      intro: 'Notas y artículos sobre desarrollo de software, DevOps y tecnología.',
      empty: 'Todavía no hay artículos publicados. ¡Pronto!',
      back: 'Volver al blog',
    },
    hero: {
      kicker: 'Ingeniería de Software & Arquitectura Cloud',
      role: 'Sistemas Distribuidos, Cloud & Escala',
      description:
        'Diseño y despliegue de plataformas digitales de alta concurrencia, infraestructura como código y arquitectura de sistemas de punta a punta: desde el core bancario y la nube hasta aplicaciones de alto rendimiento.',
      ctaWork: 'Casos de estudio',
      ctaContact: 'Contactar',
      photoAlt: 'Foto de Cristian Dulcey',
      socialsLabel: 'Redes sociales y perfiles técnicos',
    },
    work: {
      title: 'Especialidades',
      intro:
        'Enfoque arquitectónico centrado en resiliencia, automatización estricta y escalabilidad comprobada en producción:',
      areas: [
        {
          title: 'Arquitectura Cloud & DevOps',
          desc: 'Infraestructura como código con Terraform, orquestación en Azure y AWS, observabilidad y despliegue continuo de microservicios.',
        },
        {
          title: 'Backends & Sistemas Distribuidos',
          desc: 'APIs de alta concurrencia, procesamiento asíncrono y componentes críticos para core bancario y transaccional.',
        },
        {
          title: 'Frontend & Arquitectura Web',
          desc: 'Interfaces reactivas y sistemas de diseño de alto rendimiento con Astro, React y Vue, priorizando accesibilidad y Core Web Vitals.',
        },
        {
          title: 'Plataformas Móviles Nativas',
          desc: 'Desarrollo nativo centrado en rendimiento, seguridad y offline-first con Swift (iOS) y Java/Kotlin (Android).',
        },
        {
          title: 'Web3 & Protocolos Financieros',
          desc: 'Integración de protocolos de interoperabilidad (Open Payments / Rafiki) y arquitectura de smart contracts sobre redes EVM.',
        },
      ],
    },
    projects: {
      title: 'Proyectos',
      intro: 'Sistemas distribuidos y plataformas en producción de los que he hecho parte:',
      prev: 'Proyectos anteriores',
      next: 'Más proyectos',
      caseStudyAction: 'Ver caso de estudio de arquitectura',
      items: [
        {
          key: 'chivo' as const,
          title: 'Chivo Wallet',
          caseStudy: true,
          desc: 'Billetera oficial de El Salvador para la primera adopción nacional de Bitcoin como moneda de curso legal. Desarrollé el sistema de soporte y mesa de ayuda para atención masiva y modifiqué componentes críticos del core bancario transaccional.',
          tags: ['Core Bancario', 'Bitcoin', 'Fintech', 'Escala País'],
          url: 'https://www.chivowallet.com',
        },
        {
          key: 'fenix' as const,
          title: 'Proyecto Fénix',
          caseStudy: true,
          desc: 'Plataforma central de la Secretaría de Movilidad de Bogotá. Lideré el despliegue, infraestructura como código con Terraform, pipelines de Azure DevOps y monitoreo operativo de más de 300 microservicios en Microsoft Azure.',
          tags: ['Azure', 'Terraform', 'Azure DevOps', '300+ Microservicios', 'SRE'],
          url: 'https://webfenix.movilidadbogota.gov.co',
        },
        {
          key: 'walletguru' as const,
          title: 'Wallet Guru',
          desc: 'Billetera digital pionera en la implementación de Open Payments, protocolo estándar de interoperabilidad financiera de la Interledger Foundation construido sobre Rafiki.',
          tags: ['Open Payments', 'Interledger', 'Protocolos', 'Fintech'],
          url: 'https://www.walletguru.com',
        },
        {
          key: 'maddroids' as const,
          title: 'Mad Droids',
          desc: 'Arquitectura de smart contracts y dApp interactiva sobre la red de Polygon (EVM), con personajes tokenizados como NFT y lógica descentralizada.',
          tags: ['Smart Contracts', 'Polygon', 'Web3', 'dApps'],
          url: 'https://www.instagram.com/maddroids/',
        },
      ],
    },
    content: {
      title: 'Mi contenido',
      intro:
        'Comparto lo que aprendo sobre desarrollo de software, DevOps y tecnología: videos, artículos, y ahora también reels y contenido corto en redes sociales.',
      cards: [
        {
          name: 'YouTube',
          desc: 'Videos sobre desarrollo de software, DevOps y tecnología.',
          action: 'Ver canal',
          icon: 'youtube',
          glow: 'rgba(255, 0, 51, 0.35)',
          linkKey: 'youtube' as const,
        },
        {
          name: 'TikTok',
          desc: 'Reels y videos cortos sobre programación y tecnología.',
          action: 'Ver TikTok',
          icon: 'tiktok',
          glow: 'rgba(254, 44, 85, 0.35)',
          linkKey: 'tiktok' as const,
        },
        {
          name: 'Instagram',
          desc: 'Reels y contenido corto de mi día a día como desarrollador.',
          action: 'Ver perfil',
          icon: 'instagram',
          glow: 'rgba(228, 64, 95, 0.35)',
          linkKey: 'instagram' as const,
        },
        {
          name: 'Blog',
          desc: 'Artículos técnicos y tutoriales, publicados aquí mismo, en mi propio blog.',
          action: 'Leer el blog',
          icon: 'blog',
          glow: 'rgba(6, 182, 212, 0.35)',
          linkKey: 'blog' as const,
        },
        {
          name: 'GitHub',
          desc: 'Mis proyectos de código abierto.',
          action: 'Ver repositorios',
          icon: 'github',
          glow: 'rgba(167, 139, 250, 0.35)',
          linkKey: 'github' as const,
        },
      ],
    },
    about: {
      title: 'Sobre mí',
      p1: 'Trabajo en productos digitales de principio a fin: infraestructura, backend, web y móvil. Me gusta automatizar todo lo que se pueda automatizar y aprender en público.',
      p2: 'Publico videos en YouTube, reels y contenido corto en redes sociales, y artículos técnicos en el blog de este sitio.',
      skillsTitle: 'Tecnologías',
      skills: [
        'Python',
        'Vue y React',
        'Swift (iOS)',
        'Java (Android)',
        'DevOps / CI-CD',
        'Nube y despliegues',
        'Web3 y smart contracts',
        'Chatbots',
      ],
    },
    contact: {
      title: 'Contacto',
      lead: '¿Tienes un proyecto en mente o buscas asesoría técnica de arquitectura? Hablemos.',
      emailButton: 'Escríbeme',
    },
    footer: 'Hecho con Astro desde Colombia',
  },
  en: {
    meta: {
      description:
        'Colombian software developer with experience building digital products end to end: from infrastructure and deployment to the web and mobile apps people use every day.',
    },
    nav: {
      work: 'What I do',
      projects: 'Projects',
      content: 'Content',
      blog: 'Blog',
      contact: 'Contact',
      langLabel: 'Language',
    },
    blog: {
      title: 'Blog',
      intro: 'Notes and articles about software development, DevOps and technology.',
      empty: 'No posts published yet. Coming soon!',
      back: 'Back to the blog',
    },
    hero: {
      kicker: 'Software Engineering & Cloud Architecture',
      role: 'Distributed Systems, Cloud & Scale',
      description:
        'Architecting and deploying resilient high-concurrency systems, Infrastructure as Code, and end-to-end digital platforms: from core transactional engines to high-performance user interfaces.',
      ctaWork: 'Case studies',
      ctaContact: 'Contact',
      photoAlt: 'Cristian Dulcey portrait',
      socialsLabel: 'Technical and social profiles',
    },
    work: {
      title: 'Core Practice',
      intro:
        'Architectural focus grounded in resilience, rigorous automation, and production-tested scalability:',
      areas: [
        {
          title: 'Cloud Architecture & DevOps',
          desc: 'Infrastructure as Code with Terraform, Azure and AWS orchestration, observability, and continuous deployment for microservices.',
        },
        {
          title: 'Backends & Distributed Systems',
          desc: 'High-concurrency APIs, asynchronous data pipelines, and mission-critical transactional core banking components.',
        },
        {
          title: 'Frontend & Web Architecture',
          desc: 'High-performance reactive interfaces and accessible design systems using Astro, React, and Vue, built for speed and Core Web Vitals.',
        },
        {
          title: 'Native Mobile Platforms',
          desc: 'Native engineering focused on performance, security, and offline reliability using Swift (iOS) and Java/Kotlin (Android).',
        },
        {
          title: 'Web3 & Financial Protocols',
          desc: 'Integration of financial interoperability standards (Open Payments / Rafiki) and smart contract architectures on EVM networks.',
        },
      ],
    },
    projects: {
      title: 'Projects',
      intro: 'Distributed systems and production platforms I have engineered:',
      prev: 'Previous projects',
      next: 'More projects',
      caseStudyAction: 'Read architecture case study',
      items: [
        {
          key: 'chivo' as const,
          title: 'Chivo Wallet',
          caseStudy: true,
          desc: 'Official national digital wallet for El Salvador, the first nation-state legal tender Bitcoin deployment. Engineered the nationwide customer support system and developed critical components for the transactional core banking engine.',
          tags: ['Core Banking', 'Bitcoin', 'Fintech', 'Nation-State Scale'],
          url: 'https://www.chivowallet.com',
        },
        {
          key: 'fenix' as const,
          title: 'Fénix Project',
          caseStudy: true,
          desc: "Central transit and mobility platform for the Bogota District Secretariat of Mobility. Responsible for deployment architecture, Infrastructure as Code with Terraform, Azure DevOps CI/CD pipelines, and monitoring for 300+ microservices on Microsoft Azure.",
          tags: ['Azure', 'Terraform', 'Azure DevOps', '300+ Microservices', 'SRE'],
          url: 'https://webfenix.movilidadbogota.gov.co',
        },
        {
          key: 'walletguru' as const,
          title: 'Wallet Guru',
          desc: 'Pioneering digital wallet integrating Open Payments, the financial interoperability standard created by the Interledger Foundation with project Rafiki.',
          tags: ['Open Payments', 'Interledger', 'Protocols', 'Fintech'],
          url: 'https://www.walletguru.com',
        },
        {
          key: 'maddroids' as const,
          title: 'Mad Droids',
          desc: 'Smart contract architecture and decentralized application on the Polygon network (EVM), managing tokenized NFT game assets and on-chain logic.',
          tags: ['Smart Contracts', 'Polygon', 'Web3', 'dApps'],
          url: 'https://www.instagram.com/maddroids/',
        },
      ],
    },
    content: {
      title: 'My content',
      intro:
        'I share what I learn about software development, DevOps and technology: videos, articles, and now also reels and short-form content on social media.',
      cards: [
        {
          name: 'YouTube',
          desc: 'Videos about software development, DevOps and technology.',
          action: 'Watch the channel',
          icon: 'youtube',
          glow: 'rgba(255, 0, 51, 0.35)',
          linkKey: 'youtube' as const,
        },
        {
          name: 'TikTok',
          desc: 'Reels and short-form videos about programming and technology.',
          action: 'Watch on TikTok',
          icon: 'tiktok',
          glow: 'rgba(254, 44, 85, 0.35)',
          linkKey: 'tiktok' as const,
        },
        {
          name: 'Instagram',
          desc: 'Reels and short-form content from my day-to-day as a developer.',
          action: 'View profile',
          icon: 'instagram',
          glow: 'rgba(228, 64, 95, 0.35)',
          linkKey: 'instagram' as const,
        },
        {
          name: 'Blog',
          desc: 'Technical articles and tutorials, published right here on my own blog.',
          action: 'Read the blog',
          icon: 'blog',
          glow: 'rgba(6, 182, 212, 0.35)',
          linkKey: 'blog' as const,
        },
        {
          name: 'GitHub',
          desc: 'My open-source projects.',
          action: 'Browse the repositories',
          icon: 'github',
          glow: 'rgba(167, 139, 250, 0.35)',
          linkKey: 'github' as const,
        },
      ],
    },
    about: {
      title: 'About me',
      p1: 'I work on digital products end to end: infrastructure, backend, web and mobile. I like automating everything that can be automated, and learning in public.',
      p2: "I publish videos on YouTube, reels and short-form content on social media, and technical articles on this site's blog.",
      skillsTitle: 'Technologies',
      skills: [
        'Python',
        'Vue and React',
        'Swift (iOS)',
        'Java (Android)',
        'DevOps / CI-CD',
        'Cloud and deployments',
        'Web3 and smart contracts',
        'Chatbots',
      ],
    },
    contact: {
      title: 'Contact',
      lead: 'Have a project in mind or looking for technical architecture advisory? Let’s talk.',
      emailButton: 'Email me',
    },
    footer: 'Built with Astro in Colombia',
  },
} satisfies Record<Lang, unknown>;
