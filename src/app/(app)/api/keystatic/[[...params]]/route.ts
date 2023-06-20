import { makeRouteHandler } from '@keystatic/next/route-handler'
import keystaticConfig from '@/app/keystatic/keystatic.config'

// export const config = {
//   api: {
//     bodyParser: {
//       sizeLimit: '20mb',
//     },
//     responseLimit: '20mb',
//   },
// }

export const { POST, GET } = makeRouteHandler({
  config: keystaticConfig,
})
