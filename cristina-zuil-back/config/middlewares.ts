export default [
  'strapi::logger',
  'strapi::errors',
  'strapi::security',
  {
    name: 'strapi::cors',
    config: {
      origin: [
        'https://cristina-zuil-traductora.es',
        'https://www.cristina-zuil-traductora.es',
        'https://cce9a347.cristina-zuil-traductora.pages.dev',
      ],
    },
  },
  'strapi::poweredBy',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];
