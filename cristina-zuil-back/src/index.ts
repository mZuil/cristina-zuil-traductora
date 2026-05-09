import sharp from 'sharp';
import path from 'path';
import fs from 'fs';

// Disable Sharp's input cache — prevents stale file handles on Windows
sharp.cache(false);

const BREAKPOINTS: Record<string, number> = {
  lqip:      12,
  thumbnail: 156,
  xsmall:    320,
  small:     640,
  medium:    960,
  large:     1280,
  xlarge:    1920,
};

const FORMAT_OPTIONS: Record<string, object> = {
  avif: { quality: 60, effort: 4 },
  webp: { quality: 75 },
  jpg:  { quality: 82, mozjpeg: true },
};

function toSharpMethod(ext: string): 'avif' | 'webp' | 'jpeg' {
  return ext === 'jpg' ? 'jpeg' : ext as 'avif' | 'webp';
}

function getOutputFormats(mime: string): string[] {
  switch (mime) {
    case 'image/webp': return ['avif', 'jpg'];
    case 'image/avif': return ['webp', 'jpg'];
    default:           return ['avif', 'webp'];
  }
}

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

        strapi.log.info(`[image-optimizer] Processing: ${file.name} (${file.mime})`);

        try {
          // Read into buffer once — Sharp never holds a file-system handle
          const sourceBuffer = fs.readFileSync(filePath);

          const meta = await sharp(sourceBuffer).metadata();
          const originalWidth = meta.width ?? 9999;
          const formats = getOutputFormats(file.mime);

          for (const [breakpointName, maxWidth] of Object.entries(BREAKPOINTS)) {
            if (maxWidth > originalWidth) continue;

            for (const ext of formats) {
              const outputPath = path.join(uploadDir, `${breakpointName}_${file.hash}.${ext}`);

              await sharp(sourceBuffer)
                .resize({ width: maxWidth, withoutEnlargement: true })
                [toSharpMethod(ext)](FORMAT_OPTIONS[ext] as any)
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
        const formats = getOutputFormats(file.mime);

        for (const breakpointName of Object.keys(BREAKPOINTS)) {
          for (const ext of formats) {
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