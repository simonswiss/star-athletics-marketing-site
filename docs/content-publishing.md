# Content drafts and image optimization

## Editing and publishing

In the deployed Keystatic editor, **Save draft** saves content to the shared
`content-drafts` branch. Everyone edits the same draft batch. These saves do not
deploy the site. **Review & publish** lists saved changes; **Publish changes**
merges the reviewed revision into `main`, which triggers the normal production
deployment. Unsaved edits must be saved first. Publishing is not an indication
that the deployment has finished.

The draft branch is created automatically when an authenticated editor first
opens Keystatic. Opening the editor also merges current published changes into
the draft, without resetting its history. The API uses the editor's existing
Keystatic GitHub session and requires repository write permission. No new token
or Vercel deploy hook is needed.

If another editor saves between review and publish, reopen the review to include
the new batch. Saves made after publishing starts remain drafts for the next
batch. Conflicts fail without overwriting either branch. A developer can resolve
conflicts on `content-drafts`; never force-reset it while it contains edits.

Only changes under `src/content/` and `public/images/` can be published from the
CMS. Application code changes need the normal developer workflow. Draft batches
of 300 or more changed files require a pull request because GitHub truncates the
comparison's file list at 300.

## Deployment setup

- Keep Vercel's production branch set to `main`.
- Deploy this implementation to `main` before editors use the new workflow.
  The committed `vercel.json` disables automatic builds of `content-drafts`.
- Keep the existing Keystatic GitHub app and repository environment variables.
  The app needs Contents write access (already used for saving).
- GitHub rules requiring pull requests on `main` can block the Publish button.
  Do not bypass repository rules; use the normal pull-request process if enabled.
- Local development keeps Keystatic's filesystem mode. Publish is only shown in
  GitHub mode, where drafts are stored independently of the deployed checkout.
- Shorten deployment retention separately if desired. This implementation does
  not delete old deployments or immediately reclaim their storage.

## Why the Keystatic patch exists

Checked the published `@keystatic/core` **0.6.9** package and current upstream
changelog on 2026-09-14. Saving still calls `createCommitOnBranch` for one entry;
the configuration API exposes no batch-publish feature. The older
[batch-deployments discussion](https://github.com/Thinkmill/keystatic/discussions/381)
includes a prototype but is still labelled roadmap.

The exact package version is pinned. `pnpm-workspace.yaml` applies
`patches/@keystatic__core@0.6.9.patch`. The small patch adds `ui.draftBranch`, locks
the editor's branch context (including direct URLs), removes branch-management
controls, labels saves as drafts, reports unsaved editor state to the publishing
toolbar and makes the editor height fit below it. Conflicted saves cannot escape
into a different branch. Upgrade this patch deliberately and run the tests when
updating Keystatic; installing with npm will not apply it.

## Image optimization

Run `pnpm images:optimize` to optimize images in `public`. `pnpm build` runs it
automatically before Next.js, so new CMS uploads are covered without a cron job
or automated Git commits. Future build-time changes affect that deployment's
working files; they do not write optimized uploads back into GitHub.

The optimizer preserves aspect ratios and never enlarges images. Testimonial
avatars (displayed at 40px) can be reduced to 320px wide. Large photographs can
be reduced to 2560px wide, above the site's common 1920px retina image output.
PNG graphics use lossless WebP; photo fields may use high-quality JPEG or WebP.
Transparency is preserved, animations are left intact, and a larger encoded
file never replaces a smaller original. SVGs retain their vector originals.

Lossy candidates must pass two checks at representative display/retina widths:
at least 38 dB source PSNR and 3 dB above a WebP quality-75 reference; the second
quality-75 encode must lose no more than 0.5 dB relative to that reference. Decoding is
normalized before comparison to avoid codec-specific resize shortcuts affecting
the measurements. These are automated fidelity checks, not a claim of visual
identity. Originals that do not pass are retained. Orientation is baked into
pixels before metadata is removed.

Image references in source, YAML and MDX are updated along with filenames.
Filenames include a content hash, and `.image-optimization-cache.json` records
processed hashes so repeated builds do not repeatedly compress the same files.
Git history retains the original committed assets. The initial pass reduced raster
assets from 58.4 MB to 30.7 MB (47.5%); 41 files became smaller, while 31
were retained because no smaller candidate met the quality policy.

## Verification

- `pnpm test`: publishing authorization, branch preparation, review races,
  conflicts, code-change rejection, duplicate publishing, image alpha/reference
  preservation, optimizer idempotence and installed-patch checks.
- `pnpm lint` and `pnpm tsc`: application checks.
- `pnpm build`: production compilation and static generation.
- `pnpm exec playwright test`: browser tests against a production build with
  GitHub and publishing requests mocked. They never publish real content.
  Build with the fixture repository first:
  `NEXT_PUBLIC_VERCEL_GIT_REPO_OWNER=example NEXT_PUBLIC_VERCEL_GIT_REPO_SLUG=marketing-site NEXT_PUBLIC_KEYSTATIC_GITHUB_APP_SLUG=star-test pnpm build`.
  Use `pnpm exec playwright install chromium` if a browser is not installed.
  The native-editor test verifies a direct `main` URL still commits only to
  drafts, and publishing unlocks after the save succeeds.
