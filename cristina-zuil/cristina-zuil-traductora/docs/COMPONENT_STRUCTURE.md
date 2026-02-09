# Component Structure

This project follows **Atomic Design** principles with separate folders for **Structure** and **SEO** features.

## Folder Organization

```
src/
├── components/          # UI Components (Atomic Design)
│   ├── atoms/           # Smallest components (buttons, inputs, labels, icons)
│   ├── blocks/          # Simple groups of atoms (form fields, cards)
│   ├── modules/         # Complex groups (navigation, headers, footers)
│   └── components/      # Full page sections (hero, testimonials, features)
│
├── structure/           # Layout & Grid System (Infrastructure)
│   ├── CustomContainer/    # Container + Grid component
│   ├── CustomColumn/        # Grid column component
│   ├── GridOverlay/         # Grid overlay toggle
│   └── DesignTokens/        # CSS variables generator
│
└── features/            # Feature-specific components
    └── seo/                # SEO components (SEOHead, etc.)
```

## Atomic Design Principles

### Atoms
- **Smallest, indivisible components**
- Cannot be broken down further
- Examples: Button, Input, Label, Icon, Badge
- Location: `components/atoms/`

### Blocks
- **Simple groups of atoms working together**
- Basic compositions
- Examples: FormField (Label + Input), Card (Image + Title + Text), ButtonGroup
- Location: `components/blocks/`

### Modules
- **Complex UI sections**
- Multiple blocks and atoms
- Examples: Navigation, Header, Footer, Sidebar, SearchBar
- Location: `components/modules/`

### Components
- **Full page sections**
- Complete, reusable sections
- Examples: Hero, Testimonials, Features, Pricing, ContactForm
- Location: `components/components/`

## Structure Components

Layout and grid system infrastructure:
- `CustomContainer` - Responsive container with grid
- `CustomColumn` - Grid column with responsive spans
- `GridOverlay` - Grid overlay toggle (Cmd/Ctrl+Shift+G)

**Location**: `structure/` (at `src/` level, not in `components/`)

## Feature Components

Feature-specific components that don't fit atomic design:
- `seo/` - SEO-related components (SEOHead, etc.)

**Location**: `features/` (at `src/` level)

## Component File Organization

Each component can be organized in two ways:

### Option 1: Single File (Simple Components)
```
ComponentName.astro
```

### Option 2: Folder Structure (Complex Components)
```
ComponentName/
├── ComponentName.astro    # Main component file
├── ComponentName.css      # Styles (if separated)
└── ComponentName.js       # Scripts (if separated)
```

## Astro Best Practices

### Keep Everything Together (Recommended)

**For most components, keep HTML, CSS, and JS in one `.astro` file:**

```astro
---
// Frontmatter: TypeScript/JavaScript logic
---

<!-- HTML template -->
<div class="my-component">...</div>

<style>
  /* Scoped CSS - automatically scoped to this component */
  .my-component { ... }
</style>

<script>
  // Client-side JavaScript - only runs in browser
  // Has access to document, window, etc.
</script>
```

**Benefits:**
- ✅ **Scoped styles** - Astro automatically scopes CSS to the component
- ✅ **Better performance** - Astro optimizes and bundles everything
- ✅ **Easier maintenance** - Related code stays together
- ✅ **No SSR issues** - Scripts in `<script>` tags only run on client
- ✅ **Type safety** - TypeScript in frontmatter works seamlessly

### When to Separate Files

**Separate CSS files:**
- ✅ **Shared styles** - Styles used by multiple components
- ✅ **Very large stylesheets** - 200+ lines of CSS
- ✅ **Third-party CSS** - External libraries
- ✅ **Global styles** - Already in `styles/global.css`

**Separate JavaScript files:**
- ✅ **Shared utilities** - Functions used by multiple components
- ✅ **Complex logic** - Heavy calculations or data processing
- ✅ **Reusable modules** - Imported by many components
- ⚠️ **Important**: Import JS in `<script>` tags, NOT in frontmatter

**Example of proper JS separation:**
```astro
---
// Frontmatter - server-side only
---

<div>...</div>

<script>
  // Import shared utilities here (runs on client)
  import { someUtility } from '../../utils/helpers.js';
  
  // Component-specific client code
  document.addEventListener('click', ...);
</script>
```

### Anti-Patterns to Avoid

❌ **Don't import JS in frontmatter for DOM manipulation:**
```astro
---
import './component.js'; // ❌ Can run during SSR, document not available
---
```

✅ **Do use script tags:**
```astro
<script>
  // ✅ Only runs on client, document available
  document.getElementById('...');
</script>
```

## Import Examples

```astro
---
// Structure components (layout/grid)
import CustomContainer from '../structure/CustomContainer/CustomContainer.astro';
import CustomColumn from '../structure/CustomColumn/CustomColumn.astro';
import GridOverlay from '../structure/GridOverlay/GridOverlay.astro';

// Feature components
import SEOHead from '../features/seo/SEOHead.astro';

// Structure components
import DesignTokens from '../structure/DesignTokens/DesignTokens.astro';

// Atomic components
import Button from '../components/atoms/Button/Button.astro';
import Card from '../components/blocks/Card/Card.astro';
import Navigation from '../components/modules/Navigation/Navigation.astro';
import Hero from '../components/components/Hero/Hero.astro';
---
```

## Best Practices

1. **Start simple**: Use single `.astro` files for new components
2. **Separate when needed**: Only split into folders when files get large
3. **Consistent naming**: Use PascalCase for component folders and files
4. **Group related code**: Keep CSS/JS close to the component that uses them
5. **Document complex logic**: Add comments for non-obvious code
6. **Structure vs Components**: 
   - Use `structure/` for layout/grid infrastructure
   - Use `components/` for UI components following atomic design
   - Use `features/` for feature-specific components

## Current Structure

### Structure (`src/structure/`)
- `CustomContainer/` - Container with grid system
- `CustomColumn/` - Grid column with responsive spans
- `GridOverlay/` - Grid overlay toggle

### Features (`src/features/`)
- `seo/SEOHead.astro` - SEO meta tags component

### Components (`src/components/`)
- Ready for atomic design components (atoms, blocks, modules, components)
