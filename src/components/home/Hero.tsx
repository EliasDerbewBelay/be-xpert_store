import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Headphones, ShieldCheck, Tag, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: Truck,
    title: "Free Shipping",
    description: "On orders over $50",
  },
  {
    icon: ShieldCheck,
    title: "Secure Payment",
    description: "100% protected",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    description: "We're here to help",
  },
] as const;

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 py-8 sm:gap-10 sm:px-6 sm:py-12 lg:grid-cols-2 lg:items-center lg:gap-x-12 lg:gap-y-8 lg:px-8 lg:py-16 xl:gap-x-16">
        {/* Copy */}
        <div className="order-1 flex flex-col gap-5 sm:gap-6 lg:col-start-1 lg:row-start-1">
          <h1 className="text-balance text-3xl font-extrabold leading-[1.15] tracking-tight text-slate-900 dark:text-foreground sm:text-4xl md:text-5xl lg:text-[3.25rem]">
            Everything You Need,
            <span className="mt-1 block text-blue-600 dark:text-blue-400">
              All in One Place
            </span>
          </h1>

          <p className="max-w-xl text-pretty text-sm leading-relaxed text-slate-500 dark:text-muted-foreground sm:text-base md:text-lg">
            Discover a wide range of high-quality products, from the latest tech
            gadgets to everyday essentials. Shop with confidence and enjoy a
            seamless online shopping experience.
          </p>

          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap">
            <Button
              asChild
              size="lg"
              className="h-11 w-full gap-2 rounded-lg bg-blue-600 px-6 text-white shadow-sm hover:bg-blue-700 sm:w-auto dark:bg-blue-600 dark:hover:bg-blue-500"
            >
              <Link href="/products">
                Shop Now
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="h-11 w-full rounded-lg border-slate-300 bg-transparent px-6 text-slate-900 hover:bg-slate-50 sm:w-auto dark:border-border dark:text-foreground dark:hover:bg-accent"
            >
              <Link href="/categories">Browse Categories</Link>
            </Button>
          </div>
        </div>

        {/* Product image — after CTAs on mobile, right column on desktop */}
        <div className="order-2 relative mx-auto w-full max-w-lg lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:max-w-none lg:self-center">
          <div
            className="pointer-events-none absolute -right-4 -top-4 h-40 w-40 rounded-full bg-blue-100/70 blur-2xl dark:bg-blue-900/30 sm:h-56 sm:w-56"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute right-6 top-4 grid grid-cols-4 gap-1.5 opacity-70 dark:opacity-40"
            aria-hidden="true"
          >
            {Array.from({ length: 12 }).map((_, i) => (
              <span
                key={i}
                className="h-1.5 w-1.5 rounded-full bg-blue-400 sm:h-2 sm:w-2"
              />
            ))}
          </div>
          <div className="relative aspect-square overflow-hidden rounded-2xl sm:rounded-3xl">
            <Image
              src="/images/hero-products.jpg"
              alt="Curated Be-xpert Store products including laptop, headphones, phone, sneakers, and everyday essentials"
              fill
              priority
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 50vw"
              className="object-cover object-center"
            />
          </div>
        </div>

        {/* Trust features — after image on mobile, under copy on desktop */}
        <ul className="order-3 grid grid-cols-1 gap-4 border-t border-slate-200 pt-6 dark:border-border sm:grid-cols-3 sm:gap-5 lg:col-start-1 lg:row-start-2 lg:mt-0 lg:gap-6">
          {features.map(({ icon: Icon, title, description }) => (
            <li key={title} className="flex items-start gap-2.5">
              <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
                <Icon className="h-4 w-4" aria-hidden="true" />
              </span>
              <span>
                <span className="block text-sm font-semibold text-slate-900 dark:text-foreground">
                  {title}
                </span>
                <span className="block text-xs text-slate-500 dark:text-muted-foreground">
                  {description}
                </span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
