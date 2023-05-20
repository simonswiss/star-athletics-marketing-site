import { collection, fields } from '@keystatic/core'

export const testimonials = collection({
  label: 'Testimonials',
  path: 'src/content/testimonials/*',
  slugField: 'name',
  schema: {
    name: fields.slug({ name: { label: 'Name' } }),
    testimonial: fields.text({ label: 'Testimonial', multiline: true }),
    role: fields.text({ label: 'Role' }),
    avatar: fields.image({
      label: 'Avatar',
      directory: 'public/images/testimonials',
      publicPath: '/images/testimonials/',
    }),
  },
})
