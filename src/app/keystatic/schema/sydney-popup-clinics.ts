import { singleton, fields } from '@keystatic/core'

export const sydneyPopupClinics = singleton({
  label: 'Sydney Popup Clinics',
  path: 'src/content/sydney-popup-clinics',
  schema: {
    title: fields.text({ label: 'Title' }),
    image: fields.image({
      label: 'Image',
      directory: 'public/images/sydney-popup-clinics',
      publicPath: '/images/sydney-popup-clinics/',
    }),
    document: fields.document({ label: 'Lead Text', formatting: true, links: true, images: true }),
  },
})
