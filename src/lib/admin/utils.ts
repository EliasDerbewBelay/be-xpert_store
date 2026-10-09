const CATEGORY_STYLES: Record<string, string> = {
  electronics: "bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-900",
  shoes: "bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-900",
  clothes: "bg-violet-50 text-violet-700 border-violet-100 dark:bg-violet-950/50 dark:text-violet-300 dark:border-violet-900",
  bags: "bg-orange-50 text-orange-700 border-orange-100 dark:bg-orange-950/50 dark:text-orange-300 dark:border-orange-900",
  furniture: "bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-900",
  miscellaneous: "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700",
};

const FALLBACK_STYLES = [
  "bg-sky-50 text-sky-700 border-sky-100 dark:bg-sky-950/50 dark:text-sky-300 dark:border-sky-900",
  "bg-rose-50 text-rose-700 border-rose-100 dark:bg-rose-950/50 dark:text-rose-300 dark:border-rose-900",
  "bg-teal-50 text-teal-700 border-teal-100 dark:bg-teal-950/50 dark:text-teal-300 dark:border-teal-900",
  "bg-indigo-50 text-indigo-700 border-indigo-100 dark:bg-indigo-950/50 dark:text-indigo-300 dark:border-indigo-900",
];

export function getCategoryBadgeClass(name?: string): string {
  if (!name) {
    return "bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700";
  }

  const key = name.toLowerCase().trim();
  if (CATEGORY_STYLES[key]) return CATEGORY_STYLES[key];

  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    hash = (hash + key.charCodeAt(i) * (i + 1)) % FALLBACK_STYLES.length;
  }
  return FALLBACK_STYLES[hash];
}

export function getGreeting(date = new Date()): string {
  const hour = date.getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export function formatAdminDate(value?: string): string {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatRelativeTime(value?: string): string {
  if (!value) return "Recently";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Recently";

  const diffMs = Date.now() - date.getTime();
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;

  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} day${days === 1 ? "" : "s"} ago`;

  return formatAdminDate(value);
}
