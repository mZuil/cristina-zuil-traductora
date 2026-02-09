# Astro Best Practices

## Component Organization

### ✅ Recommended: Keep Everything Together

For most components, keep HTML, CSS, and JS in a single `.astro` file:

```astro
---
// 1. Frontmatter: TypeScript/JavaScript (runs on server)
interface Props {
  title: string;
}

const { title } = Astro.props;
---

<!-- 2. HTML Template -->
<div class="my-component">
  <h1>{title}</h1>
</div>

<style>
  /* 3. Scoped CSS - automatically scoped to this component */
  .my-component {
    color: var(--color-black);
  }
</style>

<script>
  // 4. Client-side JavaScript - only runs in browser
  // Has access to document, window, etc.
  document.addEventListener('DOMContentLoaded', () => {
    console.log('Component loaded');
  });
</script>
```

### Benefits of Keeping Together

1. **Scoped Styles** - Astro automatically adds unique class names
2. **Better Performance** - Astro optimizes and bundles everything
3. **Easier Maintenance** - Related code stays together
4. **No SSR Issues** - Scripts in `<script>` tags only run on client
5. **Type Safety** - TypeScript in frontmatter works seamlessly

## When to Separate Files

### CSS Files

**Separate when:**
- ✅ **Shared styles** - Used by multiple components
- ✅ **Very large** - 200+ lines of CSS
- ✅ **Third-party** - External CSS libraries
- ✅ **Global styles** - Already handled in `styles/global.css`

**How to import:**
```astro
---
import './Component.css'; // ✅ Works fine in frontmatter
---
```

### JavaScript Files

**Separate when:**
- ✅ **Shared utilities** - Functions used by multiple components
- ✅ **Complex logic** - Heavy calculations
- ✅ **Reusable modules** - Imported by many components

**How to import:**
```astro
---
// ❌ DON'T import DOM-dependent JS in frontmatter
// import './component.js'; // Can run during SSR!
---

<div>...</div>

<script>
  // ✅ DO import in script tags (runs on client only)
  import { utility } from '../../utils/helpers.js';
  
  // Component-specific client code
  document.getElementById('...');
</script>
```

## Critical Rules

### ❌ Never Import DOM-Dependent JS in Frontmatter

```astro
---
import './dom-manipulation.js'; // ❌ BAD - runs during SSR
// document is not defined!
---
```

### ✅ Always Use Script Tags for DOM Code

```astro
<script>
  // ✅ GOOD - only runs on client
  document.getElementById('...');
  window.addEventListener('resize', ...);
</script>
```

## File Organization Patterns

### Pattern 1: Simple Component (Recommended)
```
Button/
└── Button.astro  # Everything in one file
```

### Pattern 2: Component with Shared CSS
```
Card/
├── Card.astro
└── Card.css  # Shared styles
```

### Pattern 3: Component with Utilities
```
ComplexComponent/
├── ComplexComponent.astro
└── utils.js  # Imported in <script> tag, not frontmatter
```

## Current Project Structure

Based on these practices, your current structure is good:

- ✅ **CSS separated** - `CustomContainer.css` imported in frontmatter (works fine)
- ✅ **JS in script tags** - JavaScript moved to `<script>` tags (correct)
- ✅ **Scoped styles** - Component-specific CSS stays with component

## Summary

**Default approach:** Keep everything in one `.astro` file

**Separate when:**
- CSS: Shared or very large stylesheets
- JS: Shared utilities (import in `<script>` tags, not frontmatter)

**Never:** Import DOM-dependent JavaScript in frontmatter
