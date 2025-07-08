import { fields } from '@keystatic/core'

export const sessionSchema = {
  name: fields.slug({ name: { label: 'Name' } }),
  sortIndex: fields.integer({
    label: 'Sort Index',
    description: 'Used to sort sessions in the list, lower index listed first',
    defaultValue: 20,
  }),
  status: fields.select({
    label: 'Status',
    options: [
      { label: 'Open for registration', value: 'open' },
      { label: 'Waitlist ', value: 'waitlist' },
      { label: 'Closed', value: 'closed' },
    ],
    defaultValue: 'open',
  }),
  day: fields.select({
    label: 'Day',
    options: [
      { label: 'Monday', value: 'Monday' },
      { label: 'Tuesday', value: 'Tuesday' },
      { label: 'Wednesday', value: 'Wednesday' },
      { label: 'Thursday', value: 'Thursday' },
      { label: 'Friday', value: 'Friday' },
      { label: 'Saturday', value: 'Saturday' },
      { label: 'Sunday', value: 'Sunday' },
    ],
    defaultValue: 'Monday',
  }),
  startTime: fields.text({ label: 'Start Time' }),
  endTime: fields.text({ label: 'End Time' }),
  location: fields.text({ label: 'Location' }),
  capacity: fields.integer({
    label: 'Capacity',
    defaultValue: 0,
    validation: { isRequired: true, min: 0, max: 100 },
  }),
  enrolments: fields.integer({
    label: 'Enrolments',
    defaultValue: 0,
    validation: { isRequired: true, min: 0, max: 100 },
  }),
  description: fields.mdx({ label: 'Description' }),
  price: fields.text({ label: 'Price' }),
  bookingFormUrl: fields.url({
    label: 'Booking Form URL',
    description: 'A link to your own booking form. Leave blank if not applicable.',
  }),
  calComBooking: fields.text({
    label: 'Cal.com Booking slug',
    description: 'The slug of the Cal.com event for this session. Leave blank if not applicable.',
  }),
}
