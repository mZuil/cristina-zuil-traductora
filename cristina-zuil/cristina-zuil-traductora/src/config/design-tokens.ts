/**
 * Design Tokens Configuration
 * Centralized design system values for colors, typography, spacing, and layout
 */

export const designTokens = {
  // Colors
  colors: {
    black: '#000000',
    white: '#ffffff',
  },

  // Responsive breakpoints with grid configuration
  // sm: < 610px, md: 610px - 1190px, lg: >= 1191px
  breakpoints: {
    sm: {
      breakpoint: '610px', // Used as md start point
      columns: 4,
      gap: '16px',
      padding: '16px',
    },
    md: {
      breakpoint: '610px', // Start of md range
      columns: 8,
      gap: '24px',
      padding: '32px',
    },
    lg: {
      breakpoint: '1191px', // Start of lg range
      columns: 12,
      gap: '32px',
      padding: '48px',
    },
  },

  // Container max-width (applies when viewport >= lg breakpoint)
  containerMaxWidth: '1440px',

  // Typography - Responsive font styles
  fonts: {
    // Font families - reference the font names defined in fonts.css
    families: {
      primary: 'YourFontName, sans-serif',
      secondary: 'YourSecondaryFont, serif',
    },

    // Typography styles with responsive variants
    // Reference font families from families object above
    styles: {
      'headline-1': {
        sm: {
          fontFamily: 'primary', // References fonts.families.primary
          fontSize: '2rem',
          fontWeight: 700,
          lineHeight: 1.2,
          letterSpacing: '-0.02em',
        },
        md: {
          fontFamily: 'primary',
          fontSize: '2.5rem',
          fontWeight: 700,
          lineHeight: 1.2,
          letterSpacing: '-0.02em',
        },
        lg: {
          fontFamily: 'primary',
          fontSize: '3rem',
          fontWeight: 700,
          lineHeight: 1.2,
          letterSpacing: '-0.02em',
        },
      },
    },
  },
} as const;

// Helper functions for responsive design
export const mediaQueries = {
  sm: `@media (min-width: ${designTokens.breakpoints.sm.breakpoint})`,
  md: `@media (min-width: ${designTokens.breakpoints.md.breakpoint})`,
  lg: `@media (min-width: ${designTokens.breakpoints.lg.breakpoint})`,
} as const;

// Helper function to get font style for a specific breakpoint
export function getFontStyle(
  styleName: keyof typeof designTokens.fonts.styles,
  breakpoint: 'sm' | 'md' | 'lg' = 'md'
) {
  const style = designTokens.fonts.styles[styleName][breakpoint];
  // Resolve font family reference
  const fontFamilyKey = style.fontFamily as keyof typeof designTokens.fonts.families;
  const resolvedFontFamily = designTokens.fonts.families[fontFamilyKey] || style.fontFamily;
  
  return {
    ...style,
    fontFamily: resolvedFontFamily,
  };
}

// Helper function to generate CSS for a font style
export function getFontCSS(
  styleName: keyof typeof designTokens.fonts.styles,
  breakpoint: 'sm' | 'md' | 'lg' = 'md'
) {
  const style = getFontStyle(styleName, breakpoint);
  return `
    font-family: ${style.fontFamily};
    font-size: ${style.fontSize};
    font-weight: ${style.fontWeight};
    line-height: ${style.lineHeight};
    letter-spacing: ${style.letterSpacing};
  `.trim();
}

// CSS custom properties generator (for use in CSS)
export function generateCSSVariables() {
  const cssVars: string[] = [];
  
  // Colors
  const colors = designTokens.colors as Record<string, string>;
  for (const key in colors) {
    if (colors.hasOwnProperty(key)) {
      cssVars.push(`--color-${key}: ${colors[key]};`);
    }
  }
  
  // Breakpoints
  const breakpoints = designTokens.breakpoints;
  for (const key in breakpoints) {
    if (breakpoints.hasOwnProperty(key)) {
      const value = breakpoints[key as keyof typeof breakpoints];
      cssVars.push(`--breakpoint-${key}: ${value.breakpoint};`);
      cssVars.push(`--grid-columns-${key}: ${value.columns};`);
      cssVars.push(`--grid-gap-${key}: ${value.gap};`);
      cssVars.push(`--container-padding-${key}: ${value.padding};`);
      if ('maxWidth' in value && value.maxWidth) {
        cssVars.push(`--container-max-width-${key}: ${value.maxWidth};`);
      }
    }
  }
  
  // Font families
  const fontFamilies = designTokens.fonts.families as Record<string, string>;
  for (const key in fontFamilies) {
    if (fontFamilies.hasOwnProperty(key)) {
      cssVars.push(`--font-family-${key}: ${fontFamilies[key]};`);
    }
  }
  
  return cssVars.join('\n  ');
}

// Type exports for TypeScript
export type DesignTokens = typeof designTokens;
export type Colors = typeof designTokens.colors;
export type Breakpoints = typeof designTokens.breakpoints;
export type FontStyles = typeof designTokens.fonts.styles;
