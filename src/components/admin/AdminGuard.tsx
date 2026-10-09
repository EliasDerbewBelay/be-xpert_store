"use client";

import React, { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth/auth-context";
import { useToast } from "@/lib/toast/toast-context";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ShieldAlert, ShieldCheck, ArrowLeft, LogIn } from "lucide-react";
import Link from "next/link";

interface AdminGuardProps {
  children: React.ReactNode;
}

export function AdminGuard({ children }: AdminGuardProps) {
  const { user, isLoading, login } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const { success, error } = useToast();
  const [isSwitching, setIsSwitching] = React.useState(false);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [user, isLoading, router, pathname]);

  const handleDemoAdminLogin = async () => {
    try {
      setIsSwitching(true);
      await login({ email: "admin@mail.com", password: "admin123" });
      success("Logged in as Admin (admin@mail.com)");
    } catch {
      error("Failed to sign in as demo admin.");
    } finally {
      setIsSwitching(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto py-12 space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-9 w-32" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Skeleton className="h-24 w-full rounded-lg" />
          <Skeleton className="h-24 w-full rounded-lg" />
          <Skeleton className="h-24 w-full rounded-lg" />
        </div>
        <Skeleton className="h-96 w-full rounded-lg" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  // If user is logged in but not an admin
  if (user.role !== "admin") {
    return (
      <div className="max-w-md mx-auto py-16 px-4 text-center space-y-5">
        <div className="mx-auto h-16 w-16 rounded-full bg-amber-100 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center">
          <ShieldAlert className="h-8 w-8" />
        </div>

        <div className="space-y-1.5">
          <h1 className="text-2xl font-bold tracking-tight">Admin Access Required</h1>
          <p className="text-sm text-muted-foreground">
            You are currently signed in as <span className="font-semibold text-foreground">{user.name}</span> ({user.role || "customer"}). This area is restricted to administrator accounts.
          </p>
        </div>

        <div className="rounded-lg border border-border bg-card p-4 text-left text-xs text-muted-foreground space-y-2">
          <div className="flex items-center gap-1.5 font-semibold text-foreground">
            <ShieldCheck className="h-4 w-4 text-primary" />
            <span>Demo Admin Credentials</span>
          </div>
          <p>Email: <span className="font-mono text-foreground">admin@mail.com</span></p>
          <p>Password: <span className="font-mono text-foreground">admin123</span></p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row gap-2.5 justify-center">
          <Button
            onClick={handleDemoAdminLogin}
            disabled={isSwitching}
            className="gap-2"
          >
            <LogIn className="h-4 w-4" />
            <span>{isSwitching ? "Switching..." : "Switch to Admin Account"}</span>
          </Button>

          <Button asChild variant="outline">
            <Link href="/" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Store</span>
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
