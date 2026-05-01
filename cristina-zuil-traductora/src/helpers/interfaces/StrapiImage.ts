
export type StrapiImageFormat = {
  url: string;
  width: number;
  height: number;
  size?: number;
  mime?: string;
};

export type StrapiImage = {
  url: string;
  width: number;
  height: number;
  alternativeText?: string | null;
  name?: string | null;
  mime: string;
  hash?: string;
  ext?: string;
  formats?: Record<string, StrapiImageFormat> | null;
};

export const DEFAULT_SIZES = '(max-width: 768px) 100vw, 50vw';

const OPTIMIZED_BREAKPOINTS: Array<{ key: string; width: number }> = [
  { key: 'xsmall', width: 320 },
  { key: 'small', width: 640 },
  { key: 'medium', width: 960 },
  { key: 'large', width: 1280 },
  { key: 'xlarge', width: 1920 },
  { key: 'thumbnail', width: 156 },
];

export function buildSrcSet(image: StrapiImage, format: 'avif' | 'webp'): string {
  const base = import.meta.env.PUBLIC_STRAPI_URL ?? '';
  const hash = image.hash;
  if (!hash) return '';

  return OPTIMIZED_BREAKPOINTS
    .filter(({ width }) => Number(image.width || 0) === 0 || width <= Number(image.width || 0))
    .map(({ key, width }) => `${base}/uploads/${key}_${hash}.${format} ${width}w`)
    .join(', ');
}

export function buildNativeSrcSet(image: StrapiImage): string {
  const base = import.meta.env.PUBLIC_STRAPI_URL ?? '';
  const formats = image.formats || {};
  const entries = Object.values(formats)
    .filter((f): f is StrapiImageFormat => Boolean(f?.url && f?.width))
    .sort((a, b) => a.width - b.width);

  return entries.map((f) => `${base}${f.url} ${f.width}w`).join(', ');
}
