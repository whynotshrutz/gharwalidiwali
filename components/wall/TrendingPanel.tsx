"use client";
import { Gift, Home, Sparkles, UtensilsCrossed, type LucideIcon } from "lucide-react";

const GROUPS: { title: string; icon: LucideIcon; items: { heading: string; body: string }[] }[] = [
  {
    title: "Decor",
    icon: Sparkles,
    items: [
      { heading: "Reusable and handmade", body: "Brass diyas, paper marigolds and homemade rangoli colours. Zero plastic guilt, maximum glow." },
      { heading: "A bowl of floating diyas", body: "Water, petals, tea lights. Suddenly your coffee table is a tiny ghat." },
      { heading: "Lights in the garlands", body: "Warm fairy lights woven through marigold strings — the original ring light." },
      { heading: "Quieter rangoli", body: "Smaller patterns, fewer colours, more intention. Your floor, your rules." },
      { heading: "LED diyas for rented flats", body: "Flame-free, landlord-friendly, still very warm." },
    ],
  },
  {
    title: "Food",
    icon: UtensilsCrossed,
    items: [
      { heading: "The classics stay", body: "Ladoo, kaju katli, mysore pak, soan papdi. The usual suspects, still undefeated." },
      { heading: "Lighter sweets", body: "Dates halwa, coconut burfi, dry-fruit rolls. Sweet, but make it sensible." },
      { heading: "No-cook before puja", body: "Quick sweets you can assemble without the stove. Puja first, panic later." },
      { heading: "One thing, made at home", body: "Suji halwa or besan ladoo in twenty minutes. Homemade counts even if it is tiny." },
    ],
  },
  {
    title: "Gifting",
    icon: Gift,
    items: [
      { heading: "Lights for faraway friends", body: "Rangoli kits, rice lights and tiny diyas ship well. Distance, but make it festive." },
      { heading: "Eco hampers", body: "Diyas, dry fruit and a handwritten note. The note does most of the work." },
      { heading: "Something for the elders", body: "Silver coins and small home decor. They will pretend not to be delighted." },
      { heading: "The warmest gift is free", body: "Send a photo of your jhalars. Instant serotonin, zero delivery fee." },
    ],
  },
  {
    title: "Staying back",
    icon: Home,
    items: [
      { heading: "One diya, one call", body: "Light it at aarti time and keep the speaker loud. The family will hear the glow." },
      { heading: "Decorate one corner", body: "A dupatta, a family photo, a diya. That is a whole Diwali if you believe hard enough." },
      { heading: "Knock on one door", body: "Take sweets to a neighbour who also stayed back. Instant alliance." },
      { heading: "Dress up anyway", body: "It changes the evening more than the decorations. Trust." },
    ],
  },
];

export default function TrendingPanel({ onGoHome, onGoGhat }: { onGoHome?: () => void; onGoGhat?: () => void }) {
  return <div>
    <div className="mb-4 flex items-start justify-between gap-3">
      <div>
        <p className="eyebrow">This Diwali</p>
        <h2 className="title-serif mt-1 text-2xl font-semibold sm:text-3xl">What is inspiring people (and their group chats)</h2>
        <p className="mt-1 max-w-xl text-sm text-[var(--cream-dim)]">Small ideas to steal, lovingly. Pick one and make it yours.</p>
      </div>
      <Sparkles className="mt-1 hidden flex-none text-[var(--gold)] sm:block" size={22}/>
    </div>

    <div className="grid gap-3 md:grid-cols-2">
      {GROUPS.map(({ title, icon: Icon, items }) => (
        <section key={title} className="glass rounded-2xl p-4 sm:p-5">
          <header className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--gold)]/12 text-[var(--gold-soft)]"><Icon size={15}/></span>
            <h3 className="title-serif text-lg">{title}</h3>
          </header>
          <ul className="mt-3 space-y-2.5">
            {items.map(item => (
              <li key={item.heading} className="border-t border-[var(--line)]/60 pt-2.5 first:border-0 first:pt-0">
                <p className="text-sm font-medium text-[var(--cream)]">{item.heading}</p>
                <p className="text-xs leading-relaxed text-[var(--cream-dim)]">{item.body}</p>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>

    <div className="mt-5 flex flex-wrap items-center gap-2">
      {onGoHome && <button onClick={onGoHome} className="flex items-center gap-2 rounded-full bg-[var(--gold)] px-4 py-2.5 text-sm font-semibold text-[#16121b] hover:bg-[var(--gold-soft)]"><Home size={15}/> Decorate your ghar</button>}
      {onGoGhat && <button onClick={onGoGhat} className="glass flex items-center gap-2 rounded-full px-4 py-2.5 text-sm hover:bg-white/10"><Sparkles size={15}/> Wander the ghat</button>}
    </div>
  </div>;
}
