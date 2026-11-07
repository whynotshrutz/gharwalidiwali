import type { Metadata } from "next";
import { Instrument_Sans, Playfair_Display } from "next/font/google";
import "./globals.css";
const sans = Instrument_Sans({ variable: "--font-sans", subsets: ["latin"] });
const serif = Playfair_Display({ variable: "--font-display", subsets: ["latin"], weight: ["500","600","700"] });
export const metadata: Metadata = { title: "Ghar Wali Diwali — Wherever you are, bring a little Diwali home", description: "A cinematic Banaras Ganga ghat Diwali experience and My Home jhalar studio." };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en" className={`${sans.variable} ${serif.variable} h-full`}><body className="min-h-full">{children}</body></html>;
}
