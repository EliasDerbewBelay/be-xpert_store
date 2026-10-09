import React, { Suspense } from "react";
import type { Metadata } from "next";
import { LoginForm } from "@/components/auth/LoginForm";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = {
  title: "Login",
  description: "Sign in to your account.",
};

export default function LoginPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex items-center justify-center min-h-[calc(100vh-16rem)]">
      <Suspense
        fallback={
          <div className="w-full max-w-md mx-auto space-y-4">
            <Skeleton className="h-8 w-40 mx-auto" />
            <Skeleton className="h-4 w-60 mx-auto" />
            <Skeleton className="h-64 w-full rounded-lg" />
          </div>
        }
      >
        <LoginForm />
      </Suspense>
    </div>
  );
}
