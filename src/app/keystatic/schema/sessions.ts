import { fields } from '@keystatic/core'

export const sessionSchema = {
  name: fields.slug({ name: { label: 'Name' } }),
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
  description: fields.text({ label: 'Description', multiline: true }),
  bookingFormUrl: fields.url({ label: 'Booking Form URL' }),
}
