# Documentation

This directory contains all documentation for the project.

## Available Documentation

- **[Grid System](./GRID_SYSTEM.md)** - Complete guide to using CustomContainer and CustomColumn components
- **[Component Structure](./COMPONENT_STRUCTURE.md)** - Atomic design principles and folder organization
- **[Astro Best Practices](./ASTRO_BEST_PRACTICES.md)** - Best practices for Astro development
- **[Fonts Setup](./FONTS_SETUP.md)** - Guide for setting up custom fonts

## Quick Links

### Grid System
- [CustomContainer Usage](./GRID_SYSTEM.md#customcontainer)
- [CustomColumn Usage](./GRID_SYSTEM.md#customcolumn)
- [Usage Examples](./GRID_SYSTEM.md#usage-examples)
- [Best Practices](./GRID_SYSTEM.md#best-practices)

### Development
- [Component Organization](./COMPONENT_STRUCTURE.md)
- [Astro Best Practices](./ASTRO_BEST_PRACTICES.md)
- [Font Setup](./FONTS_SETUP.md)

## Getting Started

1. **Setting up the Grid System**: Read [Grid System Documentation](./GRID_SYSTEM.md)
2. **Understanding Components**: Read [Component Structure](../src/components/COMPONENT_STRUCTURE.md)
3. **Adding Custom Fonts**: Follow [Fonts Setup Guide](../FONTS_SETUP.md)

## Project Structure

```
src/
├── structure/          # Layout infrastructure (containers, grid, design tokens)
│   ├── CustomContainer/
│   ├── CustomColumn/
│   ├── DesignTokens/
│   └── GridOverlay/
├── features/           # Feature-specific components (SEO, etc.)
├── components/        # UI components (atoms, blocks, modules)
├── config/            # Configuration files (i18n, design-tokens)
└── styles/            # Global styles and fonts
```

## Customization

All design values are centralized in `src/config/design-tokens.ts`. This includes:
- Colors
- Breakpoints
- Grid configuration (columns, gaps, padding)
- Typography
- Container max-width

Changes to design tokens automatically update the generated CSS.
