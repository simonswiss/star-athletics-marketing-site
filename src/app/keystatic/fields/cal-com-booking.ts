import { fields } from '@keystatic/core'

export const calComBooking = fields.object(
  {
    eventString: fields.text({
      label: 'Event String',
      description: 'The event text string (like "one-on-one") to make bookable.',
    }),
    label: fields.text({ label: 'Label', description: 'The label to display on the button' }),
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
