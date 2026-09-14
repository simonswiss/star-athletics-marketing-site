import assert from "node:assert/strict";
import test from "node:test";
import { handlePublishing } from "../src/lib/publishing/handler";

const main = "a".repeat(40);
const draft = "b".repeat(40);
const newer = "c".repeat(40);
const changed = [
  { filename: "src/content/sessions/sydney/squad.mdx", status: "modified" },
];

function fixture(
  options: {
    userId?: number;
    draft?: string | null;
    files?: object[];
    compareStatus?: string;
    permission?: boolean;
    conflict?: boolean;
  } = {},
) {
  let draftHead = options.draft === undefined ? draft : options.draft;
  const writes: { path: string; body: Record<string, string> }[] = [];
  const request = (async (url: string | URL | Request, init?: RequestInit) => {
    const pathname = new URL(String(url)).pathname.replace(
      "/repos/team/site",
      "",
    );
    if (init?.method === "POST") {
      const body = JSON.parse(String(init.body));
      writes.push({ path: pathname, body });
      if (pathname === "/git/refs") {
        draftHead = body.sha;
        return Response.json({ object: { sha: draftHead } }, { status: 201 });
      }
      if (pathname === "/merges")
        return options.conflict
          ? Response.json({}, { status: 409 })
          : Response.json({ sha: newer }, { status: 201 });
    }
    if (pathname === "/user") return Response.json({ id: options.userId ?? 1 });
    if (pathname === "")
      return Response.json({
        permissions: { push: options.permission ?? true },
      });
    if (pathname === "/git/ref/heads/main")
      return Response.json({ object: { sha: main } });
    if (pathname === `/git/ref/heads/content-drafts-${options.userId ?? 1}`)
      return draftHead
        ? Response.json({ object: { sha: draftHead } })
        : Response.json({}, { status: 404 });
    if (pathname.startsWith("/compare/"))
      return Response.json({
        status: options.compareStatus ?? "ahead",
        files: options.files ?? changed,
      });
    throw new Error(`Unexpected GitHub request: ${pathname}`);
  }) as typeof fetch;
  const call = (body?: object, overrides: Record<string, string> = {}) =>
    handlePublishing(
      new Request("https://site.test/api/publishing", {
        method: body ? "POST" : "GET",
        headers: {
          origin: "https://site.test",
          cookie: "keystatic-gh-access-token=test-only",
          "Content-Type": "application/json",
          ...overrides,
        },
        body: body ? JSON.stringify({ version: 2, ...body }) : undefined,
      }),
      "team/site",
      request,
    );
  return { call, writes };
}

test("anonymous and cross-origin publishing cannot write to GitHub", async () => {
  const { call, writes } = fixture();
  assert.equal((await call({ action: "prepare" }, { cookie: "" })).status, 401);
  assert.equal(
    (await call({ action: "prepare" }, { origin: "https://attacker.test" }))
      .status,
    403,
  );
  assert.equal(writes.length, 0);
});

test("read-only collaborators cannot publish", async () => {
  const { call, writes } = fixture({ permission: false });
  assert.equal((await call({ action: "prepare" })).status, 403);
  assert.equal(writes.length, 0);
});

test("opening the editor creates/syncs only the draft branch", async () => {
  const { call, writes } = fixture({ draft: null, files: [] });
  assert.equal((await call({ action: "prepare" })).status, 200);
  assert.deepEqual(
    writes.map((write) => write.body.base ?? write.body.ref),
    ["refs/heads/content-drafts-1", "content-drafts-1"],
  );
  assert.ok(writes.every((write) => !("force" in write.body)));
});

test("publish merges only the reviewed immutable draft revision into main", async () => {
  const { call, writes } = fixture();
  const response = await call({
    action: "publish",
    draftSha: draft,
    publishedSha: main,
  });
  assert.equal(response.status, 200);
  assert.equal(writes.length, 1);
  assert.equal(writes[0].body.base, "main");
  assert.equal(writes[0].body.head, draft);
});

test("a newer save in another tab requires reviewing again", async () => {
  const { call, writes } = fixture({ draft: newer });
  assert.equal(
    (await call({ action: "publish", draftSha: draft, publishedSha: main }))
      .status,
    409,
  );
  assert.equal(writes.length, 0);
});

