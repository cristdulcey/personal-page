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
    { name: 'Medium', url: 'https://medium.com/@cristdulcey', icon: 'medium' },
  ],
  supportLinks: {
    coffee: 'https://bmc.link/cristdulcey',
    paypal:
      'https://www.paypal.com/donate/?business=DP8D4YH6HJJVC&no_recurring=0&item_name=Si+crees+que+te+ayude+en+algo%2C+puedes+sentirte+libre+de+apoyarme+con+lo+que+quieras&currency_code=USD',
  },
  contentLinks: {
    youtube: 'https://www.youtube.com/@cristdulcey',
    tiktok: 'https://www.tiktok.com/@cristdulcey',
    instagram: 'https://www.instagram.com/cristdulcey/',
    medium: 'https://medium.com/@cristdulcey',
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
      kicker: 'Hola, soy',
      role: 'Desarrollador de software y creador de contenido',
      description:
        'Desarrollador de software colombiano con experiencia construyendo productos digitales de principio a fin: desde la infraestructura y el despliegue hasta las aplicaciones web y móviles que usan las personas todos los días.',
      ctaWork: 'Qué hago',
      ctaContact: 'Contactar',
      photoAlt: 'Foto de Cristian Dulcey',
      socialsLabel: 'Redes sociales',
    },
    work: {
      title: 'Qué hago',
      intro:
        'Además de escribir código, creo contenido para compartir lo que aprendo. Estas son las áreas en las que trabajo:',
      areas: [
        {
          icon: '🤖',
          title: 'DevOps e infraestructura',
          desc: 'Automatización de despliegues, integración continua y operación de aplicaciones en la nube.',
        },
        {
          icon: '🐍',
          title: 'Backend con Python',
          desc: 'APIs, automatizaciones y procesamiento de datos.',
        },
        {
          icon: '🖥️',
          title: 'Frontend con Vue y React',
          desc: 'Interfaces web modernas y responsivas.',
        },
        {
          icon: '📱',
          title: 'Apps móviles',
          desc: 'Desarrollo iOS con Swift y Android con Java.',
        },
        {
          icon: '🖼️',
          title: 'Web3',
          desc: 'Desarrollo con tokens y NFTs sobre contratos inteligentes.',
        },
        {
          icon: '💬',
          title: 'Chatbots',
          desc: 'Asistentes conversacionales e integraciones con plataformas de mensajería y redes sociales.',
        },
      ],
    },
    projects: {
      title: 'Proyectos',
      intro: 'Algunos de los proyectos de los que he hecho parte:',
      items: [
        {
          key: 'chivo' as const,
          title: 'Chivo Wallet',
          desc: 'Billetera virtual del gobierno de El Salvador, la primera en el mundo en implementar Bitcoin como moneda de curso legal (2021). Tuve la oportunidad de ser parte de este proyecto.',
          tags: ['Bitcoin', 'Fintech', 'Billetera'],
          url: 'https://www.chivowallet.com',
        },
        {
          key: 'fenix' as const,
          title: 'Proyecto Fénix',
          desc: 'Plataforma de la Secretaría de Movilidad de Bogotá. Participé en todo el despliegue y la administración de la infraestructura del proyecto.',
          tags: ['DevOps', 'Infraestructura', 'Gobierno'],
          url: 'https://webfenix.movilidadbogota.gov.co',
        },
        {
          key: 'walletguru' as const,
          title: 'Wallet Guru',
          desc: 'Una de las primeras billeteras en integrar Open Payments, el protocolo desarrollado por la Interledger Foundation con su proyecto Rafiki.',
          tags: ['Open Payments', 'Interledger', 'Billetera'],
          url: 'https://www.walletguru.com',
        },
        {
          key: 'maddroids' as const,
          title: 'Mad Droids',
          desc: 'Videojuego con personajes tokenizados como NFT sobre la red de Polygon (MATIC). Hice parte del desarrollo del juego.',
          tags: ['NFT', 'Polygon', 'Videojuego'],
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
          name: 'Medium',
          desc: 'Artículos técnicos y tutoriales sobre lo que voy aprendiendo.',
          action: 'Leer artículos',
          icon: 'medium',
          glow: 'rgba(2, 184, 117, 0.35)',
          linkKey: 'medium' as const,
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
      p2: 'Publico videos en YouTube y artículos técnicos en Medium sobre desarrollo de software, DevOps y tecnología.',
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
      lead: '¿Tienes un proyecto en mente o quieres colaborar? Me encantaría escucharte.',
      emailButton: 'Escríbeme',
      supportLead: 'Si mi trabajo te ha sido útil, puedes apoyarme:',
      coffee: 'Cómprame un café',
      paypal: 'PayPal',
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
      kicker: "Hi, I'm",
      role: 'Software developer and content creator',
      description:
        'Colombian software developer with experience building digital products end to end: from infrastructure and deployment to the web and mobile apps people use every day.',
      ctaWork: 'What I do',
      ctaContact: 'Get in touch',
      photoAlt: 'Photo of Cristian Dulcey',
      socialsLabel: 'Social links',
    },
    work: {
      title: 'What I do',
      intro:
        'Besides writing code, I create content to share what I learn. These are the areas I work in:',
      areas: [
        {
          icon: '🤖',
          title: 'DevOps and infrastructure',
          desc: 'Deployment automation, continuous integration and running applications in the cloud.',
        },
        {
          icon: '🐍',
          title: 'Backend with Python',
          desc: 'APIs, automations and data processing.',
        },
        {
          icon: '🖥️',
          title: 'Frontend with Vue and React',
          desc: 'Modern, responsive web interfaces.',
        },
        {
          icon: '📱',
          title: 'Mobile apps',
          desc: 'iOS development with Swift and Android with Java.',
        },
        {
          icon: '🖼️',
          title: 'Web3',
          desc: 'Tokens and NFTs built on smart contracts.',
        },
        {
          icon: '💬',
          title: 'Chatbots',
          desc: 'Conversational assistants and integrations with messaging platforms and social media.',
        },
      ],
    },
    projects: {
      title: 'Projects',
      intro: 'Some of the projects I have been part of:',
      items: [
        {
          key: 'chivo' as const,
          title: 'Chivo Wallet',
          desc: 'Virtual wallet of the government of El Salvador, the first in the world to implement Bitcoin as legal tender (2021). I had the opportunity to be part of this project.',
          tags: ['Bitcoin', 'Fintech', 'Wallet'],
          url: 'https://www.chivowallet.com',
        },
        {
          key: 'fenix' as const,
          title: 'Fénix Project',
          desc: "Platform for Bogotá's Secretariat of Mobility. I worked on the entire deployment and infrastructure administration of the project.",
          tags: ['DevOps', 'Infrastructure', 'Government'],
          url: 'https://webfenix.movilidadbogota.gov.co',
        },
        {
          key: 'walletguru' as const,
          title: 'Wallet Guru',
          desc: 'One of the first wallets to integrate Open Payments, the protocol developed by the Interledger Foundation with its Rafiki project.',
          tags: ['Open Payments', 'Interledger', 'Wallet'],
          url: 'https://www.walletguru.com',
        },
        {
          key: 'maddroids' as const,
          title: 'Mad Droids',
          desc: 'Video game with characters tokenised as NFTs on the Polygon (MATIC) network. I was part of the game development.',
          tags: ['NFT', 'Polygon', 'Video game'],
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
          name: 'Medium',
          desc: 'Technical articles and tutorials about what I learn along the way.',
          action: 'Read the articles',
          icon: 'medium',
          glow: 'rgba(2, 184, 117, 0.35)',
          linkKey: 'medium' as const,
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
      p2: 'I publish videos on YouTube and technical articles on Medium about software development, DevOps and technology.',
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
      lead: "Got a project in mind, or want to collaborate? I'd love to hear from you.",
      emailButton: 'Email me',
      supportLead: 'If my work has been useful to you, you can support me:',
      coffee: 'Buy me a coffee',
      paypal: 'PayPal',
    },
    footer: 'Built with Astro in Colombia',
  },
} satisfies Record<Lang, unknown>;
