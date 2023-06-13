import { singleton, fields } from '@keystatic/core'

export const sydneySessionsPage = singleton({
  label: 'Sydney Sessions Page',
  path: 'src/content/sydney-sessions-page',
  schema: {
    title: fields.text({ label: 'Title' }),
    image: fields.image({
      label: 'Image',
      directory: 'public/images/sydney-sessions-page',
      publicPath: '/images/sydney-sessions-page/',
    }),
    leadText: fields.document({ label: 'Lead Text', formatting: true, links: true }),
  },
})
