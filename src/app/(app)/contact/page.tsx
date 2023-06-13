import { Contact } from '@/components/Contact'

export default function Example() {
  return (
    <div className="mt-12">
      {/* @ts-expect-error Server Component */}
      <Contact />
    </div>
  )
}
