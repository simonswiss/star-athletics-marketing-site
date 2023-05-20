import Hero from './Partials/Hero'
import Introduction from './Partials/Introduction'
import Testimonials from './Partials/Testimonials'

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
