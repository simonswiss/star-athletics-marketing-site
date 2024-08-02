import { singleton, fields } from '@keystatic/core'

export const woopiSessionsPage = singleton({
  label: 'Woopi Sessions Page',
  path: 'src/content/woopi-sessions-page',
  format: {
    contentField: 'leadText',
  },
  schema: {
    title: fields.text({ label: 'Title' }),
    leadText: fields.mdx({ label: 'Lead Text' }),
    image: fields.image({
      label: 'Image',
      directory: 'public/images/woopi-sessions-page',
      publicPath: '/images/woopi-sessions-page/',
    }),
  },
})
