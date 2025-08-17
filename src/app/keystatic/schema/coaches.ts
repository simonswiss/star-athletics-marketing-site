import { collection, fields } from '@keystatic/core'

export const coaches = collection({
  label: 'Coaches',
  path: 'src/content/coaches/*',
  slugField: 'name',
  format: { contentField: 'bio' },
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
    bio: fields.mdx({ label: 'Bio' }),
    qualifications: fields.array(fields.text({ label: 'Qualification' }), {
      label: 'Qualifications',
      itemLabel: (props) => props.value,
    }),
    sortIndex: fields.number({
      label: 'Sort Index',
      description: 'The order (lower number first) in which the coach will appear in the list.',
      validation: { isRequired: true },
    }),
    sessionsSlug: fields.text({
      label: 'Sessions Slug',
      description:
        'The slug of the sessions page for this coach. Leave blank to hide the sessions link.',
    }),
  },
})
