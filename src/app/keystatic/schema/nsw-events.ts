import { collection, fields } from '@keystatic/core'

export const nswEvents = collection({
  label: 'NSW Events',
  path: 'src/content/nsw-events/*',
  slugField: 'name',
  schema: {
    name: fields.slug({ name: { label: 'Name' } }),
    image: fields.image({
      label: 'Image',
      directory: 'public/images/nsw-events',
      publicPath: '/images/nsw-events/',
    }),
    status: fields.select({
      label: 'Status',
      options: [
        { label: 'Open for registgration', value: 'open' },
        { label: 'Waitlist ', value: 'waitlist' },
        { label: 'Closed', value: 'closed' },
      ],
      defaultValue: 'open',
    }),
    date: fields.date({
      label: 'Date',
      validation: {
        isRequired: true,
      },
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
    price: fields.text({ label: 'Price' }),
    bookingFormUrl: fields.url({ label: 'Booking Form URL' }),
  },
})
