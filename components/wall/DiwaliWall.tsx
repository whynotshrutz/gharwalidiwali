"use client";
import { useEffect, useRef, useState } from "react";
import { Eye, EyeOff, Flame, Images, ImagePlus, RotateCcw, Send, Sparkles, Trash2, TrendingUp, X } from "lucide-react";
import { addPost, compressImage, removePost, setPostHidden, useWallOwner, useWallPosts, type WallKind, type WallPost } from "@/lib/wall";
import TrendingPanel from "./TrendingPanel";

export default function DiwaliWall({ onGoHome, onGoGhat }: { onGoHome?: () => void; onGoGhat?: () => void }) {
  const posts = useWallPosts();
  const owner = useWallOwner();
  const [tab, setTab] = useState<"wall" | "trending">("wall");
  const [manage, setManage] = useState(false);
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [kind, setKind] = useState<WallKind>("wish");
  const [image, setImage] = useState<string | null>(null);
  const [preparing, setPreparing] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const noticeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => { if (noticeTimer.current) clearTimeout(noticeTimer.current); }, []);

  const hiddenCount = posts.filter(p => p.hidden).length;
  const visible = posts.filter(p => manage || !p.hidden);

  const flash = (msg: string) => {
    setNotice(msg);
    if (noticeTimer.current) clearTimeout(noticeTimer.current);
    noticeTimer.current = setTimeout(() => setNotice(""), 2600);
  };

  const handleImage = async (file?: File) => {
    if (!file) return;
    setPreparing(true);
    try {
      setImage(await compressImage(file));
      setError("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "That photo couldn't be added.");
    } finally {
      setPreparing(false);
    }
  };

  const publish = () => {
    if (!text.trim() && !image) { setError("Give us a photo or a few words first."); return; }
    const result = addPost({ name: name.trim().slice(0, 40), text: text.trim().slice(0, 280), kind, image: image ?? undefined });
    if (!result.ok) { setError(result.error ?? "Couldn't save that post."); return; }
    setName(""); setText(""); setImage(null); setError("");
    flash("Pinned. The wall is a little brighter now.");
  };

  return <div className="absolute inset-0 overflow-y-auto overscroll-contain" style={{ background: "radial-gradient(ellipse at 50% -10%, #1b2447 0%, #0a1024 45%, #05070f 100%)" }}>
    <div className="pointer-events-none absolute inset-x-0 top-0 h-[420px] opacity-70" aria-hidden="true" style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(201,164,92,.22) 0%, rgba(201,164,92,0) 65%)" }}/>
    <div className="relative mx-auto max-w-5xl px-4 pb-24 pt-24 sm:px-6 sm:pt-28">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="eyebrow flex items-center gap-1.5"><Sparkles size={12}/> Ghar Wali Diwali</p>
          <h1 className="title-serif mt-1.5 text-[clamp(2rem,6vw,3.25rem)] font-semibold leading-tight">Diwali Wall</h1>
          <p className="mt-1.5 max-w-xl text-sm text-[var(--cream-dim)]">Post a photo, a wish, or a tiny note. Keep it warm, keep it short, keep it yours.</p>
        </div>
        {posts.length > 0 && <button onClick={() => setManage(m => !m)} aria-pressed={manage} className={`glass flex items-center gap-2 rounded-full px-3.5 py-2 text-xs ${manage ? "bg-[var(--gold)]/15 text-[var(--gold-soft)]" : "hover:bg-white/10"}`}>
          {manage ? <EyeOff size={14}/> : <Eye size={14}/>} {manage ? "Done managing" : "Manage"} {hiddenCount > 0 && <span className="rounded-full bg-white/10 px-1.5 py-0.5 text-[10px]">{hiddenCount} hidden</span>}
        </button>}
      </header>

      <div className="mt-5 flex w-fit rounded-full bg-white/5 p-1" role="tablist" aria-label="Diwali wall views">
        <button role="tab" aria-selected={tab === "wall"} onClick={() => setTab("wall")} className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm ${tab === "wall" ? "bg-[var(--gold)] font-semibold text-[#16121b]" : "text-[var(--cream-dim)] hover:text-[var(--cream)]"}`}><Images size={15}/> The wall</button>
        <button role="tab" aria-selected={tab === "trending"} onClick={() => setTab("trending")} className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm ${tab === "trending" ? "bg-[var(--gold)] font-semibold text-[#16121b]" : "text-[var(--cream-dim)] hover:text-[var(--cream)]"}`}><TrendingUp size={15}/> Trending</button>
      </div>

      {tab === "trending" ? <div className="mt-6"><TrendingPanel onGoHome={onGoHome} onGoGhat={onGoGhat}/></div> : <div className="mt-6">
        <section className="glass rounded-3xl p-4 sm:p-5" aria-label="Add a post">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="eyebrow flex items-center gap-1.5"><Sparkles size={12}/> Add your bit</p>
            <div className="flex rounded-full bg-white/5 p-0.5 text-xs" role="group" aria-label="Post type">
              {(["wish", "feedback"] as WallKind[]).map(k => <button key={k} onClick={() => setKind(k)} aria-pressed={kind === k} className={`rounded-full px-3 py-1.5 capitalize ${kind === k ? "bg-[var(--gold)] font-semibold text-[#16121b]" : "hover:bg-white/10"}`}>{k}</button>)}
            </div>
          </div>
          <div className="mt-3 grid gap-2">
            <input value={name} onChange={e => setName(e.target.value)} maxLength={40} placeholder="Your name (or a dramatic alias)" aria-label="Your name" className="w-full rounded-xl border border-[var(--line)] bg-white/5 px-3 py-2 text-sm placeholder:text-[var(--cream-dim)]/60"/>
            <textarea value={text} onChange={e => setText(e.target.value)} maxLength={280} rows={3} placeholder="A wish, a memory, or a tiny review of this little Diwali..." aria-label="Your message" className="w-full resize-y rounded-xl border border-[var(--line)] bg-white/5 px-3 py-2 text-sm placeholder:text-[var(--cream-dim)]/60"/>
          </div>
          <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <label className="glass flex cursor-pointer items-center gap-2 rounded-full px-3 py-2 text-xs hover:bg-white/10">
                <ImagePlus size={14}/> {preparing ? "Compressing…" : image ? "Change photo" : "Add photo"}
                <input type="file" accept="image/*" className="hidden" disabled={preparing} aria-label="Add a Diwali photo" onChange={e => { void handleImage(e.target.files?.[0]); e.target.value = ""; }}/>
              </label>
              {image && <div className="relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={image} alt="Your photo preview" className="h-10 w-10 rounded-lg object-cover ring-1 ring-[var(--line)]"/>
                <button onClick={() => setImage(null)} aria-label="Remove photo" className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#1b2447] ring-1 ring-[var(--line)]"><X size={11}/></button>
              </div>}
            </div>
            <button onClick={publish} disabled={preparing} className="flex items-center gap-2 rounded-full bg-[var(--gold)] px-5 py-2.5 text-sm font-semibold text-[#16121b] hover:bg-[var(--gold-soft)] disabled:opacity-50"><Send size={15}/> Pin it</button>
          </div>
          <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
            <p className="text-[10px] text-[var(--cream-dim)]">Saved on this device · Photos get compressed · Be kind, it is Diwali.</p>
            <div className="text-right">
              {error && <p role="alert" className="text-[11px] text-red-300">{error}</p>}
              {notice && <p role="status" className="text-[11px] text-[var(--gold-soft)]">{notice}</p>}
            </div>
          </div>
        </section>

        <div className="mt-6 flex items-baseline justify-between">
          <h2 className="title-serif text-xl">On the wall</h2>
          <p className="text-xs text-[var(--cream-dim)]">{prettyCount(visible.length)} {visible.length === 1 ? "note" : "notes"}</p>
        </div>

        {visible.length === 0 ? <div className="glass mt-3 rounded-3xl p-8 text-center">
          <Flame className="mx-auto mb-2 text-[var(--gold)]" size={26}/>
          <p className="title-serif text-lg">The wall is waiting for its first diya (no pressure).</p>
          <p className="mt-1 text-sm text-[var(--cream-dim)]">Your photo, your room, your rangoli — or a two-line wish typed with one hand while holding mithai.</p>
        </div> : <div className="mt-3 columns-1 gap-3 sm:columns-2 lg:columns-3">
          {visible.map(post => <PostCard key={post.id} post={post} owner={owner} manage={manage} onHide={() => setPostHidden(post.id, !post.hidden)} onDelete={() => removePost(post.id)}/>)}
        </div>}
      </div>}
    </div>
  </div>;
}

