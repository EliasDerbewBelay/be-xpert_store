import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Headphones, ShieldCheck, Truck } from "lucide-react";
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
        <div className="order-1 flex flex-col gap-5 sm:gap-6 lg:col-start-1 lg:row-start-1">
          <h1 className="text-balance text-3xl font-extrabold leading-[1.15] tracking-tight text-foreground sm:text-4xl md:text-5xl lg:text-[3.25rem]">
            Everything You Need,
            <span className="mt-1 block text-primary">All in One Place</span>
          </h1>

          <p className="max-w-xl text-pretty text-sm leading-relaxed text-muted-foreground sm:text-base md:text-lg">
            Discover a wide range of high-quality products, from the latest tech
            gadgets to everyday essentials. Shop with confidence and enjoy a
            seamless online shopping experience.
          </p>

          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap">
            <Button
              asChild
              size="lg"
              className="h-11 w-full gap-2 rounded-lg px-6 sm:w-auto"
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
              className="h-11 w-full rounded-lg px-6 sm:w-auto"
            >
              <Link href="/categories">Browse Categories</Link>
            </Button>
          </div>
        </div>

        <div className="relative order-2 mx-auto w-full max-w-lg lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:max-w-none lg:self-center">
          <div
            className="pointer-events-none absolute -right-4 -top-4 h-40 w-40 rounded-full bg-primary/15 blur-2xl sm:h-56 sm:w-56"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute right-6 top-4 grid grid-cols-4 gap-1.5 opacity-70"
            aria-hidden="true"
          >
            {Array.from({ length: 12 }).map((_, i) => (
              <span
                key={i}
                className="h-1.5 w-1.5 rounded-full bg-primary/60 sm:h-2 sm:w-2"
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

        <ul className="order-3 grid grid-cols-1 gap-4 border-t border-border pt-6 sm:grid-cols-3 sm:gap-5 lg:col-start-1 lg:row-start-2 lg:mt-0 lg:gap-6">
          {features.map(({ icon: Icon, title, description }) => (
            <li key={title} className="flex items-start gap-2.5">
              <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent text-primary">
                <Icon className="h-4 w-4" aria-hidden="true" />
              </span>
              <span>
                <span className="block text-sm font-semibold text-foreground">
                  {title}
                </span>
                <span className="block text-xs text-muted-foreground">
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
