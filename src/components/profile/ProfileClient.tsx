"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/auth-context";
import { useToast } from "@/lib/toast/toast-context";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { LogOut, ShoppingBag, User, Mail, Shield } from "lucide-react";
import Link from "next/link";

export function ProfileClient() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { success } = useToast();

  if (!user) return null;

  const handleLogout = () => {
    logout();
    success("Logged out successfully");
    router.push("/login");
  };

  return (
    <div className="max-w-2xl mx-auto py-8 space-y-6">
      <div className="pb-4 border-b border-border">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Your Profile</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Manage your account information and preferences
        </p>
      </div>

      <div className="rounded-lg border border-border bg-card p-6 shadow-sm space-y-6">
        {/* User Avatar & Main Info */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
          <Avatar className="h-20 w-20 border-2 border-border shadow-sm">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback className="text-lg">
              {user.name?.charAt(0) || "U"}
            </AvatarFallback>
          </Avatar>

          <div className="space-y-1 text-center sm:text-left flex-1">
            <h2 className="text-xl font-bold">{user.name}</h2>
            <p className="text-sm text-muted-foreground">{user.email}</p>
            {user.role && (
              <span className="inline-block mt-2 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-secondary text-secondary-foreground border border-border uppercase tracking-wider">
                {user.role}
              </span>
            )}
          </div>
        </div>

        {/* Account Details List */}
        <div className="border-t border-border pt-4 divide-y divide-border text-sm">
          <div className="py-3 flex items-center justify-between">
            <div className="flex items-center gap-2 text-muted-foreground">
              <User className="h-4 w-4" />
              <span>Full Name</span>
            </div>
            <span className="font-medium">{user.name}</span>
          </div>

          <div className="py-3 flex items-center justify-between">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Mail className="h-4 w-4" />
              <span>Email Address</span>
            </div>
            <span className="font-medium">{user.email}</span>
          </div>

          <div className="py-3 flex items-center justify-between">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Shield className="h-4 w-4" />
              <span>Account ID</span>
            </div>
            <span className="font-mono text-xs">{user.id}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="pt-4 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3">
          <Button asChild variant="outline" className="w-full sm:w-auto gap-2">
            <Link href="/products">
              <ShoppingBag className="h-4 w-4" />
              <span>Continue Shopping</span>
            </Link>
          </Button>

          <Button
            onClick={handleLogout}
            variant="destructive"
            className="w-full sm:w-auto gap-2"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
