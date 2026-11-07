import { NextResponse } from "next/server";

const OWNER = "whynotshrutz";
const REPO = "gharwalidiwali-wall";
const FILE = "wall.json";
const LIMIT = 20;

type Post = {
  id: string; owner: string; name: string; text: string; kind: string;
  image?: string; createdAt: number; hidden?: boolean;
};

async function gh(path: string, init?: RequestInit) {
  const token = process.env.GITHUB_TOKEN;
  if (!token) return null;
  return fetch(`https://api.github.com${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
    cache: "no-store",
  });
}

export async function GET() {
  const res = await gh(`/repos/${OWNER}/${REPO}/contents/${FILE}`);
  if (!res) return NextResponse.json({ posts: [], shared: false });
  if (!res.ok) return NextResponse.json({ posts: [], shared: false });
  const data = await res.json();
  const content = Buffer.from(data.content, "base64").toString("utf8");
  let posts: Post[] = [];
  try { posts = JSON.parse(content).posts ?? []; } catch { posts = []; }
  return NextResponse.json({ posts, shared: true, sha: data.sha });
}

export async function POST(req: Request) {
  const token = process.env.GITHUB_TOKEN;
  if (!token) return NextResponse.json({ ok: false, shared: false }, { status: 501 });
  const body = await req.json().catch(() => ({}));
  const action = body?.action ?? "add";

  const getRes = await gh(`/repos/${OWNER}/${REPO}/contents/${FILE}`);
  if (!getRes || !getRes.ok) return NextResponse.json({ ok: false }, { status: 502 });
  const file = await getRes.json();
  const sha = file.sha;
  let posts: Post[] = [];
  try { posts = JSON.parse(Buffer.from(file.content, "base64").toString("utf8")).posts ?? []; } catch { posts = []; }

  if (action === "add") {
    const post = body.post as Post;
    if (!post || typeof post.id !== "string") return NextResponse.json({ ok: false }, { status: 400 });
    posts = [post, ...posts].slice(0, LIMIT);
  } else if (action === "remove") {
    posts = posts.filter((p) => p.id !== body.id);
  } else if (action === "hide") {
    posts = posts.map((p) => (p.id === body.id ? { ...p, hidden: !!body.hidden } : p));
  } else {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const newContent = Buffer.from(JSON.stringify({ posts })).toString("base64");
  const putRes = await gh(`/repos/${OWNER}/${REPO}/contents/${FILE}`, {
    method: "PUT",
    body: JSON.stringify({ message: `wall ${action}`, content: newContent, sha }),
  });
  if (!putRes || !putRes.ok) return NextResponse.json({ ok: false }, { status: 502 });
  return NextResponse.json({ ok: true, shared: true });
}
