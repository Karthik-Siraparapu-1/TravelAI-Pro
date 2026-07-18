import PlannerForm from "@/components/PlannerForm";

export default function PlannerPage() {
  return (
    <div className="min-h-screen bg-muted/30 pt-24 pb-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">Design Your Dream Trip</h1>
          <p className="text-muted-foreground text-lg">Tell us your preferences, and our AI will craft the perfect itinerary.</p>
        </div>
        
        <div className="bg-card border border-border shadow-xl rounded-3xl overflow-hidden p-6 md:p-10">
          <PlannerForm />
        </div>
      </div>
    </div>
  );
}
