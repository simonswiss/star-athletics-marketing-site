import { test, expect, type Page } from "@playwright/test";
import { createHash } from "node:crypto";

const main = "a".repeat(40);
const draft = "b".repeat(40);
const body =
  '---\ntitle: Contact us\ngeneral:\n  email: hello@example.test\n  phone: ""\nsydney:\n  email: ""\n  phone: ""\n  facebook: ""\n  instagram: ""\nwoopi:\n  email: ""\n  phone: ""\n  facebook: ""\n  instagram: ""\n---\nGet in touch.\n';
function gitSha(type: string, bytes: Uint8Array) {
  return createHash("sha1")
    .update(`${type} ${bytes.length}\0`)
    .update(bytes)
    .digest("hex");
}
function fixtureTree(content: string) {
  const blob = gitSha("blob", new TextEncoder().encode(content));
  const tree = (mode: string, name: string, sha: string) =>
    gitSha(
      "tree",
      Uint8Array.from([
        ...Array.from(new TextEncoder().encode(`${mode} ${name}\0`)),
        ...Array.from(Buffer.from(sha, "hex")),
      ]),
    );
  const contentTree = tree("100644", "contacts.mdx", blob);
  const sourceTree = tree("40000", "content", contentTree);
  return {
    blob,
    sha: tree("40000", "src", sourceTree),
    entries: [
      { path: "src", mode: "040000", type: "tree", sha: sourceTree },
      { path: "src/content", mode: "040000", type: "tree", sha: contentTree },
      {
        path: "src/content/contacts.mdx",
        mode: "100644",
        type: "blob",
        sha: blob,
      },
    ],
  };
}

