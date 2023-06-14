import { singleton, fields } from '@keystatic/core'

export const sydneyPage = singleton({
  label: 'Sydney Landing Page',
  path: 'src/content/sydney-page',
  schema: {
    title: fields.text({ label: 'Title' }),
    leadText: fields.text({ label: 'Lead Text', multiline: true }),
    introText: fields.document({ label: 'Intro Text', formatting: true, links: true }),
    buttonText: fields.text({ label: 'Button Text' }),
    images: fields.array(
      fields.object({
        url: fields.image({
          label: 'Image',
          directory: 'public/images/sydney-page',
          publicPath: '/images/sydney-page/',
          validation: { isRequired: true },
        }),
        altText: fields.text({ label: 'Alt Text' }),
      }),
      {
        label: 'Images',
        description: '4 (required) images to be displayed in the Sydney landing page',
        itemLabel: (props) =>
          props.fields.altText.value || "No alt text for this image (it's important for SEO!)",
        validation: { length: { min: 4, max: 4 } },
      }
    ),
  },
})
