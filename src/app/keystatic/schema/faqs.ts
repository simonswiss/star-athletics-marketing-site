import { singleton, fields } from '@keystatic/core'

export const faqs = singleton({
  label: 'Frequently Asked Questions',
  path: 'src/content/faqs',
  schema: {
    questions: fields.array(
      fields.object({
        question: fields.text({ label: 'Question' }),
        answer: fields.mdx.inline({ label: 'Answer' }),
      }),
      {
        label: 'Question',
        itemLabel: (props) => props.fields.question.value,
      }
    ),
  },
})
