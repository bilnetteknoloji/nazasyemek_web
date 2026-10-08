/** settings → `stats`: ana sayfa rakamları, sıra `src/data/home.ts` ile aynı. */
export type StatsSettings = {
  quick: { value: string; label: string }[];
  capacity: { label: string; value: string; plus: string; note: string }[];
};
