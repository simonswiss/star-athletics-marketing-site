import { singleton, fields } from '@keystatic/core'

export const woopiPage = singleton({
  label: 'Woopi Page',
  path: 'src/content/woopi-page',
  schema: {
    title: fields.text({ label: 'Title' }),
    leadText: fields.text({ label: 'Lead Text', multiline: true }),
    introText: fields.text({ label: 'Intro Text', multiline: true }),
    buttonText: fields.text({ label: 'Button Text' }),
    images: fields.array(
      fields.object({
        url: fields.image({
          label: 'Image',
          directory: 'public/images/woopi-page',
          publicPath: '/images/woopi-page/',
          validation: { isRequired: true },
        }),
        altText: fields.text({ label: 'Alt Text' }),
      }),
      {
        label: 'Images',
        itemLabel: (props) =>
          props.fields.altText.value || "No alt text for this image (it's important for SEO!)",
        validation: { length: { min: 4, max: 4 } },
      }
    ),
  },
})
