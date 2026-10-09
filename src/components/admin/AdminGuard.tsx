"use client";

import React, { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, LogIn, ShieldAlert } from "lucide-react";
import { useAuth } from "@/lib/auth/auth-context";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

interface AdminGuardProps {
  children: React.ReactNode;
}

export function AdminGuard({ children }: AdminGuardProps) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [user, isLoading, router, pathname]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-secondary/50">
        <div className="hidden w-64 shrink-0 bg-brand-dark lg:block" />
        <div className="flex-1 space-y-6 p-6 sm:p-8">
          <Skeleton className="h-8 w-64" />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <Skeleton className="h-32 w-full rounded-2xl" />
            <Skeleton className="h-32 w-full rounded-2xl" />
            <Skeleton className="h-32 w-full rounded-2xl" />
            <Skeleton className="h-32 w-full rounded-2xl" />
          </div>
          <Skeleton className="h-96 w-full rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (user.role !== "admin") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-secondary px-4 dark:bg-background">
        <div className="max-w-md space-y-5 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400">
            <ShieldAlert className="h-8 w-8" />
          </div>

          <div className="space-y-1.5">
            <h1 className="text-2xl font-bold tracking-tight">
              Admin Access Required
            </h1>
            <p className="text-sm text-muted-foreground">
              You are currently signed in as{" "}
              <span className="font-semibold text-foreground">{user.name}</span>{" "}
              ({user.role || "customer"}). This area is restricted to
              administrator accounts.
            </p>
          </div>

          <div className="flex flex-col justify-center gap-2.5 pt-4 sm:flex-row">
            <Button asChild>
              <Link href="/login?redirect=/admin" className="gap-2">
                <LogIn className="h-4 w-4" />
                Sign In with Admin Account
              </Link>
            </Button>

            <Button asChild variant="outline">
              <Link href="/" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Store
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
