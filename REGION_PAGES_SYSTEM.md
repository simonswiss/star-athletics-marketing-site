# Region-Based Pages System

## Overview

The pages system has been restructured into 3 separate collections to prevent coaches from accidentally creating pages in the wrong region:

1. **Sydney Pages** - For Sydney-specific content
2. **Woopi Pages** - For Woopi-specific content
3. **General Pages** - For content not specific to any region

## File Organization

```
src/content/pages/
├── sydney/           # Sydney-specific pages
│   ├── schools.yaml
│   └── holiday-camps.yaml
├── woopi/            # Woopi-specific pages
│   ├── schools.yaml
│   └── holiday-camps.yaml
└── general/          # General/global pages
    ├── about.yaml
    └── contact.yaml
```

## Route Mapping

- **Sydney pages**: `/sydney/[slug]` → `src/content/pages/sydney/[slug].yaml`
- **Woopi pages**: `/woopi/[slug]` → `src/content/pages/woopi/[slug].yaml`
- **General pages**: `/[slug]` → `src/content/pages/general/[slug].yaml`

## Keystatic Admin Interface

In the Keystatic admin, coaches will see:

### Sydney Section

- **Sydney Pages** - Create pages that appear under `/sydney/`
- Sydney Sessions (existing)
- Other Sydney-specific content

### Woopi Section

- **Woopi Pages** - Create pages that appear under `/woopi/`
- Woopi Sessions (existing)
- Other Woopi-specific content

### Content Management

- **General Pages** - Create global pages
- Navigation management

## Benefits

1. **No Confusion**: Coaches can't accidentally create pages in the wrong region
2. **Clear Organization**: Content is clearly separated by region
3. **Same Schema**: All page types use the same fields and layout
4. **URL Structure**: Clean, predictable URLs (`/sydney/schools`, `/woopi/schools`)

## Usage Examples

### Sydney Coach Creates a Page

1. Go to **Sydney** → **Sydney Pages**
2. Create page with title "School Programs"
3. Page becomes available at `/sydney/school-programs`

### Woopi Coach Creates a Page

1. Go to **Woopi** → **Woopi Pages**
2. Create page with title "School Programs"
3. Page becomes available at `/woopi/school-programs`

### Admin Creates General Page

1. Go to **Content Management** → **General Pages**
2. Create page with title "About Us"
3. Page becomes available at `/about-us`

## Migration from Legacy System

The old `dynamicPages` collection is kept as "Pages (Legacy)" for migration purposes. Content can be moved from there to the appropriate new collections.

## Technical Implementation

- **Shared Schema**: All collections use the same `createPageSchema()` function
- **Minimal Duplication**: Shared utility functions handle common logic
- **Type Safety**: TypeScript ensures correct collection usage
- **Same Component**: All pages render with `DynamicPageComponent`
