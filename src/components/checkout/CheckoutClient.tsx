"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart/cart-context";
import { useAuth } from "@/lib/auth/auth-context";
import { useToast } from "@/lib/toast/toast-context";
import { formatPrice } from "@/lib/utils";
import { ProductImage } from "@/components/ui/product-image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, CheckCircle2, ShieldCheck } from "lucide-react";

export function CheckoutClient() {
  const router = useRouter();
  const { items, totalPrice, totalItems, clearCart, isInitialized } = useCart();
  const { user } = useAuth();
  const { success } = useToast();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
  });

  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Pre-fill user data if authenticated
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        fullName: prev.fullName || user.name || "",
        email: prev.email || user.email || "",
      }));
    }
  }, [user]);

  if (!isInitialized) {
    return <div className="py-12 text-center">Loading checkout...</div>;
  }

  if (items.length === 0) {
    return (
      <div className="py-16 text-center space-y-4 max-w-md mx-auto">
        <h2 className="text-xl font-semibold">Your cart is empty</h2>
        <p className="text-sm text-muted-foreground">
          You need items in your cart to proceed with checkout.
        </p>
        <Button asChild>
          <Link href="/products">Shop Products</Link>
        </Button>
      </div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (
      !formData.fullName.trim() ||
      !formData.email.trim() ||
      !formData.phone.trim() ||
      !formData.address.trim() ||
      !formData.city.trim()
    ) {
      setError("Please fill out all required fields.");
      return;
    }

    setIsSubmitting(true);

    // Simulate order placement
    try {
      const orderSummary = {
        orderId: `ORD-${Date.now().toString().slice(-6)}`,
        itemsCount: totalItems,
        total: totalPrice,
        customerName: formData.fullName,
        date: new Date().toLocaleDateString(),
      };

      if (typeof window !== "undefined") {
        sessionStorage.setItem("latest_order", JSON.stringify(orderSummary));
      }

      // Clear the cart
      clearCart();
      success("Order placed successfully!");
      router.push("/checkout/success");
    } catch {
      setError("Failed to place order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 py-6">
      <div className="pb-4 border-b border-border">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Checkout</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Simulated checkout — no actual charge will be made.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Shipping Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="rounded-lg border border-border bg-card p-6 space-y-4">
              <h2 className="text-base font-semibold">Shipping Information</h2>

              {error && (
                <div
                  role="alert"
                  className="flex items-center gap-2 p-3 text-sm rounded-md bg-destructive/10 text-destructive border border-destructive/20"
                >
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input
                    id="fullName"
                    name="fullName"
                    placeholder="John Doe"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="+1 555-0192"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="address">Street Address *</Label>
                  <Input
                    id="address"
                    name="address"
                    placeholder="123 Main Street, Apt 4B"
                    value={formData.address}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    name="city"
                    placeholder="New York"
                    value={formData.city}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-border bg-card p-6 space-y-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                <span>Simulated payment mode active. No credit card required.</span>
              </div>
            </div>

            <Button
              type="submit"
              size="lg"
              disabled={isSubmitting}
              className="w-full gap-2 text-base"
            >
              <CheckCircle2 className="h-4 w-4" />
              <span>{isSubmitting ? "Processing..." : `Place Order (${formatPrice(totalPrice)})`}</span>
            </Button>
          </form>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1 rounded-lg border border-border bg-card p-5 space-y-4 sticky top-24">
          <h3 className="font-semibold text-base">Order Summary</h3>

          {/* Mini item list */}
          <div className="divide-y divide-border max-h-60 overflow-y-auto pr-1">
            {items.map((item) => (
              <div key={item.id} className="py-2.5 flex items-center gap-3">
                <div className="relative h-12 w-12 rounded bg-muted overflow-hidden shrink-0 border border-border">
                  <ProductImage
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="48px"
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium truncate">{item.title}</p>
                  <p className="text-xs text-muted-foreground">
                    Qty: {item.quantity} × {formatPrice(item.price)}
                  </p>
                </div>
                <div className="text-xs font-semibold">
                  {formatPrice(item.price * item.quantity)}
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-2 pt-3 border-t border-border text-sm">
            <div className="flex justify-between text-muted-foreground">
              <span>Items ({totalItems})</span>
              <span>{formatPrice(totalPrice)}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Shipping</span>
              <span className="text-foreground font-medium">Free</span>
            </div>
            <div className="flex justify-between font-bold text-base pt-2 border-t border-border">
              <span>Total</span>
              <span>{formatPrice(totalPrice)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
