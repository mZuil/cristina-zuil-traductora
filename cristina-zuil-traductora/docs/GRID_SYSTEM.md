# Grid System Documentation

This document explains how to use the CustomContainer and CustomColumn components to create responsive grid layouts.

## Table of Contents

- [Overview](#overview)
- [Breakpoints](#breakpoints)
- [CustomContainer](#customcontainer)
- [CustomColumn](#customcolumn)
- [Usage Examples](#usage-examples)
- [Best Practices](#best-practices)

## Overview

The grid system is built on two main components:
- **CustomContainer**: A responsive container that centers content and applies padding
- **CustomColumn**: Grid columns that can span a specific number of columns at different breakpoints

All values (breakpoints, column counts, gaps, padding) are defined in `src/config/design-tokens.ts` and automatically generate the necessary CSS.

## Breakpoints

The grid system uses three breakpoints:

- **Small (sm)**: `< 610px` - 4 columns
- **Medium (md)**: `610px - 1190px` - 8 columns  
- **Large (lg)**: `>= 1191px` - 12 columns

These breakpoints are defined in `src/config/design-tokens.ts` and can be customized there.

## CustomContainer

The `CustomContainer` component provides a responsive container that:
- Centers content with `margin-inline: auto`
- Applies responsive padding (16px on sm, 32px on md, 48px on lg)
- Has a max-width of 1440px on large screens
- Uses flexbox with responsive column gaps

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `full` | `boolean` | `false` | If `true`, removes max-width constraint (full viewport width) |
| `class` | `string` | `''` | Additional CSS classes |
| `id` | `string` | `undefined` | HTML id attribute |

### Basic Usage

```astro
---
import CustomContainer from '../structure/CustomContainer/CustomContainer.astro';
---

<CustomContainer>
  <p>Your content here</p>
</CustomContainer>
```

### Full Width Container

```astro
<CustomContainer full>
  <p>This container spans the full viewport width</p>
</CustomContainer>
```

## CustomColumn

The `CustomColumn` component creates grid columns that can span different numbers of columns at different breakpoints.

### Props

| Prop | Type | Description |
|------|------|-------------|
| `sm` | `string` | Number of columns to span on small screens (1-4) |
| `md` | `string` | Number of columns to span on medium screens (1-8) |
| `lg` | `string` | Number of columns to span on large screens (1-12) |
| `sm-push` | `string` | Number of columns to push (offset) on small screens |
| `md-push` | `string` | Number of columns to push (offset) on medium screens |
| `lg-push` | `string` | Number of columns to push (offset) on large screens |
| `class` | `string` | Additional CSS classes |
| `id` | `string` | HTML id attribute |

### Column Spanning

Columns can span 1 to N columns where N is the maximum columns for that breakpoint:
- Small: 1-4 columns
- Medium: 1-8 columns
- Large: 1-12 columns

### Push (Offset)

Push values create an offset (empty space) before the column. This is useful for centering content or creating asymmetrical layouts.

## Usage Examples

### Basic Grid Layout

```astro
---
import CustomContainer from '../structure/CustomContainer/CustomContainer.astro';
import CustomColumn from '../structure/CustomColumn/CustomColumn.astro';
---

<CustomContainer>
  <CustomColumn sm="4" md="4" lg="4">
    <p>Column 1 - Takes 4 columns on all screens</p>
  </CustomColumn>
  <CustomColumn sm="4" md="4" lg="4">
    <p>Column 2 - Takes 4 columns on all screens</p>
  </CustomColumn>
  <CustomColumn sm="4" md="4" lg="4">
    <p>Column 3 - Takes 4 columns on all screens</p>
  </CustomColumn>
</CustomContainer>
```

### Responsive Column Layout

```astro
<CustomContainer>
  <!-- Full width on mobile, half width on tablet, 1/3 width on desktop -->
  <CustomColumn sm="4" md="4" lg="4">
    <p>Column 1</p>
  </CustomColumn>
  <CustomColumn sm="4" md="4" lg="4">
    <p>Column 2</p>
  </CustomColumn>
  <CustomColumn sm="4" md="4" lg="4">
    <p>Column 3</p>
  </CustomColumn>
</CustomContainer>
```

### Column with Push (Offset)

```astro
<CustomContainer>
  <!-- This column starts at column 2 on large screens (pushed 1 column) -->
  <CustomColumn sm="4" md="8" lg="4" lg-push="1">
    <p>Offset column - starts after 1 column on desktop</p>
  </CustomColumn>
</CustomContainer>
```

### Complex Layout Example

```astro
<CustomContainer>
  <!-- Sidebar: 4 columns on mobile, 2 on tablet, 3 on desktop -->
  <CustomColumn sm="4" md="2" lg="3">
    <aside>
      <h2>Sidebar</h2>
      <p>Navigation or secondary content</p>
    </aside>
  </CustomColumn>
  
  <!-- Main content: 4 columns on mobile, 6 on tablet, 8 on desktop -->
  <CustomColumn sm="4" md="6" lg="8">
    <main>
      <h1>Main Content</h1>
      <p>Primary content area</p>
    </main>
  </CustomColumn>
  
  <!-- Right sidebar: 4 columns on mobile, 6 on tablet, starts at column 12 on desktop (pushed) -->
  <CustomColumn sm="4" md="6" lg-push="11" lg="1">
    <aside>
      <p>Right sidebar</p>
    </aside>
  </CustomColumn>
</CustomContainer>
```

### Centered Content

```astro
<CustomContainer>
  <!-- Center a column by pushing it -->
  <!-- On lg: 12 columns total, 4 column width, push 4 = centered -->
  <CustomColumn sm="4" md="8" lg="4" lg-push="4">
    <div>
      <h1>Centered Content</h1>
      <p>This content is centered on large screens</p>
    </div>
  </CustomColumn>
</CustomContainer>
```

### Full Width Sections

```astro
<!-- Full width section (no container) -->
<section>
  <h1>Full Width Section</h1>
</section>

<!-- Container with content -->
<CustomContainer>
  <CustomColumn sm="4" md="8" lg="12">
    <p>Content that spans full width inside container</p>
  </CustomColumn>
</CustomContainer>
```

## Best Practices

### 1. Always Use CustomContainer

Wrap your grid layouts in `CustomContainer` to ensure proper padding and centering:

```astro
<!-- ✅ Good -->
<CustomContainer>
  <CustomColumn sm="4" lg="6">Content</CustomColumn>
</CustomContainer>

<!-- ❌ Bad - columns won't have proper spacing -->
<CustomColumn sm="4" lg="6">Content</CustomColumn>
```

### 2. Column Spans Should Add Up

On each breakpoint, your column spans should add up to the total columns (or less):

```astro
<!-- ✅ Good - 4 + 4 + 4 = 12 columns on lg -->
<CustomContainer>
  <CustomColumn sm="4" lg="4">Column 1</CustomColumn>
  <CustomColumn sm="4" lg="4">Column 2</CustomColumn>
  <CustomColumn sm="4" lg="4">Column 3</CustomColumn>
</CustomContainer>

<!-- ✅ Also good - 6 + 6 = 12 columns on lg -->
<CustomContainer>
  <CustomColumn sm="4" lg="6">Column 1</CustomColumn>
  <CustomColumn sm="4" lg="6">Column 2</CustomColumn>
</CustomContainer>
```

### 3. Mobile-First Approach

Always define `sm` values. If you don't specify `md` or `lg`, the `sm` value will be used:

```astro
<!-- ✅ Good - explicit for all breakpoints -->
<CustomColumn sm="4" md="4" lg="6">Content</CustomColumn>

<!-- ✅ Also good - sm value used for md and lg -->
<CustomColumn sm="4">Content</CustomColumn>
```

### 4. Use Push for Offsets

Use `push` props instead of empty columns for offsets:

```astro
<!-- ✅ Good - uses push -->
<CustomColumn sm="4" lg="4" lg-push="2">Content</CustomColumn>

<!-- ❌ Bad - creates empty column -->
<CustomColumn sm="4" lg="2"></CustomColumn>
<CustomColumn sm="4" lg="4">Content</CustomColumn>
```

### 5. Responsive Design

Design for mobile first, then enhance for larger screens:

```astro
<!-- Mobile: 1 column, Tablet: 2 columns, Desktop: 3 columns -->
<CustomContainer>
  <CustomColumn sm="4" md="4" lg="4">Item 1</CustomColumn>
  <CustomColumn sm="4" md="4" lg="4">Item 2</CustomColumn>
  <CustomColumn sm="4" md="4" lg="4">Item 3</CustomColumn>
</CustomContainer>
```

## Customization

All grid values can be customized in `src/config/design-tokens.ts`:

```typescript
breakpoints: {
  sm: {
    breakpoint: '610px',
    columns: 4,      // Change this to modify sm columns
    gap: '16px',     // Change this to modify sm gap
    padding: '16px', // Change this to modify sm padding
  },
  md: {
    breakpoint: '610px',
    columns: 8,      // Change this to modify md columns
    gap: '24px',
    padding: '32px',
  },
  lg: {
    breakpoint: '1191px',
    columns: 12,     // Change this to modify lg columns
    gap: '32px',
    padding: '48px',
  },
},
containerMaxWidth: '1440px', // Change this to modify max container width
```

After changing values in `design-tokens.ts`, the CSS will automatically regenerate on the next build.

## Troubleshooting

### Columns Overflowing Container

If columns are overflowing the container, check that:
1. Column spans add up correctly for each breakpoint
2. You're using `CustomContainer` to wrap your columns
3. The container has the correct max-width

### Columns Not Aligning

If columns aren't aligning properly:
1. Ensure all columns in a row have the same breakpoint values defined
2. Check that push values don't exceed available space
3. Verify breakpoint values in `design-tokens.ts`

### Responsive Behavior Not Working

If responsive behavior isn't working:
1. Check that breakpoint values in `design-tokens.ts` are correct
2. Verify media queries are being generated (check browser dev tools)
3. Clear build cache and rebuild
