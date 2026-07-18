import { Users, Shield, Sparkles, Compass } from "lucide-react";

export default function AboutPage() {
  return (
    <main className="container mx-auto px-4 max-w-4xl pt-32 pb-20">
      <div className="text-center mb-16">
        <h1 className="text-3xl sm:text-4xl md:text-6xl font-extrabold tracking-tight mb-4">
          About <span className="text-primary">TravelAI Pro</span>
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          We are redefining travel planning by combining Gemini AI models with real-world travel data to build the ultimate vacation planner.
        </p>
      </div>

      <div className="space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-primary" /> Our Mission
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Travel should be about exploration and enjoyment, not stressful planning. Our AI-driven engine generates customizable itineraries in seconds, taking care of daily schedules, transport options, budget estimations, and packing lists.
            </p>
          </div>
          <div className="glass p-8 rounded-3xl border border-border flex flex-col justify-center items-center text-center space-y-4">
            <Compass className="w-16 h-16 text-primary animate-bounce" />
            <h3 className="text-xl font-bold">1 Million+ Itineraries</h3>
            <p className="text-sm text-muted-foreground">Generated globally for travel enthusiasts.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8">
          <div className="glass p-6 rounded-2xl border border-border space-y-3">
            <Users className="w-8 h-8 text-primary" />
            <h3 className="font-bold text-lg">Personalized Style</h3>
            <p className="text-sm text-muted-foreground">
              Whether you are a solo backpacker, a business traveler, or planning a luxury couple getaway, we customize every detail.
            </p>
          </div>

          <div className="glass p-6 rounded-2xl border border-border space-y-3">
            <Shield className="w-8 h-8 text-primary" />
            <h3 className="font-bold text-lg">Real-Time Estimations</h3>
            <p className="text-sm text-muted-foreground">
              Calculate budgets instantly using multiple currencies, realistic attraction tickets, local transport costs, and weather expectations.
            </p>
          </div>

          <div className="glass p-6 rounded-2xl border border-border space-y-3">
            <Sparkles className="w-8 h-8 text-primary" />
            <h3 className="font-bold text-lg">Next-Gen Architecture</h3>
            <p className="text-sm text-muted-foreground">
              Built using Next.js, TailwindCSS/Shadcn UI, Recharts, and Google Gemini AI, offering a high-performance web experience.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
