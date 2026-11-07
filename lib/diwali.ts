const DIWALI_DATES = [
  new Date(2026, 10, 8),
  new Date(2027, 9, 29),
  new Date(2028, 9, 17),
];

export function diwaliLine(now = new Date()): string {
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const next = DIWALI_DATES.find((d) => d.getTime() >= today.getTime());
  if (!next) return "Shubh Deepawali";
  const diff = Math.round((next.getTime() - today.getTime()) / 86_400_000);
  if (diff === 0) return "Happy Diwali";
  if (diff === 1) return "Diwali is tomorrow";
  return `Diwali in ${diff} days`;
}
