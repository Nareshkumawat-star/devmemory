import { DateTime } from "luxon";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export { clsx };
export type { ClassValue };

/** shadcn/ui standard class merger: conditional classes + Tailwind conflict resolution. */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export function classNames(...classes: (string | false | undefined | null)[]): string {
  return clsx(classes);
}

const DAY_MS = 86_400_000;

export function relativeTime(timestamp: number | Date): string {
  const millis = timestamp instanceof Date ? timestamp.getTime() : timestamp;
  const diff = DateTime.now().toUTC().diff(DateTime.fromMillis(millis).toUTC());
  const days = Math.floor(diff.as("milliseconds") / DAY_MS);

  if (days === 0) {
    const hours = Math.floor(diff.as("hours"));
    return hours <= 1 ? "an hour ago" : `${hours} hours ago`;
  }

  if (days === 1) return "yesterday";
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
  return `${Math.floor(days / 30)} months ago`;
}

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export function truncate(value: string, length = 120): string {
  return value.length > length ? value.slice(0, length) + "…" : value;
}

export function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function pick<T>(items: T[], n: number): T[] {
  const result = new Set<T>();
  const pool = [...items];
  while (result.size < n && pool.length) {
    const index = Math.floor(Math.random() * pool.length);
    result.add(pool.splice(index, 1)[0]);
  }
  return [...result];
}