function PostCard({ post, owner, manage, onHide, onDelete }: { post: WallPost; owner: string; manage: boolean; onHide: () => void; onDelete: () => void }) {
  const mine = owner !== "" && post.owner === owner;
  const date = new Date(post.createdAt).toLocaleDateString(undefined, { day: "numeric", month: "short" });
  return <article className={`mb-3 break-inside-avoid overflow-hidden rounded-2xl border border-[var(--line)] bg-[#111833]/75 ${post.hidden ? "opacity-60" : ""}`}>
    {post.image && <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={post.image} alt={`Photo shared by ${post.name || "a visitor"}`} className="w-full"/>
    </>}
    <div className="p-3.5">
      <div className="flex items-center justify-between gap-2">
        <p className="flex min-w-0 items-center gap-2 text-sm font-medium">
          <span className="truncate">{post.name || "A visitor"}</span>
          <span className={`flex-none rounded-full px-2 py-0.5 text-[10px] ${post.kind === "wish" ? "bg-[var(--gold)]/15 text-[var(--gold-soft)]" : "bg-teal-400/15 text-teal-200"}`}>{post.kind === "wish" ? "Wish" : "Feedback"}</span>
          {post.hidden && <span className="flex-none rounded-full bg-white/10 px-2 py-0.5 text-[10px]">Hidden</span>}
        </p>
        <span className="flex-none text-[10px] text-[var(--cream-dim)]">{date}</span>
      </div>
      {post.text && <p className="mt-1.5 whitespace-pre-wrap text-sm leading-relaxed text-[var(--cream-dim)]">{post.text}</p>}
      {(manage || mine) && <div className="mt-2.5 flex items-center gap-3 border-t border-[var(--line)]/50 pt-2 text-[11px]">
        <button onClick={onHide} className="flex items-center gap-1 text-[var(--cream-dim)] hover:text-[var(--cream)]">{post.hidden ? <><RotateCcw size={12}/> Restore</> : <><EyeOff size={12}/> Hide</>}</button>
        {manage && <button onClick={onDelete} className="flex items-center gap-1 text-red-300/80 hover:text-red-300"><Trash2 size={12}/> Delete</button>}
      </div>}
    </div>
  </article>;
}

function prettyCount(n: number) { return n > 99 ? "99+" : String(n); }
