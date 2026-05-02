import sharp from 'sharp';
import path from 'path';
import fs from 'fs';

const BREAKPOINTS: Record<string, number> = {
  lqip:      12,
  thumbnail: 156,
  xsmall:    320,
  small:     640,
  medium:    960,
  large:     1280,
  xlarge:    1920,
};

const FORMATS = [
  { ext: 'avif' as const, options: { quality: 60, effort: 4 } },
  { ext: 'webp' as const, options: { quality: 75 } },
];

function isProcessableImage(mime: string): boolean {
  return mime?.startsWith('image/') && mime !== 'image/svg+xml';
}

export default {
  register({ strapi }: { strapi: any }) {
    strapi.db.lifecycles.subscribe({
      models: ['plugin::upload.file'],

      async afterCreate(event: any) {
        const file = event.result;

        if (!isProcessableImage(file.mime)) return;

        const uploadDir = path.join(process.cwd(), 'public', 'uploads');
        const filePath  = path.join(uploadDir, `${file.hash}${file.ext}`);

        if (!fs.existsSync(filePath)) {
          strapi.log.warn(`[image-optimizer] Source not found: ${filePath}`);
          return;
        }

        strapi.log.info(`[image-optimizer] Processing: ${file.name}`);

        try {
          const meta = await sharp(filePath).metadata();
          const originalWidth = meta.width ?? 9999;

          for (const [breakpointName, maxWidth] of Object.entries(BREAKPOINTS)) {
            // Skip breakpoints larger than the original
            if (maxWidth > originalWidth) continue;

            for (const { ext, options } of FORMATS) {
              const outputPath = path.join(uploadDir, `${breakpointName}_${file.hash}.${ext}`);

              await sharp(filePath)
                .resize({ width: maxWidth, withoutEnlargement: true })
                [ext](options as any)
                .toFile(outputPath);

              strapi.log.info(`[image-optimizer] ✓ ${breakpointName}_${file.hash}.${ext}`);
            }
          }

          strapi.log.info(`[image-optimizer] Done: ${file.name}`);
        } catch (err: any) {
          strapi.log.error(`[image-optimizer] Failed: ${err.message}`);
        }
      },

      async afterDelete(event: any) {
        const file = event.result;
        if (!isProcessableImage(file.mime)) return;

        const uploadDir = path.join(process.cwd(), 'public', 'uploads');

        for (const breakpointName of Object.keys(BREAKPOINTS)) {
          for (const { ext } of FORMATS) {
            const filePath = path.join(uploadDir, `${breakpointName}_${file.hash}.${ext}`);
            if (fs.existsSync(filePath)) {
              fs.unlinkSync(filePath);
              strapi.log.info(`[image-optimizer] Deleted: ${breakpointName}_${file.hash}.${ext}`);
            }
          }
        }
      },
    });
  },
};