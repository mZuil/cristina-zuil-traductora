/**
 * Design Tokens Configuration
 * Centralized design system values for colors, typography, spacing, and layout
 */

export const designTokens = {
  // Colors
  colors: {
    white: '#ffffff',
    blue_dark: '#06052E',
    blue_light: '#89DBE6',
    blue_default: '#004FFF',
    blue_lighter: '#AAE5EC',
    blue_lightest: '#E8F4FF',
    grey: '#0D1B2A60',
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
      primary: 'MuseoModerno, serif',
      secondary: 'Google Sans, sans-serif',
    },

    // Typography styles with responsive variants
    // Reference font families from families object above
    styles: {
      'display-1': {
        sm: {
          fontFamily: 'primary',
          fontSize: 'clamp(90px, 10.28vw, 180px)',
          fontWeight: 700,
          lineHeight: 1.05,
          letterSpacing: '0.03em',
          textTransform: 'uppercase',
        },
        md: {},
        lg: {},
      },

      'headline-1': {
        sm: {
          fontFamily: 'secondary',
          fontSize: '40px',
          fontWeight: 700,
          lineHeight: 1.1,
          letterSpacing: '0',
        },
        md: {},
        lg: {},
      },

      'headline-2': {
        sm: {
          fontFamily: 'secondary',
          fontSize: '28px',
          fontWeight: 700,
          lineHeight: 0.99,
          letterSpacing: '0',
        },
        md: {},
        lg: {},
      },

      'subheading-1': {
        sm: {
          fontFamily: 'secondary',
          fontSize: '24px',
          fontWeight: 400,
          lineHeight: 1.21,
          letterSpacing: '0.03em',
        },
        md: {},
        lg: {},
      },

      'subheading-2': {
        sm: {
          fontFamily: 'secondary',
          fontSize: '20px',
          fontWeight: 400,
          lineHeight: 1.21,
          letterSpacing: '0.03em',
        },
        md: {},
        lg: {},
      },

      'menu-item': {
        sm: {
          fontFamily: 'secondary',
          fontSize: '20px',
          fontWeight: 700,
          lineHeight: 1,
          letterSpacing: '0',
        },
        md: {},
        lg: {},
      },

      'body': {
        sm: {
          fontFamily: 'secondary',
          fontSize: '20px',
          fontWeight: 400,
          lineHeight: 1.2,
          letterSpacing: '0',
        },
        md: {},
        lg: {},
      },

      'tagline': {
        sm: {
          fontFamily: 'secondary',
          fontSize: '16px',
          fontWeight: 700,
          lineHeight: 1.81,
          letterSpacing: '-0.01em',
          textTransform: 'uppercase',
        },
        md: {},
        lg: {},
      },

      'small-text': {
        sm: {
          fontFamily: 'secondary',
          fontSize: '16px',
          fontWeight: 400,
          lineHeight: 1.2,
          letterSpacing: '0',
        },
        md: {},
        lg: {},
      },

      'caption': {
        sm: {
          fontFamily: 'secondary',
          fontSize: '12px',
          fontWeight: 400,
          lineHeight: 1.2,
          letterSpacing: '-0.01em',
        },
        md: {},
        lg: {},
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
  const stylesByBreakpoint = designTokens.fonts.styles[styleName] as Record<string, Record<string, unknown>>;

  const smStyle = (stylesByBreakpoint.sm ?? {}) as Record<string, unknown>;
  const mdStyle = (stylesByBreakpoint.md ?? {}) as Record<string, unknown>;
  const lgStyle = (stylesByBreakpoint.lg ?? {}) as Record<string, unknown>;

  const hasKeys = (obj: Record<string, unknown>) => Object.keys(obj).length > 0;

  const merged = {
    ...smStyle,
    ...(breakpoint === 'sm' ? {} : hasKeys(mdStyle) ? mdStyle : {}),
    ...(breakpoint === 'lg' && hasKeys(lgStyle) ? lgStyle : {}),
  } as typeof designTokens.fonts.styles[keyof typeof designTokens.fonts.styles]['sm'];

  const fontFamilyKey = merged.fontFamily as keyof typeof designTokens.fonts.families;
  const resolvedFontFamily = designTokens.fonts.families[fontFamilyKey] || merged.fontFamily;

  return {
    ...merged,
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
