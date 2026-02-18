# Font Setup Guide

## Folder Structure

Each font has its own folder in `/public/fonts/` and its own CSS file in `/src/styles/fonts/`:

```
/public/
  /fonts/
    /YourFontName/
      - YourFontName-Regular.woff2
      - YourFontName-Regular.woff
      - YourFontName-Bold.woff2
      - YourFontName-Bold.woff
      - YourFontName-Light.woff2
      - YourFontName-Light.woff
    /YourSecondaryFont/
      - YourSecondaryFont-Regular.woff2
      - YourSecondaryFont-Bold.woff2
      ...

/src/styles/
  /fonts/
    - YourFontName.css
    - YourSecondaryFont.css
  - fonts.css (imports all individual font files)
```

## Supported Font Formats

- **.woff2** (recommended - best compression)
- **.woff** (fallback)
- **.otf** (OpenType)
- **.ttf** (TrueType)

## How to Set Up Fonts

### 1. Add Font Files

Create a folder for your font in `/public/fonts/` and place your font files there:

```
/public/fonts/YourFontName/
  - YourFontName-Regular.woff2
  - YourFontName-Regular.woff
  - YourFontName-Bold.woff2
  - YourFontName-Bold.woff
  - YourFontName-Light.woff2
  - YourFontName-Light.woff
```

### 2. Create Individual Font CSS File

Create a new file `src/styles/fonts/YourFontName.css`:

```css
@font-face {
  font-family: 'YourFontName';
  src: url('/fonts/YourFontName/YourFontName-Regular.woff2') format('woff2'),
       url('/fonts/YourFontName/YourFontName-Regular.woff') format('woff');
  font-weight: 400;  /* Regular */
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'YourFontName';
  src: url('/fonts/YourFontName/YourFontName-Bold.woff2') format('woff2'),
       url('/fonts/YourFontName/YourFontName-Bold.woff') format('woff');
  font-weight: 700;  /* Bold */
  font-style: normal;
  font-display: swap;
}
```

### 3. Import in Main Fonts File

Add the import to `src/styles/fonts.css`:

```css
@import './fonts/YourFontName.css';
```

### 4. Update Design Tokens

Edit `src/config/design-tokens.ts`:

```typescript
fonts: {
  families: {
    primary: 'YourFontName, sans-serif',  // Match the font-family name from @font-face
    secondary: 'YourSecondaryFont, serif',
  },
  styles: {
    'headline-1': {
      sm: {
        fontFamily: 'primary',  // References families.primary
        fontSize: '2rem',
        fontWeight: 700,  // Uses Bold weight
        // ...
      },
    },
  },
}
```

### 5. Update CSS Variables

Edit `src/styles/global.css` (in the `:root` section):

```css
:root {
  --font-family-primary: YourFontName, sans-serif;
  --font-family-secondary: YourSecondaryFont, serif;
}
```

## Font Weight Values

- `100` - Thin / Hairline
- `200` - Extra Light
- `300` - Light
- `400` - Regular / Normal
- `500` - Medium
- `600` - Semi Bold
- `700` - Bold
- `800` - Extra Bold
- `900` - Black / Heavy

## Usage in CSS

```css
/* Using CSS variables */
.my-element {
  color: var(--color-black);
  font-family: var(--font-family-primary);
  font-weight: 700;
}

/* Using breakpoints */
.container {
  padding: var(--container-padding-sm);
}

@media (min-width: 768px) {
  .container {
    padding: var(--container-padding-md);
  }
}
```

## Converting Fonts

If you have .otf or .ttf files, convert them to .woff2 for better performance:

**Online tools:**
- https://cloudconvert.com/
- https://www.fontsquirrel.com/tools/webfont-generator

**Command line (using fonttools):**
```bash
pip install fonttools[woff]
pyftsubset YourFont.otf --output-file=YourFont.woff2 --flavor=woff2
```

## Best Practices

1. **Use .woff2** - Best compression, modern browsers support it
2. **Include .woff fallback** - For older browsers
3. **Use `font-display: swap`** - Prevents invisible text during font load
4. **Only load weights you need** - Don't load all weights if you only use Regular and Bold
5. **Subset fonts** - Remove unused characters to reduce file size
