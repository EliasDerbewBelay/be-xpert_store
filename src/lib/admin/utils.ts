const CATEGORY_STYLES: Record<string, string> = {
  electronics:
    "bg-primary/10 text-primary border-primary/15",
  shoes:
    "bg-primary/10 text-primary border-primary/15",
  clothes:
    "bg-secondary text-secondary-foreground border-border",
  bags:
    "bg-accent text-accent-foreground border-primary/15",
  furniture:
    "bg-secondary text-secondary-foreground border-border",
  miscellaneous:
    "bg-muted text-muted-foreground border-border",
};

const FALLBACK_STYLES = [
  "bg-primary/10 text-primary border-primary/15",
  "bg-accent text-accent-foreground border-primary/15",
  "bg-secondary text-secondary-foreground border-border",
  "bg-muted text-muted-foreground border-border",
];

export function getCategoryBadgeClass(name?: string): string {
  if (!name) {
    return "bg-muted text-muted-foreground border-border";
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
