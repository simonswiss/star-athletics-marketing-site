import { createPublisher, PublishingError } from './github'

export async function handlePublishing(
  request: Request,
  repository: string,
  githubFetch = fetch,
) {
  try {
    if (request.method !== 'GET' && request.method !== 'POST') {
      throw new PublishingError('Method not allowed.', 405)
    }
    if (
      request.method === 'POST' &&
      request.headers.get('origin') !== new URL(request.url).origin
    ) {
      throw new PublishingError(
        'Publishing requests must come from this site.',
        403,
      )
    }
    const cookie = request.headers
      .get('cookie')
      ?.split(';')
      .map((value) => value.trim())
      .find((value) => value.startsWith('keystatic-gh-access-token='))
    const token = cookie?.slice('keystatic-gh-access-token='.length)
    if (!token)
      throw new PublishingError(
        'Sign in to Keystatic to edit and publish.',
        401,
      )
    const publisher = createPublisher(
      decodeURIComponent(token),
      repository,
      githubFetch,
    )
    await publisher.authorize()
    if (request.method === 'POST') {
      throw new PublishingError(
        'Publishing is paused while drafts are separated by editor. Your saved changes are safe. Please reload the editor shortly.',
        503,
      )
    }
    if (request.method === 'GET') return json(await publisher.status())
    let body: { action?: string; draftSha?: string; publishedSha?: string }
    try {
      body = await request.json()
    } catch {
      throw new PublishingError('Invalid publishing request.', 400)
    }
    if (!body || typeof body !== 'object')
      throw new PublishingError('Invalid publishing request.', 400)
    if (body.action === 'prepare') return json(await publisher.prepare())
    if (
      body.action === 'publish' &&
      /^[a-f0-9]{40}$/.test(body.draftSha ?? '') &&
      /^[a-f0-9]{40}$/.test(body.publishedSha ?? '')
    ) {
      return json(
        await publisher.publish({
          draftSha: body.draftSha!,
          publishedSha: body.publishedSha!,
        }),
      )
    }
    throw new PublishingError('Invalid publishing request.', 400)
  } catch (error) {
    return json(
      {
        error:
          error instanceof PublishingError
            ? error.message
            : 'Publishing is temporarily unavailable. Please try again.',
      },
      error instanceof PublishingError ? error.status : 500,
    )
  }
}

function json(value: unknown, status = 200) {
  return Response.json(value, {
    status,
    headers: { 'Cache-Control': 'no-store' },
  })
}
