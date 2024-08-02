import { singleton, fields } from '@keystatic/core'

export const sydneyPopupClinics = singleton({
  label: 'Sydney Popup Clinics',
  path: 'src/content/sydney-popup-clinics',
  format: {
    contentField: 'leadText',
  },
  schema: {
    title: fields.text({ label: 'Title' }),
    image: fields.image({
      label: 'Image',
      directory: 'public/images/sydney-popup-clinics',
      publicPath: '/images/sydney-popup-clinics/',
    }),
    leadText: fields.mdx({
      label: 'Lead Text',
      options: {
        image: {
          directory: 'public/images/sydney-popup-clinics',
          publicPath: '/images/sydney-popup-clinics/',
        },
      },
    }),
  },
})