async function mockEditor(
  page: Page,
  {
    viewerId = 1,
    conflict = false,
    initialPending = true,
    holdStatus,
    draftExists = true,
  }: {
    viewerId?: number;
    conflict?: boolean;
    initialPending?: boolean;
    holdStatus?: Promise<void>;
    draftExists?: boolean;
  } = {},
) {
  const personalBranch = `content-drafts-${viewerId}`;
  page.on("pageerror", (error) =>
    console.error("Browser error:", error.message),
  );
  const commits: { branch: { branchName: string } }[] = [];
  const publishes: object[] = [];
  const requests: string[] = [];
  let hasSavedChanges = initialPending;
  let branchExists = draftExists;
  let savedBody = body;
  let savedTree = fixtureTree(body);
  await page.context().addCookies([
    {
      name: "keystatic-gh-access-token",
      value: "test-only",
      domain: "127.0.0.1",
      path: "/",
    },
  ]);
  await page.route("**/api/publishing", async (route) => {
    const request = route.request();
    const input =
      request.method() === "POST" ? request.postDataJSON() : undefined;
    requests.push(input?.action ?? "status");
    if (input?.action === "prepare") branchExists = true;
    if (input?.action === "publish") {
      if (!conflict) hasSavedChanges = false;
      publishes.push(input);
      return route.fulfill({
        status: conflict ? 409 : 200,
        json: conflict
          ? {
              error:
                "Saved changes have changed since you reviewed them. Review the latest batch before publishing.",
            }
          : { published: true, sha: "d".repeat(40) },
      });
    }
    if (holdStatus) await holdStatus;
    return route.fulfill({
      json: {
        draftBranch: personalBranch,
        draftSha: commits.length ? "e".repeat(40) : draft,
        publishedSha: main,
        comparisonUrl: `https://github.com/example/marketing-site/compare/${main}...${draft}`,
        files: hasSavedChanges
          ? [
              {
                filename: "src/content/contacts.mdx",
                status: "modified",
                patch: "@@ -1 +1 @@\n-title: Contact us.\n+title: Contact us!",
                additions: 1,
                deletions: 1,
              },
            ]
          : [],
      },
    });
  });
  await page.route("https://api.github.com/**", async (route) => {
    const url = new URL(route.request().url());
    if (url.pathname === "/graphql") {
      const { query, variables } = route.request().postDataJSON();
      const ref = (name: string) => ({
        __typename: "Ref",
        id: `ref-${name}`,
        name,
        target: {
          __typename: "Commit",
          id: `commit-${name}-${commits.length}`,
          oid: name === "main" ? main : commits.length ? "e".repeat(40) : draft,
          tree: { __typename: "Tree", id: savedTree.sha, oid: savedTree.sha },
        },
      });
      if (query.includes("mutation CreateCommit")) {
        commits.push(variables.input);
        hasSavedChanges = true;
        savedBody = Buffer.from(
          variables.input.fileChanges.additions[0].contents,
          "base64",
        ).toString();
        savedTree = fixtureTree(savedBody);
        return route.fulfill({
          json: {
            data: {
              createCommitOnBranch: {
                __typename: "CreateCommitOnBranchPayload",
                ref: ref(personalBranch),
              },
            },
          },
        });
      }
      const repository = {
        __typename: "Repository",
        id: "repo",
        name: "marketing-site",
        isPrivate: true,
        owner: { __typename: "Organization", id: "owner", login: "example" },
        viewerPermission: "WRITE",
        defaultBranchRef: ref("main"),
        refs: {
          __typename: "RefConnection",
          nodes: branchExists
            ? [ref("main"), ref(personalBranch)]
            : [ref("main")],
          pageInfo: {
            __typename: "PageInfo",
            hasNextPage: false,
            endCursor: null,
          },
        },
        forks: { __typename: "RepositoryConnection", nodes: [] },
      };
      return route.fulfill({
        json: {
          data: {
            repository,
            viewer: {
              __typename: "User",
              id: "viewer",
              databaseId: viewerId,
              login: "editor",
              name: "Editor",
              avatarUrl: "",
            },
            node: {
              __typename: "Ref",
              id: "ref-content-drafts",
              associatedPullRequests: {
                __typename: "PullRequestConnection",
                nodes: [],
              },
            },
          },
        },
      });
    }
    if (url.pathname.includes("/git/trees/"))
      return route.fulfill({
        json: {
          sha: savedTree.sha,
          truncated: false,
          tree: savedTree.entries,
        },
      });
    if (url.pathname.includes("/git/blobs/"))
      return route.fulfill({ body: savedBody, contentType: "text/plain" });
    throw new Error(`Unexpected GitHub request: ${url.pathname}`);
  });
  return { commits, publishes, requests };
}

test("review shows native entry labels, publishes once, then disappears", async ({
  page,
}) => {
  const { publishes } = await mockEditor(page);
  await page.goto("/keystatic");
  await expect(page.getByRole("status")).toContainText(
    "1 saved change ready to publish",
  );
  await page.getByRole("button", { name: "Review & publish" }).click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await expect(
    dialog.getByText("Contact Details", { exact: true }),
  ).toBeVisible();
  await dialog
    .getByRole("button", { name: "Publish changes", exact: true })
    .click();
  await expect(dialog).not.toBeVisible();
  await expect(
    page.getByRole("button", { name: "Review & publish" }),
  ).toHaveCount(0);
  await expect(
    page.getByText(
      "Changes published. The site will update when the deployment finishes.",
    ),
  ).toBeVisible();
  expect(publishes).toEqual([
    { action: "publish", draftSha: draft, publishedSha: main, version: 2 },
  ]);
});

test("a stale review stays open with a useful error", async ({ page }) => {
  await mockEditor(page, { conflict: true });
  await page.goto("/keystatic");
  await page.getByRole("button", { name: "Review & publish" }).click();
  await page
    .getByRole("button", { name: "Publish changes", exact: true })
    .click();
  await expect(page.getByRole("dialog")).toContainText(
    "Review the latest batch",
  );
});

