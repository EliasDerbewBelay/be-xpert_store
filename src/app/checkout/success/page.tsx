import React from "react";
import type { Metadata } from "next";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { CheckoutSuccessClient } from "@/components/checkout/CheckoutSuccessClient";

export const metadata: Metadata = {
  title: "Order Success",
  description: "Your order has been placed successfully.",
};

export default function CheckoutSuccessPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <AuthGuard>
        <CheckoutSuccessClient />
      </AuthGuard>
    </div>
  );
}
