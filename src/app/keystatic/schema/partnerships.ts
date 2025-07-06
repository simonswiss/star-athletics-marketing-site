import { collection, fields, singleton } from '@keystatic/core'

export const partnershipsPage = singleton({
  label: 'Partnerships Page',
  path: 'src/content/partnerships-page',
  schema: {
    title: fields.text({ label: 'Title' }),
    introText: fields.document({ label: 'Intro Text', formatting: true, links: true }),
    partnerships: fields.array(
      fields.relationship({
        label: 'Partnership',
        collection: 'partnerships',
        validation: { isRequired: true },
      }),
      {
        label: 'Partnerships',
        itemLabel: (data) => data?.value || 'Partnership',
      }
    ),
  },
})

export const partnerships = collection({
  label: 'Partnerships',
  path: 'src/content/partnerships/*',
  slugField: 'name',
  schema: {
    name: fields.slug({ name: { label: 'Name' } }),
    introText: fields.document({ label: 'Intro Text', formatting: true, links: true }),
    logo: fields.image({
      label: 'Logo',
      directory: 'public/images/partnerships',
      publicPath: '/images/partnerships/',
    }),
    website: fields.url({ label: 'Website' }),
    perks: fields.array(fields.text({ label: 'Perk' }), {
      label: 'Perks',
      itemLabel: (data) => data.value,
    }),
  },
})
