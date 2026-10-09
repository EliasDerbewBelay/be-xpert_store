import React from "react";
import type { Metadata } from "next";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { CheckoutClient } from "@/components/checkout/CheckoutClient";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Complete your order with shipping information.",
};

export default function CheckoutPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <AuthGuard>
        <CheckoutClient />
      </AuthGuard>
    </div>
  );
}
