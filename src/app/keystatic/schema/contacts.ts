import { singleton, fields } from '@keystatic/core'

export const contacts = singleton({
  label: 'Contact Details',
  path: 'src/content/contacts',
  format: {
    contentField: 'leadText',
  },
  schema: {
    title: fields.text({ label: 'Title' }),
    leadText: fields.mdx({ label: 'Lead Text' }),
    general: fields.object(
      {
        email: fields.text({
          label: 'General Enquiries Email',
        }),
        phone: fields.text({
          label: 'General Enquiries Phone',
        }),
      },
      {
        label: 'General',
      }
    ),
    sydney: fields.object(
      {
        email: fields.text({
          label: 'Sydney Email',
        }),
        phone: fields.text({
          label: 'Sydney Phone',
        }),
      },
      {
        label: 'Sydney',
      }
    ),
    woopi: fields.object(
      {
        email: fields.text({
          label: 'Woopi Email',
        }),
        phone: fields.text({
          label: 'Woopi Phone',
        }),
      },
      {
        label: 'Woopi',
      }
    ),
    socials: fields.object(
      {
        facebook: fields.text({
          label: 'Facebook URL',
        }),
        instagram: fields.text({
          label: 'Instagram URL',
        }),
      },
      {
        label: 'Socials',
      }
    ),
  },
})
