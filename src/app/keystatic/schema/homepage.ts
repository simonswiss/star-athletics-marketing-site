import { singleton, fields } from '@keystatic/core'

export const homepage = singleton({
  label: 'Homepage',
  path: 'src/content/homepage',
  schema: {
    heroImages: fields.array(
      fields.object({
        url: fields.image({
          label: 'Hero Image 1',
          directory: 'public/images/homepage',
          publicPath: '/images/homepage/',
          validation: { isRequired: true },
        }),
        altText: fields.text({ label: 'Alt Text' }),
      }),
      {
        label: 'Hero Images',
        itemLabel: (props) =>
          props.fields.altText.value || "No alt text for this image (it's important for SEO!)",
        validation: { length: { min: 5, max: 5 } },
      }
    ),
    bigImage: fields.object({
      url: fields.image({
        label: 'Big Image',
        directory: 'public/images/homepage',
        publicPath: '/images/homepage/',
        validation: { isRequired: true },
      }),
      altText: fields.text({ label: 'Alt Text' }),
    }),
    primaryTestimonial: fields.relationship({
      label: 'Primary Testimonial',
      collection: 'testimonials',
    }),
  },
})
