import { singleton, fields } from '@keystatic/core'

export const woopiPopupClinics = singleton({
  label: 'Woopi Popup Clinics',
  path: 'src/content/woopi-popup-clinics',
  format: { contentField: 'leadText' },
  schema: {
    title: fields.text({ label: 'Title' }),
    image: fields.image({
      label: 'Image',
      directory: 'public/images/woopi-popup-clinics',
      publicPath: '/images/woopi-popup-clinics/',
    }),
    leadText: fields.mdx({
      label: 'Lead Text',
      options: {
        image: {
          directory: 'public/images/woopi-popup-clinics',
          publicPath: '/images/woopi-popup-clinics/',
        },
      },
    }),
  },
})
