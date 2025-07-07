import { collection, fields } from '@keystatic/core'
import { calComBooking } from '../fields/cal-com-booking'

// Shared schema function to avoid duplication
function createPageSchema(region: 'sydney' | 'woopi' | 'general') {
  return {
    title: fields.slug({
      name: { label: 'Page Title' },
    }),
    heroImage: fields.image({
      label: 'Hero Image',
      directory: `public/images/pages/${region}`,
      publicPath: `/images/pages/${region}/`,
    }),
    content: fields.document({
      label: 'Page Content',
      formatting: true,
      links: true,
      images: {
        directory: `public/images/pages/${region}`,
        publicPath: `/images/pages/${region}/`,
      },
    }),
    booking: fields.conditional(
      fields.checkbox({
        label: 'Include Cal.com booking widget',
        defaultValue: false,
      }),
      {
        true: calComBooking,
        false: fields.empty(),
      }
    ),
  }
}

// Sydney-specific pages
export const sydneyPages = collection({
  label: 'Custom Sydney Pages',
  path: 'src/content/pages/sydney/**',
  slugField: 'title',
  schema: createPageSchema('sydney'),
})

// Woopi-specific pages
export const woopiPages = collection({
  label: 'Custom Woopi Pages',
  path: 'src/content/pages/woopi/**',
  slugField: 'title',
  schema: createPageSchema('woopi'),
})

// General pages (not region-specific)
export const generalPages = collection({
  label: 'Custom Pages',
  path: 'src/content/pages/general/**',
  slugField: 'title',
  schema: createPageSchema('general'),
})

// Legacy collection (for migration)
export const dynamicPages = collection({
  label: 'Pages (Legacy)',
  path: 'src/content/pages/**',
  slugField: 'title',
  schema: createPageSchema('general'),
})
