/** Случайный элемент списка, отличный от `exclude` (если есть из чего выбирать). */
export function pickRandom<T>(items: readonly T[], exclude?: T, random: () => number = Math.random): T | undefined {
  const pool = items.length > 1 ? items.filter((item) => item !== exclude) : items;
  return pool[Math.floor(random() * pool.length)];
}
