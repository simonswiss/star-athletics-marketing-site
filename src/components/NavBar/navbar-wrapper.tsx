import { reader } from '@/app/keystatic/reader'
import Example from './index'

export default async function NavBar() {
  // Server-side data fetching
  const [sydney, woopi, general] = await Promise.all([
    reader.singletons.sydneyNavigation.readOrThrow(),
    reader.singletons.woopiNavigation.readOrThrow(),
    reader.singletons.headerNavigation.readOrThrow(),
  ])

  // Transform to match the exact structure the original component expected
  const navigation = {
    sydney: {
      name: sydney.name,
      items: [
        // Fixed items that always appear first
        {
          name: 'Overview',
          description: 'An overview of the Sydney program',
          href: '/sydney',
          icon: 'MapIcon',
        },
        {
          name: 'Group Sessions',
          description: 'Fun filled sessions, for all ages and abilities',
          href: '/sydney/sessions',
          icon: 'SparklesIcon',
        },
        // Dynamic pages from the collection
        ...sydney.items.map((item) => ({
          name: item.name,
          description: item.description,
          href: `/sydney/${item.page}`,
          icon: item.icon,
        })),
      ],
      callsToAction: sydney.callsToAction.map((item) => ({
        name: item.name,
        href: item.href,
        icon: item.icon,
      })),
    },
    woopi: {
      name: woopi.name,
      items: [
        // Fixed items that always appear first
        {
          name: 'Overview',
          description: 'An overview of the Woopi program',
          href: '/woopi',
          icon: 'MapIcon',
        },
        {
          name: 'Group Sessions',
          description: 'Fun filled sessions, for all ages and abilities',
          href: '/woopi/sessions',
          icon: 'SparklesIcon',
        },
        // Dynamic pages from the collection
        ...woopi.items.map((item) => ({
          name: item.name,
          description: item.description,
          href: `/woopi/${item.page}`,
          icon: item.icon,
        })),
      ],
      callsToAction: woopi.callsToAction.map((item) => ({
        name: item.name,
        href: item.href,
        icon: item.icon,
      })),
    },
    links: general.mainLinks,
  }

  return <Example navigation={navigation} />
}
