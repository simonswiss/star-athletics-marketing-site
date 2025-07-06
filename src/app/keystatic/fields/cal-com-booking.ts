import { fields } from '@keystatic/core'

export const calComBooking = fields.object(
  {
    calComSlug: fields.text({
      label: 'Event Slug',
      description: 'The full Cal.com event slug (e.g. star-athletics/one-on-one).',
      validation: { isRequired: true },
    }),
    label: fields.text({
      label: 'Label',
      description: 'The label to display on the button or above the calendar.',
      validation: { isRequired: true },
    }),
    display: fields.select({
      label: 'Calendar display type',
      options: [
        { label: 'Button', value: 'button' },
        { label: 'Calendar', value: 'calendar' },
      ],
      defaultValue: 'button',
    }),
  },
  {
    label: 'Cal.com Booking',
    description: 'Allow users to book a particular Cal.com event. Leave blank if not applicable.',
    layout: [6, 6, 12],
  }
)
