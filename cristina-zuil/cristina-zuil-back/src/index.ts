// import type { Core } from '@strapi/strapi';

export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/* { strapi }: { strapi: Core.Strapi } */) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   * 
   * Note: Preview URLs are configured in the schema.json file
   * and can also be set manually in the Strapi admin panel
   * under Settings > Preview.
   */
  bootstrap(/* { strapi }: { strapi: Core.Strapi } */) {},
};