test("a changed production revision also requires reviewing again", async () => {
  const { call, writes } = fixture();
  assert.equal(
    (await call({ action: "publish", draftSha: draft, publishedSha: newer }))
      .status,
    409,
  );
  assert.equal(writes.length, 0);
});

test("code changes, unsafe renames and truncated comparisons cannot publish", async () => {
  for (const files of [
    [{ filename: "package.json", status: "modified" }],
    [
      {
        filename: "src/content/file.mdx",
        previous_filename: "src/app/page.tsx",
        status: "renamed",
      },
    ],
    Array.from({ length: 300 }, (_, i) => ({
      filename: `src/content/${i}.mdx`,
      status: "added",
    })),
  ]) {
    const { call, writes } = fixture({ files });
    assert.equal(
      (await call({ action: "publish", draftSha: draft, publishedSha: main }))
        .status,
      409,
    );
    assert.equal(writes.length, 0);
  }
});

test("published/behind drafts do not create duplicate deployments", async () => {
  const { call, writes } = fixture({ compareStatus: "behind" });
  const response = await call({
    action: "publish",
    draftSha: draft,
    publishedSha: main,
  });
  assert.equal((await response.json()).published, false);
  assert.equal(writes.length, 0);
});

test("conflicts report a recoverable error without resetting draft history", async () => {
  const { call, writes } = fixture({ conflict: true });
  const response = await call({
    action: "publish",
    draftSha: draft,
    publishedSha: main,
  });
  assert.equal(response.status, 409);
  assert.match((await response.json()).error, /conflicts/);
  assert.equal(writes.length, 1);
});

test("review includes the Git patch and a comparison of the exact reviewed revisions", async () => {
  const patch = "@@ -1 +1 @@\n-before\n+after";
  const { call } = fixture({
    files: [{ ...changed[0], patch, additions: 1, deletions: 1 }],
  });
  const result = await (await call()).json();
  assert.equal(result.files[0].patch, patch);
  assert.equal(
    result.comparisonUrl,
    `https://github.com/team/site/compare/${main}...${draft}`,
  );
});

test("each authenticated editor reads and publishes only their own draft", async () => {
  const alice = fixture({ userId: 1, draft, files: changed });
  const bob = fixture({
    userId: 2,
    draft: newer,
    files: [{ filename: "src/content/bobs-page.mdx", status: "modified" }],
  });
  const a = await (await alice.call()).json();
  const b = await (await bob.call()).json();
  assert.equal(a.draftBranch, "content-drafts-1");
  assert.equal(b.draftBranch, "content-drafts-2");
  assert.equal(a.files[0].filename, changed[0].filename);
  assert.equal(b.files[0].filename, "src/content/bobs-page.mdx");
  // Supplying another person's branch and exact SHA never grants access to it.
  assert.equal(
    (
      await bob.call({
        action: "publish",
        draftBranch: a.draftBranch,
        draftSha: a.draftSha,
        publishedSha: main,
      })
    ).status,
    409,
  );
  assert.equal(bob.writes.length, 0);
  assert.equal(
    (
      await bob.call({
        action: "publish",
        draftSha: b.draftSha,
        publishedSha: main,
      })
    ).status,
    200,
  );
  assert.equal(bob.writes[0].body.head, newer);
  assert.equal(alice.writes.length, 0);
  assert.equal((await (await alice.call()).json()).files.length, 1);
});

test("a new editor starts from published content, never the legacy shared draft", async () => {
  const { call, writes } = fixture({ userId: 2, draft: null, files: [] });
  assert.equal((await call({ action: "prepare" })).status, 200);
  assert.deepEqual(writes[0].body, {
    ref: "refs/heads/content-drafts-2",
    sha: main,
  });
});

test("older shared-draft clients cannot prepare or publish", async () => {
  const { call, writes } = fixture();
  for (const action of ["prepare", "publish"]) {
    const response = await call({
      action,
      version: undefined,
      draftSha: draft,
      publishedSha: main,
    });
    assert.equal(response.status, 409);
    assert.match((await response.json()).error, /Reload Keystatic/);
  }
  assert.equal(writes.length, 0);
});
