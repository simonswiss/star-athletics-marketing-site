# Dynamic Pages System

## Overview

The new dynamic pages system allows users to create pages autonomously without needing a developer. Pages are managed through Keystatic collections and automatically generate routes based on their slug.

## How It Works

### 1. Keystatic Configuration

The `dynamicPages` collection is defined in `src/app/keystatic/schema/dynamic-pages.ts`:

```typescript
export const dynamicPages = collection({
  label: 'Pages',
  path: 'src/content/pages/**',
  slugField: 'title',
  schema: {
    title: fields.slug({ name: { label: 'Page Title' } }),
    metaDescription: fields.text({
      /* ... */
    }),
    heroImage: fields.image({
      /* ... */
    }),
    content: fields.document({
      /* ... */
    }),
    includeBooking: fields.checkbox({
      /* ... */
    }),
    booking: fields.conditional({
      /* ... */
    }),
  },
})
```

### 2. Dynamic Route

The catch-all route `src/app/(app)/[...slug]/page.tsx` handles all dynamic pages:

- Generates static params for all pages
- Handles nested routes (e.g., `sydney/schools`, `woopi/camps`)
- Renders using the `DynamicPageComponent`

### 3. Page Component

The `DynamicPageComponent` renders all pages with a consistent layout:

- Hero image (optional)
- Rich text content
- Booking widget (optional)

## Usage

### Creating Pages

1. Go to Keystatic admin → Pages
2. Click "Create Page"
3. Fill out:
   - **Title**: Will be used as the slug (e.g., "Sydney Schools" → `sydney-schools`)
   - **Meta Description**: For SEO
   - **Hero Image**: Optional featured image
   - **Content**: Rich text with formatting, links, and images
   - **Include Booking**: Toggle for Cal.com booking widget

### Nested Routes

Use forward slashes in the title to create nested routes:

- `sydney/schools` → `/sydney/schools`
- `woopi/holiday-camps` → `/woopi/holiday-camps`

### Region-Specific Pages

The system naturally supports region-specific pages:

- Pages starting with `sydney/` are Sydney-specific
- Pages starting with `woopi/` are Woopi-specific
- Root-level pages are global

## Migration from Singletons

To migrate existing singleton pages:

1. Create a new dynamic page in Keystatic
2. Copy content from the singleton
3. Update navigation to point to the new slug
4. Remove the singleton from the schema

## Navigation

Navigation is handled separately through the `navigation` singleton, allowing users to:

- Configure main navigation
- Set up dropdown menus
- Manage footer links
- Reference dynamic pages by slug

## Benefits

1. **User Autonomy**: Users can create pages without developer involvement
2. **SEO-Friendly**: Each page gets proper metadata and URLs
3. **Consistent Design**: All pages use the same proven layout
4. **Flexible Content**: Rich text editor with images and formatting
5. **Booking Integration**: Optional Cal.com widgets for any page
6. **Nested Structure**: Support for hierarchical page organization

## File Structure

```
src/
├── app/
│   ├── (app)/
│   │   └── [...slug]/
│   │       └── page.tsx          # Dynamic route handler
│   └── keystatic/
│       └── schema/
│           ├── dynamic-pages.ts   # Pages collection schema
│           └── navigation.ts      # Navigation management
├── components/
│   └── pages/
│       └── DynamicPageComponent.tsx  # Page renderer
└── content/
    └── pages/                    # Generated page content
        ├── sydney/
        │   ├── schools.yaml
        │   └── holiday-camps.yaml
        └── woopi/
            ├── schools.yaml
            └── holiday-camps.yaml
```

## Next Steps

1. Update existing navigation to use the new system
2. Migrate existing singleton pages
3. Train users on the new page creation workflow
4. Remove legacy page singletons from the schema
