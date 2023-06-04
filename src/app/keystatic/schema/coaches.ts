import { collection, fields } from '@keystatic/core'

export const coaches = collection({
  label: 'Coaches',
  path: 'src/content/coaches/*',
  slugField: 'name',
  schema: {
    name: fields.slug({ name: { label: 'Name' } }),
    role: fields.text({ label: 'Role' }),
    region: fields.text({ label: 'Region' }),
    avatar: fields.image({
      label: 'Avatar',
      directory: 'public/images/coaches',
      publicPath: '/images/coaches/',
    }),
    shortIntro: fields.text({ label: 'Short Intro', multiline: true }),
    bio: fields.document({ label: 'Bio', formatting: true, links: true }),
    qualifications: fields.array(fields.text({ label: 'Qualification' }), {
      label: 'Qualifications',
      itemLabel: (props) => props.value,
    }),
  },
})
