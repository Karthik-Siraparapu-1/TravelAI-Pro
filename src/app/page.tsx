import Link from "next/link";
import { ArrowRight, MapPin, Calendar, Compass, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <video
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            poster="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2021&auto=format&fit=crop"
            className="absolute inset-0 w-full h-full object-cover opacity-55 dark:opacity-35"
          >
            <source src="https://player.vimeo.com/external/435674703.sd.mp4?s=7fdf18b14a85611cf0b0cf8d8339b4b025d574bb&profile_id=165&oauth2_token_id=57447761" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-background/5 via-background/50 to-background" />
        </div>
        
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <SparklesIcon className="w-4 h-4" />
            <span className="text-sm font-medium">Powered by Gemini AI</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-6 duration-1000">
            Your Personal AI <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-500">
              Travel Companion
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-150">
            Generate personalized itineraries, get smart destination suggestions, and estimate your budget in seconds. Experience travel planning like never before.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-300">
            <Link href="/planner">
              <Button size="lg" className="w-full sm:w-auto text-lg rounded-full px-8 h-14 shadow-lg shadow-primary/25 hover:scale-105 transition-transform">
                Start Planning Free
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Feature Cards Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Everything you need for the perfect trip</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Our AI analyzes millions of data points to craft the perfect journey tailored specifically to your preferences and style.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<MapPin className="w-8 h-8 text-primary" />}
              title="Smart Destinations"
              description="Not sure where to go? Tell us your vibe, and we'll suggest destinations that perfectly match your style and budget."
            />
            <FeatureCard 
              icon={<Calendar className="w-8 h-8 text-primary" />}
              title="Day-wise Itineraries"
              description="Get a complete, minute-by-minute schedule including attractions, restaurants, and hidden gems."
            />
            <FeatureCard 
              icon={<Compass className="w-8 h-8 text-primary" />}
              title="Dynamic Budgeting"
              description="Keep track of your expenses with our AI budget estimator. Flights, hotels, food – we break it all down."
            />
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-muted/50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-12">Loved by travelers worldwide</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="glass p-6 rounded-2xl text-left hover:-translate-y-1 transition-transform duration-300">
                <div className="flex text-yellow-500 mb-4">
                  {[...Array(5)].map((_, j) => <Star key={j} className="w-4 h-4 fill-current" />)}
                </div>
                <p className="mb-6 text-foreground/80">
                  "TravelAI Pro completely changed how I plan my vacations. The itinerary was spot on, and it found restaurants I would have never discovered myself!"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary">
                    JD
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Jane Doe</p>
                    <p className="text-xs text-muted-foreground">Traveled to Japan</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="p-8 rounded-3xl bg-card border border-border shadow-sm hover:shadow-md transition-all group hover:-translate-y-1">
      <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">{description}</p>
    </div>
  );
}

function SparklesIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
      <path d="M5 3v4" />
      <path d="M19 17v4" />
      <path d="M3 5h4" />
      <path d="M17 19h4" />
    </svg>
  );
}
