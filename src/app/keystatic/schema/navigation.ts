import { singleton, fields } from '@keystatic/core'

// Available Heroicons for the navigation
const heroIconOptions = [
  { label: 'Map', value: 'MapIcon' },
  { label: 'Sparkles', value: 'SparklesIcon' },
  { label: 'Star', value: 'StarIcon' },
  { label: 'Photo', value: 'PhotoIcon' },
  { label: 'Bolt', value: 'BoltIcon' },
  { label: 'Academic Cap', value: 'AcademicCapIcon' },
  { label: 'User Group', value: 'UserGroupIcon' },
  { label: 'List Bullet', value: 'ListBulletIcon' },
  { label: 'Face Smile', value: 'FaceSmileIcon' },
]

// Sydney navigation item schema (references Sydney pages)
const sydneyNavigationItemSchema = {
  name: fields.text({ label: 'Display Name' }),
  page: fields.relationship({
    label: 'Page',
    collection: 'sydneyPages',
    validation: { isRequired: true },
  }),
  description: fields.text({ label: 'Description' }),
  icon: fields.select({
    label: 'Icon',
    options: heroIconOptions,
    defaultValue: 'MapIcon',
  }),
}

// Woopi navigation item schema (references Woopi pages)
const woopiNavigationItemSchema = {
  name: fields.text({ label: 'Display Name' }),
  page: fields.relationship({
    label: 'Page',
    collection: 'woopiPages',
    validation: { isRequired: true },
  }),
  description: fields.text({ label: 'Description' }),
  icon: fields.select({
    label: 'Icon',
    options: heroIconOptions,
    defaultValue: 'MapIcon',
  }),
}

// Shared call-to-action schema
const callToActionSchema = {
  name: fields.text({ label: 'Name' }),
  href: fields.text({ label: 'Link Path' }),
  icon: fields.select({
    label: 'Icon',
    options: heroIconOptions,
    defaultValue: 'ListBulletIcon',
  }),
}

export const sydneyNavigation = singleton({
  label: 'Sydney Navigation',
  path: 'src/content/navigation/sydney',
  schema: {
    name: fields.text({
      label: 'Region Name',
      defaultValue: 'Sydney',
    }),
    items: fields.array(fields.object(sydneyNavigationItemSchema), {
      label: 'Navigation Items',
      description: 'Items that appear in the Sydney dropdown menu',
      itemLabel: (props) => props.fields.name.value || 'Navigation Item',
    }),
    callsToAction: fields.array(fields.object(callToActionSchema), {
      label: 'Call-to-Action Buttons',
      description: 'Action buttons at the bottom of the dropdown',
      itemLabel: (props) => props.fields.name.value || 'CTA Button',
      validation: { length: { max: 2 } },
    }),
  },
})

export const woopiNavigation = singleton({
  label: 'Woopi Navigation',
  path: 'src/content/navigation/woopi',
  schema: {
    name: fields.text({
      label: 'Region Name',
      defaultValue: 'Woopi',
    }),
    items: fields.array(fields.object(woopiNavigationItemSchema), {
      label: 'Navigation Items',
      description: 'Items that appear in the Woopi dropdown menu',
      itemLabel: (props) => props.fields.name.value || 'Navigation Item',
    }),
    callsToAction: fields.array(fields.object(callToActionSchema), {
      label: 'Call-to-Action Buttons',
      description: 'Action buttons at the bottom of the dropdown',
      itemLabel: (props) => props.fields.name.value || 'CTA Button',
      validation: { length: { max: 2 } },
    }),
  },
})

// Header navigation
export const headerNavigation = singleton({
  label: 'Header Navigation',
  path: 'src/content/navigation/general',
  schema: {
    mainLinks: fields.array(
      fields.object({
        name: fields.text({ label: 'Link Name' }),
        href: fields.text({ label: 'Link Path' }),
      }),
      {
        label: 'Main Navigation Links',
        description: 'Links that appear in the main navigation bar',
        itemLabel: (props) => props.fields.name.value || 'Navigation Link',
      }
    ),
  },
})
