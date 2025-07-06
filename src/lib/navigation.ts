import { reader } from '@/app/keystatic/reader'

export async function getNavigationData() {
  const [sydney, woopi, general] = await Promise.all([
    reader.singletons.sydneyNavigation.readOrThrow(),
    reader.singletons.woopiNavigation.readOrThrow(),
    reader.singletons.headerNavigation.readOrThrow(),
  ])

  return {
    sydney,
    woopi,
    links: general.mainLinks,
  }
}

export type NavigationData = Awaited<ReturnType<typeof getNavigationData>>