test("unsaved editor changes disable publishing an existing batch", async ({
  page,
}) => {
  await mockEditor(page);
  await page.goto("/keystatic/branch/content-drafts/singleton/contacts");
  await page.getByLabel("Title", { exact: true }).fill("Unsaved title");
  await expect(
    page.getByRole("button", { name: "Review & publish" }),
  ).toBeDisabled();
  await expect(page.getByRole("status")).toContainText(
    "Save your current edits before publishing.",
  );
});

test("an empty batch has no banner and a slow status request never blocks the editor", async ({
  page,
}) => {
  let release!: () => void;
  const holdStatus = new Promise<void>((resolve) => {
    release = resolve;
  });
  const { requests } = await mockEditor(page, {
    initialPending: false,
    holdStatus,
  });
  await page.goto("/keystatic/branch/content-drafts/singleton/contacts");
  try {
    await expect(page.getByLabel("Title", { exact: true })).toHaveValue(
      "Contact us",
    );
    await expect(
      page.getByRole("button", { name: "Save draft", exact: true }),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Review & publish" }),
    ).toHaveCount(0);
    expect(requests).not.toContain("prepare");
  } finally {
    release();
  }
  await expect(
    page.getByText(/Opening your content drafts|Preparing your first draft/),
  ).toHaveCount(0);
});

test("a native save reveals the new batch and navigation does not re-prepare it", async ({
  page,
}, testInfo) => {
  const { commits, publishes, requests } = await mockEditor(page, {
    initialPending: false,
  });
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/keystatic/branch/main/singleton/contacts");
  await expect(page.getByLabel("Title", { exact: true })).toHaveValue(
    "Contact us",
  );
  await expect(
    page.getByRole("button", { name: "Review & publish" }),
  ).toHaveCount(0);
  await page
    .getByLabel("Title", { exact: true })
    .fill("Updated contact details");
  await page.getByRole("button", { name: "Save draft", exact: true }).click();
  await expect.poll(() => commits.length).toBe(1);
  expect(commits[0].branch.branchName).toBe("content-drafts-1");
  await expect(page.getByRole("status")).toContainText(
    "1 saved change ready to publish",
  );
  await expect(
    page.getByRole("button", { name: "Review & publish" }),
  ).toBeEnabled();
  await page.getByRole("link", { name: "Dashboard", exact: true }).click();
  await page
    .getByRole("link", { name: "Contact Details", exact: true })
    .first()
    .click();
  await expect(page.getByLabel("Title", { exact: true })).toHaveValue(
    "Updated contact details",
  );
  expect(requests).not.toContain("prepare");
  await page.screenshot({
    animations: "disabled",
    path: testInfo.outputPath("draft-editor.png"),
  });
  expect(publishes).toEqual([]);
  expect(errors).toEqual([]);
});

for (const theme of ["light", "dark"]) {
  test(`native review follows the ${theme} editor theme`, async ({
    page,
  }, testInfo) => {
    await page.addInitScript(
      (theme) => localStorage.setItem("keystatic-color-scheme", theme),
      theme,
    );
    await mockEditor(page);
    await page.goto("/keystatic/branch/content-drafts/singleton/contacts");
    await expect(page.getByLabel("Title", { exact: true })).toBeVisible();
    await page.getByRole("button", { name: "Review & publish" }).click();
    const dialog = page.getByRole("dialog");
    await expect(
      dialog.getByRole("heading", { name: "Publish your saved changes" }),
    ).toBeVisible();
    const color = await dialog
      .getByRole("heading")
      .evaluate((element) => getComputedStyle(element).color);
    const channels = color
      .match(/[\d.]+/g)!
      .slice(0, 3)
      .map(Number);
    expect(channels.reduce((sum, value) => sum + value, 0) / 3)[
      theme === "dark" ? "toBeGreaterThan" : "toBeLessThan"
    ](128);
    await page.screenshot({
      animations: "disabled",
      path: testInfo.outputPath(`review-${theme}.png`),
    });
    await page.keyboard.press("Escape");
    await expect(dialog).not.toBeVisible();
  });
}

