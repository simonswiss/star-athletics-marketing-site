import { singleton, fields } from '@keystatic/core'

export const woopiSessionsPage = singleton({
  label: 'Woopi Sessions Page',
  path: 'src/content/woopi-sessions-page',
  schema: {
    title: fields.text({ label: 'Title' }),
    leadText: fields.document({ label: 'Lead Text', formatting: true, links: true }),
    image: fields.image({
      label: 'Image',
      directory: 'public/images/woopi-sessions-page',
      publicPath: '/images/woopi-sessions-page/',
    }),
  },
})
