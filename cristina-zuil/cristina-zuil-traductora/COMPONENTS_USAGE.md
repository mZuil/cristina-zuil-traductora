# CustomContainer and CustomColumn Components

Reusable layout components for responsive grid layouts using design tokens.

## Components

### CustomContainer
A combined container and grid that:
- Fits the screen width
- Has max-width on large screens (from design tokens)
- Has responsive padding (sm, md, lg)
- Uses CSS Grid with responsive column counts (4 on sm, 8 on md, 12 on lg)
- Has responsive gaps between columns

### CustomColumn
A grid column that:
- Spans a specified number of columns per breakpoint
- Can be pushed (offset) from the start
- Responsive: different spans/offsets for sm, md, lg

## Usage Examples

### Basic Grid Layout

```astro
---
import CustomContainer from '../components/CustomContainer.astro';
import CustomColumn from '../components/CustomColumn.astro';
---

<CustomContainer>
  <CustomColumn sm={4} md={6} lg={4}>
    <p>Column 1</p>
  </CustomColumn>
  <CustomColumn sm={4} md={6} lg={4}>
    <p>Column 2</p>
  </CustomColumn>
  <CustomColumn sm={4} md={6} lg={4}>
    <p>Column 3</p>
  </CustomColumn>
</CustomContainer>
```

### Column with Push (Offset)

```astro
---
import CustomContainer from '../components/CustomContainer.astro';
import CustomColumn from '../components/CustomColumn.astro';
---

<CustomContainer>
  <!-- This column starts at column 2 on large screens (pushed 1 column) -->
  <CustomColumn sm={4} md={3} lg-push={1} lg={4}>
    <p>Offset column</p>
  </CustomColumn>
  <CustomColumn sm={4} md={3} lg={4}>
    <p>Next column</p>
  </CustomColumn>
</CustomContainer>
```

### Complex Layout Example

```astro
---
import CustomContainer from '../components/CustomContainer.astro';
import CustomColumn from '../components/CustomColumn.astro';
---

<CustomContainer>
  <!-- Sidebar: 4 columns on all screens -->
  <CustomColumn sm={4} md={2} lg={3}>
    <aside>Sidebar</aside>
  </CustomColumn>
  
  <!-- Main content: 4 columns on sm, 6 on md, 8 on lg -->
  <CustomColumn sm={4} md={6} lg={8}>
    <main>
      <h1>Main Content</h1>
      <p>This is the main content area.</p>
    </main>
  </CustomColumn>
  
  <!-- Right sidebar: 4 columns on sm, 6 on md, starts at column 12 on lg (pushed) -->
  <CustomColumn sm={4} md={6} lg-push={11} lg={1}>
    <aside>Right sidebar</aside>
  </CustomColumn>
</CustomContainer>
```

## Props

### CustomContainer
- `class` (optional): Additional CSS classes

### CustomColumn
- `sm` (optional): Number of columns to span on small screens (1-4)
- `md` (optional): Number of columns to span on medium screens (1-8)
- `lg` (optional): Number of columns to span on large screens (1-12)
- `sm-push` (optional): Number of columns to push from start on small screens
- `md-push` (optional): Number of columns to push from start on medium screens
- `lg-push` (optional): Number of columns to push from start on large screens
- `class` (optional): Additional CSS classes

## Grid System

Based on design tokens:
- **Small (sm)**: 4 columns, 1rem gap, 1rem padding
- **Medium (md)**: 8 columns, 1.5rem gap, 2rem padding
- **Large (lg)**: 12 columns, 2rem gap, 3rem padding, max-width: 1024px

## Notes

- If you don't specify `sm`, the column will be full width on mobile
- `push` values create an offset (empty space) before the column
- Columns automatically wrap to the next row when they exceed the grid width
- All values are based on your design tokens and will update automatically if you change them
