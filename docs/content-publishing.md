# Content drafts and image optimization

## Editing and publishing

In the deployed Keystatic editor, **Save draft** saves to your own draft branch.
**Review & publish** shows only your saved changes. **Publish changes** publishes
that reviewed batch; other editors' drafts remain unpublished. Each editor must
sign in with their own GitHub account. People sharing one GitHub login share one
draft identity.

Personal branches use `content-drafts-<GitHub numeric user ID>`. The API obtains
that ID from GitHub using the authenticated token; it never accepts a branch or
owner chosen by the browser. The editor uses the same ID from Keystatic's existing
viewer query, so resolving ownership adds no separate client request. Direct URLs
for `main`, the old shared branch, or another editor's branch still open only the
signed-in editor's personal drafts.

A personal branch is created from current `main` the first time its editor opens
Keystatic. Existing branches open immediately, with status fetched in the
background. Draft saves never deploy the site. Publication merges the exact
reviewed personal revision into `main`, triggering one production deployment.
Unsaved edits must be saved first; publishing does not mean deployment is finished.

New saves in another tab or a changed production revision require a fresh review.
Conflicts fail without overwriting either branch. A developer can merge current
`main` into a personal branch to resolve conflicts or refresh its published content;
never force-reset a branch containing drafts.

### Migration from the retired shared batch

The two unintended Woopi edits were restored on `main` and preserved separately
on their owner's personal draft branch. The legacy `content-drafts` branch is
retained as history and locked on GitHub, including for administrators, so stale
editor tabs cannot save into the old shared batch. Reload Keystatic after rollout.
The publishing API rejects older clients without protocol version 2; neither
preparation nor publication can target the retired shared branch.

Only changes under `src/content/` and `public/images/` can be published from the
CMS. Application code changes need the normal developer workflow. Draft batches
of 300 or more changed files require a pull request because GitHub truncates the
comparison's file list at 300.

## Deployment setup

- Keep Vercel's production branch set to `main`.
- Deploy this implementation to `main` before editors use the new workflow.
  The committed `vercel.json` disables automatic builds of `content-drafts` and `content-drafts-*` ([Vercel branch-pattern documentation](https://vercel.com/docs/project-configuration/git-configuration)).
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
`patches/@keystatic__core@0.6.9.patch`. The patch adds `ui.draftBranchPerUser`, resolves `ui.draftBranch` inside the authenticated Keystatic shell, locks
the editor's branch context (including direct URLs), removes branch-management
controls, labels saves as drafts, reports unsaved editor state to the publishing
controls and adds a publishing slot inside Keystatic's existing Keystar provider.
The client-only slot uses native layout, buttons, notices, dialogs and toasts,
including Keystatic's chosen light/dark theme. Its status follows the native
personal branch and saved commit revision; background reads are shared across navigation and refresh
on focus and every 30 seconds while visible. No publishing bar appears for an
empty batch. Review always fetches the latest batch before publication. Conflicted saves cannot escape
into a different branch. Upgrade this patch deliberately and run the tests when
updating Keystatic; installing with npm will not apply it. The Webpack cache
version includes the patch hash, so Vercel cannot reuse a compiled package from
an older patch at the same Keystatic version.

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

- `pnpm test`: publishing authorization, isolation between two editors, legacy-client rejection, branch preparation, review races,
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

## Reviewing copy changes

The review uses GitHub's patch for the exact compared commit revisions. It shows
changed blocks with Before and After labels and highlights the replaced text.
Simple top-level YAML fields get readable names and unquoted values; MDX is
displayed as text, never executed. Formatting-only changes are labelled as such.

Each file previews up to four changed blocks and 2,000 characters per side.
Incomplete GitHub patches and shortened previews are explicitly labelled, and
the dialog links to the full GitHub comparison at the same immutable revisions.
Images and other files without a text patch get a clear fallback message.