test("small screens keep the native publishing dialog accessible", async ({
  page,
}, testInfo) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await mockEditor(page);
  await page.goto("/keystatic");
  await page.getByRole("button", { name: "Review & publish" }).click();
  await expect(
    page.getByRole("button", { name: "Publish changes", exact: true }),
  ).toBeInViewport();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.screenshot({
    animations: "disabled",
    path: testInfo.outputPath("review-mobile.png"),
  });
});

test("only a missing draft branch runs first-time preparation", async ({
  page,
}) => {
  const { requests } = await mockEditor(page, {
    initialPending: false,
    draftExists: false,
  });
  await page.goto("/keystatic/branch/content-drafts/singleton/contacts");
  await expect(page.getByLabel("Title", { exact: true })).toHaveValue(
    "Contact us",
  );
  expect(requests.filter((action) => action === "prepare")).toHaveLength(1);
  await page.getByRole("link", { name: "Dashboard", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Dashboard", exact: true }),
  ).toBeVisible();
  expect(requests.filter((action) => action === "prepare")).toHaveLength(1);
});

test("review displays before and after copy and highlights the actual punctuation change", async ({
  page,
}) => {
  await mockEditor(page);
  await page.goto("/keystatic");
  await page.getByRole("button", { name: "Review & publish" }).click();
  const dialog = page.getByRole("dialog");
  await expect(dialog.getByText("Before", { exact: true })).toBeVisible();
  await expect(dialog.getByText("After", { exact: true })).toBeVisible();
  await expect(dialog.locator("del")).toHaveText(".");
  await expect(dialog.locator("ins")).toHaveText("!");
  await expect(dialog).not.toContainText("@@");
  await expect(
    dialog.getByRole("link", { name: "Open full comparison on GitHub" }),
  ).toHaveAttribute(
    "href",
    `https://github.com/example/marketing-site/compare/${main}...${draft}`,
  );
});

test("two editors cannot see or publish each other’s saved batch, even using another branch URL", async ({
  browser,
}) => {
  const first = await browser.newContext();
  const second = await browser.newContext();
  try {
    const alice = await first.newPage();
    const bob = await second.newPage();
    const a = await mockEditor(alice, { viewerId: 1, initialPending: true });
    const b = await mockEditor(bob, { viewerId: 2, initialPending: false });
    await alice.goto("/keystatic/branch/content-drafts-2/singleton/contacts");
    await bob.goto("/keystatic/branch/content-drafts-1/singleton/contacts");
    await expect(
      alice.getByRole("button", { name: "Review & publish" }),
    ).toBeVisible();
    await expect(bob.getByLabel("Title", { exact: true })).toHaveValue(
      "Contact us",
    );
    await expect(
      bob.getByRole("button", { name: "Review & publish" }),
    ).toHaveCount(0);
    await bob.getByLabel("Title", { exact: true }).fill("Bob’s update");
    await bob.getByRole("button", { name: "Save draft", exact: true }).click();
    await expect.poll(() => b.commits.length).toBe(1);
    expect(b.commits[0].branch.branchName).toBe("content-drafts-2");
    await bob.getByRole("button", { name: "Review & publish" }).click();
    await expect(bob.getByRole("dialog")).toContainText(
      "only your saved changes",
    );
    await bob
      .getByRole("button", { name: "Publish changes", exact: true })
      .click();
    await expect.poll(() => b.publishes.length).toBe(1);
    expect(b.publishes[0]).toMatchObject({ version: 2 });
    expect(a.commits).toEqual([]);
    expect(a.publishes).toEqual([]);
    await expect(
      alice.getByRole("button", { name: "Review & publish" }),
    ).toBeVisible();
  } finally {
    await first.close();
    await second.close();
  }
});
