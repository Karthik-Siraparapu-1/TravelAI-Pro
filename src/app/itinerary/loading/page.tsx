"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTravelStore } from "@/lib/store";
import { Plane, MapPin, Compass, Sparkles, Loader2 } from "lucide-react";

const loadingSteps = [
  "Analyzing your travel preferences...",
  "Searching for the perfect destinations...",
  "Crafting a personalized day-by-day itinerary...",
  "Estimating costs and budgeting...",
  "Preparing your ultimate packing list...",
  "Finalizing your AI travel plan..."
];

export default function LoadingItineraryPage() {
  const router = useRouter();
  const preferences = useTravelStore((state) => state.preferences);
  const setItineraryData = useTravelStore((state) => state.setItineraryData);
  
  const [stepIndex, setStepIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Progress the loading text
    const interval = setInterval(() => {
      setStepIndex((prev) => (prev < loadingSteps.length - 1 ? prev + 1 : prev));
    }, 2500);
    
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!preferences) {
      router.push("/planner");
      return;
    }

    const generateTrip = async () => {
      try {
        const response = await fetch("/api/generate-itinerary", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(preferences),
        });
        
        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.error || "Failed to generate itinerary");
        }
        
        const data = await response.json();
        setItineraryData(data);
        router.push("/itinerary/result");
      } catch (err: any) {
        console.error(err);
        setError(err.message || "An unexpected error occurred.");
      }
    };

    generateTrip();
  }, [preferences, router, setItineraryData]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4 text-center">
        <div className="max-w-md w-full p-8 glass rounded-3xl border border-destructive/20 text-center">
          <div className="w-16 h-16 bg-destructive/10 text-destructive rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-2xl font-bold">!</span>
          </div>
          <h2 className="text-xl font-bold mb-4">Oops! Something went wrong.</h2>
          <p className="text-muted-foreground mb-8">{error}</p>
          <button 
            onClick={() => router.push("/planner")}
            className="bg-primary text-primary-foreground px-6 py-2 rounded-full font-medium"
          >
            Go back and try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4 text-center overflow-hidden relative">
      {/* Animated background elements */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse delay-1000" />
      
      <div className="relative z-10 max-w-lg w-full">
        <div className="relative w-32 h-32 mx-auto mb-8">
          <div className="absolute inset-0 border-4 border-muted rounded-full" />
          <div className="absolute inset-0 border-4 border-primary rounded-full border-t-transparent animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Plane className="w-10 h-10 text-primary animate-pulse" />
          </div>
        </div>

        <h2 className="text-2xl md:text-3xl font-bold mb-4 flex items-center justify-center gap-2">
          <Sparkles className="w-6 h-6 text-yellow-500" />
          AI is working its magic
        </h2>
        
        <div className="h-8 overflow-hidden relative w-full">
          <p 
            key={stepIndex} 
            className="text-lg text-muted-foreground animate-in slide-in-from-bottom-5 fade-in duration-500 absolute w-full"
          >
            {loadingSteps[stepIndex]}
          </p>
        </div>
      </div>
    </div>
  );
}
