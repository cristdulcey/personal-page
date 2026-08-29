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
    medium: 'https://medium.com/@cristdulcey',
    github: 'https://github.com/cristdulcey',
  },
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
      items: [
        {
          title: 'Proyecto uno',
          desc: 'Describe aquí tu proyecto destacado: qué problema resuelve, con qué tecnología lo construiste y qué lo hace especial.',
          tags: ['Python', 'DevOps'],
          url: '#',
        },
        {
          title: 'Proyecto dos',
          desc: 'Otro proyecto del que te sientas orgulloso. Puedes enlazar al repositorio o a la demo en vivo.',
          tags: ['Vue', 'Web3'],
          url: '#',
        },
        {
          title: 'Proyecto tres',
          desc: 'Añade o quita tarjetas según necesites: son objetos en un arreglo en src/i18n.ts.',
          tags: ['Swift', 'Android'],
          url: '#',
        },
      ],
    },
    content: {
      title: 'Mi contenido',
      intro: 'Comparto lo que aprendo sobre desarrollo de software, DevOps y tecnología:',
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
      items: [
        {
          title: 'Project one',
          desc: 'Describe your featured project here: what problem it solves, the technology behind it and what makes it special.',
          tags: ['Python', 'DevOps'],
          url: '#',
        },
        {
          title: 'Project two',
          desc: 'Another project you are proud of. You can link to the repository or a live demo.',
          tags: ['Vue', 'Web3'],
          url: '#',
        },
        {
          title: 'Project three',
          desc: 'Add or remove cards as needed: they are objects in an array in src/i18n.ts.',
          tags: ['Swift', 'Android'],
          url: '#',
        },
      ],
    },
    content: {
      title: 'My content',
      intro: 'I share what I learn about software development, DevOps and technology:',
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
