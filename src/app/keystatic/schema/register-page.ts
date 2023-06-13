import { singleton, fields } from '@keystatic/core'

export const registerPage = singleton({
  label: 'Register Page',
  path: 'src/content/register-page',
  schema: {
    title: fields.text({ label: 'Title' }),
    // image: fields.image({
    //   label: 'Image',
    //   directory: 'public/images/register-page',
    //   publicPath: '/images/register-page/',
    // }),
    document: fields.document({ label: 'Lead Text', formatting: true, links: true, images: true }),
  },
})
