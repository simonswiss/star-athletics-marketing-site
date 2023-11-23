import { singleton, fields } from '@keystatic/core'

export const woopiPopupClinics = singleton({
  label: 'Woopi Popup Clinics',
  path: 'src/content/woopi-popup-clinics',
  schema: {
    title: fields.text({ label: 'Title' }),
    image: fields.image({
      label: 'Image',
      directory: 'public/images/woopi-popup-clinics',
      publicPath: '/images/woopi-popup-clinics/',
    }),
    document: fields.document({
      label: 'Lead Text',
      formatting: true,
      links: true,
      images: {
        directory: 'public/images/woopi-popup-clinics',
        publicPath: '/images/woopi-popup-clinics/',
      },
    }),
  },
})
