import React from "react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="w-full border-t border-border bg-background py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-foreground tracking-tight">E-Store</span>
          <span>— Clean modern e-commerce</span>
        </div>

        <nav className="flex items-center gap-6">
          <Link href="/" className="hover:text-foreground transition-colors">
            Home
          </Link>
          <Link href="/products" className="hover:text-foreground transition-colors">
            Products
          </Link>
          <Link href="/categories" className="hover:text-foreground transition-colors">
            Categories
          </Link>
        </nav>

        <p className="text-xs">
          &copy; {new Date().getFullYear()} E-Store. Powered by EscuelaJS API.
        </p>
      </div>
    </footer>
  );
}
