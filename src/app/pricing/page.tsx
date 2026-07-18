"use client";

import { Check, Sparkles } from "lucide-react";
import Link from "next/link";

export default function PricingPage() {
  return (
    <main className="container mx-auto px-4 max-w-5xl pt-32 pb-20">
      <div className="text-center mb-16">
        <h1 className="text-3xl sm:text-4xl md:text-6xl font-extrabold tracking-tight mb-4">
          Simple, <span className="text-primary">Transparent Pricing</span>
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Plan unlimited trips with our free plan, or unlock premium features like real-time flight tracking, offline maps, and group planning.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {/* Free Plan */}
        <div className="glass p-8 rounded-3xl border border-border flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <h3 className="text-2xl font-bold">Standard Plan</h3>
            <p className="text-muted-foreground text-sm">Perfect for solo travelers wanting simple, customized AI trips.</p>
            <div className="text-4xl font-extrabold">$0<span className="text-sm font-normal text-muted-foreground"> / lifetime</span></div>
            
            <ul className="space-y-3 pt-4 border-t border-border">
              <li className="flex items-center gap-2 text-sm text-foreground/80">
                <Check className="w-4 h-4 text-green-500 shrink-0" /> Unlimited AI itineraries
              </li>
              <li className="flex items-center gap-2 text-sm text-foreground/80">
                <Check className="w-4 h-4 text-green-500 shrink-0" /> Custom budget estimations
              </li>
              <li className="flex items-center gap-2 text-sm text-foreground/80">
                <Check className="w-4 h-4 text-green-500 shrink-0" /> Multi-currency support
              </li>
              <li className="flex items-center gap-2 text-sm text-foreground/80">
                <Check className="w-4 h-4 text-green-500 shrink-0" /> Print & Share functions
              </li>
            </ul>
          </div>

          <Link href="/planner" className="w-full">
            <button className="w-full bg-muted/65 hover:bg-muted py-3 rounded-xl font-semibold transition-all">
              Start Free Planning
            </button>
          </Link>
        </div>

        {/* Pro Plan */}
        <div className="glass p-8 rounded-3xl border-2 border-primary relative flex flex-col justify-between space-y-6 shadow-lg shadow-primary/5">
          <div className="absolute -top-3 right-6 bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 fill-current" /> Most Popular
          </div>

          <div className="space-y-4">
            <h3 className="text-2xl font-bold">Explorer Pro</h3>
            <p className="text-muted-foreground text-sm">Best for frequent travelers and family trips needing real-time sync.</p>
            <div className="text-4xl font-extrabold">$9.99<span className="text-sm font-normal text-muted-foreground"> / month</span></div>

            <ul className="space-y-3 pt-4 border-t border-border">
              <li className="flex items-center gap-2 text-sm text-foreground/80">
                <Check className="w-4 h-4 text-green-500 shrink-0" /> Everything in Standard
              </li>
              <li className="flex items-center gap-2 text-sm text-foreground/80">
                <Check className="w-4 h-4 text-green-500 shrink-0" /> Real-time flight tracking & alerts
              </li>
              <li className="flex items-center gap-2 text-sm text-foreground/80">
                <Check className="w-4 h-4 text-green-500 shrink-0" /> Offline PDF & Google Maps export
              </li>
              <li className="flex items-center gap-2 text-sm text-foreground/80">
                <Check className="w-4 h-4 text-green-500 shrink-0" /> Collaborative group trip planning
              </li>
              <li className="flex items-center gap-2 text-sm text-foreground/80">
                <Check className="w-4 h-4 text-green-500 shrink-0" /> Ad-free premium experience
              </li>
            </ul>
          </div>

          <Link href="/planner" className="w-full">
            <button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 py-3 rounded-xl font-semibold transition-all">
              Try Explorer Pro
            </button>
          </Link>
        </div>
      </div>
    </main>
  );
}
