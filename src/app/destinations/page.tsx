"use client";

import { MapPin, Plane, DollarSign, Calendar, Compass, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const POPULAR_DESTINATIONS = [
  {
    name: "Tokyo, Japan",
    image: "https://images.unsplash.com/photo-1540959733332-eab4deceeaf7?q=80&w=600&auto=format&fit=crop",
    cost: "Moderate ($150/day)",
    bestTime: "March - May & September - November",
    todo: ["Visit Shibuya Crossing & Senso-ji Temple", "Explore TeamLab Planets digital art museum", "Day trip to Mt. Fuji"],
    eat: ["Fresh sushi at Tsukiji Outer Market", "Ramen at Ichiran or AFURI", "Matcha desserts in Asakusa"],
    transport: "Excellent public subway/trains ($5-10/day). Bullet trains (Shinkansen) for long distance."
  },
  {
    name: "Paris, France",
    image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=600&auto=format&fit=crop",
    cost: "Luxury ($250/day)",
    bestTime: "April - June & October - November",
    todo: ["Climb the Eiffel Tower & tour Louvre", "Walk through Montmartre & Sacré-Cœur", "Seine River cruise at sunset"],
    eat: ["Croissants at local boulangeries", "Steak-frites at traditional bistros", "Macarons at Ladurée"],
    transport: "Metro system is comprehensive ($2.50 per ticket). Walking is ideal."
  },
  {
    name: "Hyderabad, India",
    image: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?q=80&w=600&auto=format&fit=crop",
    cost: "Backpacker ($50/day)",
    bestTime: "October - March (Cooler weather)",
    todo: ["Explore Charminar & Golconda Fort", "Visit Salar Jung Museum & Chowmahalla Palace", "Shop for pearls at Laad Bazaar"],
    eat: ["Authentic Hyderabadi Biryani at Shadab or Cafe Bahar", "Double ka Meetha dessert", "Irani Chai with Osmania Biscuits"],
    transport: "Auto-rickshaws, metro ($1-3/day), or private rides via Uber/Ola ($5-10/day)."
  },
  {
    name: "Rome, Italy",
    image: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?q=80&w=600&auto=format&fit=crop",
    cost: "Moderate ($180/day)",
    bestTime: "April - May & September - October",
    todo: ["Tour Colosseum & Roman Forum", "Throw a coin in Trevi Fountain", "Explore Vatican City & St. Peter's"],
    eat: ["Pasta Carbonara & Cacio e Pepe", "Gelato at Giolitti", "Roman-style thin crust pizza"],
    transport: "Metro and buses ($1.50 per ride). The historic center is highly walkable."
  },
  {
    name: "Banff, Canada",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=600&auto=format&fit=crop",
    cost: "Luxury ($220/day)",
    bestTime: "June - August & December - March",
    todo: ["Canoe on Lake Louise & Moraine Lake", "Ride the Banff Gondola to Sulphur Mountain", "Hike Johnston Canyon"],
    eat: ["Rocky Mountain game meats (Bison)", "Maple-infused dishes", "Fresh pastries at Wild Flour Bakery"],
    transport: "Rental car is highly recommended ($50-100/day). Roam Transit buses connect main lakes."
  }
];

export default function DestinationsPage() {
  return (
    <main className="container mx-auto px-4 max-w-6xl pt-32 pb-20">
      <div className="text-center mb-16">
        <h1 className="text-3xl sm:text-4xl md:text-6xl font-extrabold tracking-tight mb-4">
          Explore <span className="text-primary">Popular Destinations</span>
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Get detailed insights on popular destinations, real local costs, must-do activities, and famous local foods before planning your custom AI trip.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {POPULAR_DESTINATIONS.map((dest, index) => (
          <div key={index} className="glass rounded-3xl overflow-hidden border border-border shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
            <div className="relative h-48 w-full">
              <img 
                src={dest.image} 
                alt={dest.name} 
                className="object-cover w-full h-full"
                onError={(e) => {
                  e.currentTarget.src = "https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=600&auto=format&fit=crop";
                }}
              />
              <div className="absolute top-4 left-4 bg-background/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                <MapPin className="w-3 h-3 text-primary" />
                {dest.name}
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-1 font-semibold text-primary">
                  <DollarSign className="w-4 h-4" /> Cost: {dest.cost}
                </span>
                <span className="flex items-center gap-1 text-muted-foreground text-xs font-medium">
                  <Calendar className="w-3.5 h-3.5" /> Best Time: {dest.bestTime}
                </span>
              </div>

              <div>
                <h3 className="font-bold text-sm text-foreground/80 mb-2 uppercase tracking-wide">Places to Go / Things to Do</h3>
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 pl-1">
                  {dest.todo.map((item, idx) => <li key={idx}>{item}</li>)}
                </ul>
              </div>

              <div>
                <h3 className="font-bold text-sm text-foreground/80 mb-2 uppercase tracking-wide">Must Eat</h3>
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 pl-1">
                  {dest.eat.map((item, idx) => <li key={idx}>{item}</li>)}
                </ul>
              </div>

              <div className="pt-3 border-t border-border/60 text-xs text-muted-foreground">
                <strong className="text-foreground">Transport:</strong> {dest.transport}
              </div>

              <Link href="/planner" className="block pt-2">
                <button className="w-full bg-primary/10 text-primary py-2.5 rounded-xl font-semibold hover:bg-primary hover:text-primary-foreground transition-all flex items-center justify-center gap-2">
                  Plan a trip here <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
