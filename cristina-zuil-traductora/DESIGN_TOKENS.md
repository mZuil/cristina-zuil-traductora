# Design Tokens Configuration

This project uses a centralized design tokens system for consistent styling across the application.

## Files

- **`src/config/design-tokens.ts`** - TypeScript configuration (single source of truth)

## Usage

### In TypeScript/JavaScript Components

```typescript
import { designTokens } from '../config/design-tokens';

// Use colors
const primaryColor = designTokens.colors.primary;

// Use breakpoints
const isMobile = window.innerWidth < parseInt(designTokens.breakpoints.md);

// Use spacing
const margin = designTokens.spacing.lg;
```

### In CSS/SCSS

```css
/* Use design tokens directly or generate CSS variables */
.my-element {
  color: var(--color-primary);
  padding: var(--spacing-md);
}

/* Responsive container using breakpoints */
.container {
  width: 100%;
  max-width: 640px; /* sm maxWidth */
  padding: 1rem; /* sm padding */
}

@media (min-width: 768px) {
  .container {
    max-width: 768px; /* md maxWidth */
    padding: 2rem; /* md padding */
  }
}

@media (min-width: 1024px) {
  .container {
    max-width: 1024px; /* lg maxWidth */
    padding: 3rem; /* lg padding */
  }
}
```

### In Astro Components

```astro
---
import { designTokens, getFontStyle } from '../config/design-tokens';

// Get breakpoint values
const smBreakpoint = designTokens.breakpoints.sm;
const mdBreakpoint = designTokens.breakpoints.md;
const lgBreakpoint = designTokens.breakpoints.lg;

// Get font style for a specific breakpoint
const headlineStyle = getFontStyle('headline-1', 'lg');
---

<div style={{
  color: designTokens.colors.primary,
  padding: designTokens.spacing.lg,
  maxWidth: designTokens.breakpoints.lg.maxWidth,
  fontFamily: headlineStyle.fontFamily,
  fontSize: headlineStyle.fontSize,
  fontWeight: headlineStyle.fontWeight,
  lineHeight: headlineStyle.lineHeight,
}}>
  Content
</div>
```

## Configuration

### Colors

Edit `design-tokens.ts` → `colors` to customize:
- Primary, secondary, accent colors
- Text colors
- Background colors
- Status colors (success, error, warning, info)
- Border colors

### Breakpoints & Grid System

Each breakpoint (`sm`, `md`, `lg`) contains:
- `breakpoint`: The media query breakpoint value (e.g., '640px')
- `columns`: Number of grid columns
- `gap`: Space between grid columns
- `padding`: Container padding
- `maxWidth`: Maximum container width

Example structure:
```typescript
breakpoints: {
  sm: {
    breakpoint: '640px',
    columns: 4,
    gap: '1rem',
    padding: '1rem',
    maxWidth: '640px',
  },
  // ... md and lg
}
```

### Typography

Font styles are organized by name (e.g., `headline-1`, `headline-2`, `body`) with responsive variants:

```typescript
fonts: {
  families: {
    primary: '...',
    secondary: '...',
    mono: '...',
  },
  styles: {
    'headline-1': {
      sm: {
        fontFamily: '...',
        fontSize: '...',
        fontWeight: ...,
        lineHeight: ...,
        letterSpacing: '...',
      },
      md: { ... },
      lg: { ... },
    },
    // ... more styles
  },
}
```

Each font style has responsive variants for `sm`, `md`, and `lg` breakpoints.

## Example: Responsive Container

```astro
---
import { designTokens } from '../config/design-tokens';
const { sm, md, lg } = designTokens.breakpoints;
---

<style>
  .container {
    width: 100%;
    max-width: {sm.maxWidth};
    margin: 0 auto;
    padding: {sm.padding};
  }

  @media (min-width: {md.breakpoint}) {
    .container {
      max-width: {md.maxWidth};
      padding: {md.padding};
    }
  }

  @media (min-width: {lg.breakpoint}) {
    .container {
      max-width: {lg.maxWidth};
      padding: {lg.padding};
    }
  }
</style>
```

## Example: Grid System

```astro
---
import { designTokens } from '../config/design-tokens';
const { sm, md, lg } = designTokens.breakpoints;
---

<style>
  .grid {
    display: grid;
    grid-template-columns: repeat({sm.columns}, 1fr);
    gap: {sm.gap};
  }

  @media (min-width: {md.breakpoint}) {
    .grid {
      grid-template-columns: repeat({md.columns}, 1fr);
      gap: {md.gap};
    }
  }

  @media (min-width: {lg.breakpoint}) {
    .grid {
      grid-template-columns: repeat({lg.columns}, 1fr);
      gap: {lg.gap};
    }
  }
</style>
```

## Example: Typography

```astro
---
import { getFontStyle } from '../config/design-tokens';
const headlineSm = getFontStyle('headline-1', 'sm');
const headlineMd = getFontStyle('headline-1', 'md');
const headlineLg = getFontStyle('headline-1', 'lg');
---

<style>
  h1 {
    font-family: {headlineSm.fontFamily};
    font-size: {headlineSm.fontSize};
    font-weight: {headlineSm.fontWeight};
    line-height: {headlineSm.lineHeight};
    letter-spacing: {headlineSm.letterSpacing};
  }

  @media (min-width: 768px) {
    h1 {
      font-family: {headlineMd.fontFamily};
      font-size: {headlineMd.fontSize};
      font-weight: {headlineMd.fontWeight};
      line-height: {headlineMd.lineHeight};
      letter-spacing: {headlineMd.letterSpacing};
    }
  }

  @media (min-width: 1024px) {
    h1 {
      font-family: {headlineLg.fontFamily};
      font-size: {headlineLg.fontSize};
      font-weight: {headlineLg.fontWeight};
      line-height: {headlineLg.lineHeight};
      letter-spacing: {headlineLg.letterSpacing};
    }
  }
</style>
```

## Updating Values

Edit `src/config/design-tokens.ts` - this is your single source of truth for all design values.

**Tip**: Use the `generateCSSVariables()` function if you need to generate CSS custom properties for use in external stylesheets.
