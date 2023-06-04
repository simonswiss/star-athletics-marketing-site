import Hero from './_partials/Hero'
import Introduction from './_partials/Introduction'
import Testimonials from './_partials/Testimonials'

export default function Home() {
  return (
    <>
      {/* @ts-expect-error Server Component */}
      <Hero />
      {/* @ts-expect-error Server Component */}
      <Introduction />
      {/* @ts-expect-error Server Component */}
      <Testimonials />
    </>
  )
}
