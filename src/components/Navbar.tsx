"use client";

import Link from "next/link";
import { Compass, Menu, X, User } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? "glass shadow-sm py-3"
          : "bg-transparent py-5"
      )}
    >
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="bg-primary text-primary-foreground p-2 rounded-xl group-hover:rotate-12 transition-transform">
            <Compass className="w-5 h-5" />
          </div>
          <span className="text-xl font-bold tracking-tight">TravelAI Pro</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8 font-medium">
          <Link href="/destinations" className="text-sm hover:text-primary transition-colors">
            Destinations
          </Link>
          <Link href="/pricing" className="text-sm hover:text-primary transition-colors">
            Pricing
          </Link>
          <Link href="/about" className="text-sm hover:text-primary transition-colors">
            About
          </Link>
        </div>

        <div className="hidden md:flex items-center gap-4">
          <Link href="/login" className="text-sm font-medium hover:text-primary transition-colors">
            Log in
          </Link>
          <Link
            href="/planner"
            className="bg-primary text-primary-foreground px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-primary/90 transition-all hover:scale-105 active:scale-95 shadow-md shadow-primary/20"
          >
            Start Planning
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden p-2 text-foreground"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Nav */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 glass border-t border-border shadow-lg animate-in slide-in-from-top-2">
          <div className="flex flex-col p-4 space-y-4">
             <Link href="/destinations" className="text-foreground hover:text-primary p-2">
              Destinations
            </Link>
            <Link href="/pricing" className="text-foreground hover:text-primary p-2">
              Pricing
            </Link>
            <Link href="/about" className="text-foreground hover:text-primary p-2">
              About
            </Link>
            <Link href="/login" className="text-foreground hover:text-primary p-2">
              Log in
            </Link>
            <Link
              href="/planner"
              className="bg-primary text-primary-foreground text-center p-3 rounded-full font-semibold"
            >
              Start Planning
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
