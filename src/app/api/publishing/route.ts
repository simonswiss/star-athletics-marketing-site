import { handlePublishing } from '@/lib/publishing/handler'

export const dynamic = 'force-dynamic'

function handler(request: Request) {
  const repository = `${process.env.NEXT_PUBLIC_VERCEL_GIT_REPO_OWNER ?? ''}/${process.env.NEXT_PUBLIC_VERCEL_GIT_REPO_SLUG ?? ''}`
  return handlePublishing(request, repository)
}

export { handler as GET, handler as POST }
