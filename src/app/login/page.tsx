"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Mail, Lock, Chrome, Github, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      alert("Please enter a valid email and password.");
      return;
    }
    alert(`Mock Login Successful for ${email}! Redirecting to your planner...`);
    router.push("/planner");
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />

      <main className="flex-grow pt-32 pb-20 flex items-center justify-center">
        <div className="w-full max-w-md px-4">
          <div className="glass p-8 rounded-3xl border border-border space-y-6 shadow-sm">
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-extrabold tracking-tight">Welcome Back</h1>
              <p className="text-muted-foreground text-sm">Log in to save and access your AI travel itineraries.</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">Email address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex h-12 w-full rounded-xl border border-input bg-transparent pl-10 pr-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label htmlFor="password" className="text-sm font-medium">Password</label>
                  <a href="#" onClick={(e) => {e.preventDefault(); alert("Password reset link sent!");}} className="text-xs text-primary hover:underline">Forgot password?</a>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="flex h-12 w-full rounded-xl border border-input bg-transparent pl-10 pr-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    required
                  />
                </div>
              </div>

              <Button type="submit" className="w-full h-12 rounded-xl text-md font-semibold mt-2">
                Sign In
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </form>

            <div className="relative flex items-center justify-center my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <span className="relative bg-background px-3 text-xs text-muted-foreground uppercase">Or continue with</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => { alert("Google Sign-In Simulated Successfully!"); router.push("/planner"); }}
                className="flex items-center justify-center gap-2 h-11 rounded-xl border border-border hover:bg-muted text-sm font-medium transition-colors"
              >
                <Chrome className="w-4 h-4" />
                Google
              </button>
              <button
                type="button"
                onClick={() => { alert("GitHub Sign-In Simulated Successfully!"); router.push("/planner"); }}
                className="flex items-center justify-center gap-2 h-11 rounded-xl border border-border hover:bg-muted text-sm font-medium transition-colors"
              >
                <Github className="w-4 h-4" />
                GitHub
              </button>
            </div>

            <div className="text-center text-xs text-muted-foreground">
              Don&apos;t have an account?{" "}
              <a href="#" onClick={(e) => { e.preventDefault(); alert("Social Sign-in above is fully active! Use Google or GitHub to create an account."); }} className="text-primary hover:underline font-medium">
                Sign up
              </a>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
