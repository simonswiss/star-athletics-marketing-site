// Personal branches never trigger Vercel deployments (see vercel.json).
export const DRAFT_BRANCH_PREFIX = "content-drafts-";
export const PUBLISHED_BRANCH = "main";
export const PUBLISHING_VERSION = 2;

export function draftBranchForUser(id: number) {
  if (!Number.isSafeInteger(id) || id <= 0)
    throw new Error("Invalid editor identity");
  return `${DRAFT_BRANCH_PREFIX}${id}`;
}
