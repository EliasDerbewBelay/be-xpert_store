"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { ShoppingBag, ShoppingCart, Search, User as UserIcon, LogOut } from "lucide-react";
import { MobileMenu } from "./MobileMenu";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { useCart } from "@/lib/cart/cart-context";
import { useAuth } from "@/lib/auth/auth-context";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/lib/toast/toast-context";

export function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const { totalItems } = useCart();
  const { user, logout } = useAuth();
  const { success } = useToast();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?title=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  const handleLogout = () => {
    logout();
    success("Logged out successfully");
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: Logo & Desktop Navigation */}
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="flex items-center gap-2 font-bold text-base tracking-tight text-foreground transition-opacity hover:opacity-90 sm:text-lg"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <ShoppingBag className="h-4 w-4" aria-hidden="true" />
            </span>
            <span>
              Be-xpert <span className="font-semibold">Store</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-5 text-sm font-medium">
            <Link
              href="/"
              className={`transition-colors hover:text-foreground ${
                pathname === "/"
                  ? "font-semibold text-primary underline decoration-2 underline-offset-8"
                  : "text-muted-foreground"
              }`}
            >
              Home
            </Link>
            <Link
              href="/products"
              className={`transition-colors hover:text-foreground ${
                pathname.startsWith("/products")
                  ? "font-semibold text-primary underline decoration-2 underline-offset-8"
                  : "text-muted-foreground"
              }`}
            >
              Products
            </Link>
            <Link
              href="/categories"
              className={`transition-colors hover:text-foreground ${
                pathname.startsWith("/categories")
                  ? "font-semibold text-primary underline decoration-2 underline-offset-8"
                  : "text-muted-foreground"
              }`}
            >
              Categories
            </Link>
            {user?.role === "admin" && (
              <Link
                href="/admin"
                className={`flex items-center gap-1 transition-colors hover:text-foreground ${
                  pathname.startsWith("/admin")
                    ? "font-semibold text-primary"
                    : "text-muted-foreground"
                }`}
              >
                <span>Admin</span>
                <span className="rounded-full bg-primary px-1.5 py-0.2 text-[10px] font-bold text-primary-foreground">
                  Panel
                </span>
              </Link>
            )}
          </nav>
        </div>

        {/* Center: Desktop Search Input */}
        <div className="hidden lg:flex flex-1 max-w-xs mx-4">
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-9 w-full rounded-full border border-border bg-secondary/70 pl-9 pr-4 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </form>
        </div>

        {/* Right: Cart, Account, Theme, Mobile Menu */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Cart Icon */}
          <Link href="/cart">
            <Button
              variant="ghost"
              size="icon"
              className="relative h-9 w-9 text-foreground"
              aria-label="View shopping cart"
            >
              <ShoppingCart className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
                {totalItems > 99 ? "99+" : totalItems}
              </span>
            </Button>
          </Link>

          {/* Desktop Account Dropdown */}
          <div className="hidden md:flex items-center">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-9 w-9 rounded-full p-0"
                    aria-label="User account menu"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback>{user.name?.charAt(0) || "U"}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.name}</p>
                      <p className="text-xs leading-none text-muted-foreground truncate">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="cursor-pointer">
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  {user?.role === "admin" && (
                    <DropdownMenuItem asChild>
                      <Link href="/admin" className="cursor-pointer font-medium text-primary">
                        Admin Dashboard
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem asChild>
                    <Link href="/cart" className="cursor-pointer">
                      Cart ({totalItems})
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="text-destructive cursor-pointer"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log Out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/login">
                <Button variant="ghost" size="sm" className="gap-2">
                  <UserIcon className="h-4 w-4" />
                  <span>Log In</span>
                </Button>
              </Link>
            )}
          </div>

          {/* Theme Toggle (Desktop) */}
          <div className="hidden sm:block">
            <ThemeToggle />
          </div>

          {/* Mobile Menu Drawer Button */}
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}
