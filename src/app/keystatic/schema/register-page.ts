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
    sydneyButtonText: fields.text({ label: 'Sydney Button Text' }),
    sydneyLink: fields.url({ label: 'Sydney Registration URL' }),
    woopiButtonText: fields.text({ label: 'Woopi Button Text' }),
    woopiLink: fields.url({ label: 'Woopi Registration URL' }),
  },
})
