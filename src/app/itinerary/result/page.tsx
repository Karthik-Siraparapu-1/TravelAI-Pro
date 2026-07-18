"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTravelStore } from "@/lib/store";
import { MapPin, Calendar, Wallet, CheckSquare, Download, Share2, Printer, Map as MapIcon, Compass } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#ff7c43', '#f95d6a'];

export default function ResultPage() {
  const router = useRouter();
  const itineraryData = useTravelStore((state) => state.itineraryData);
  const preferences = useTravelStore((state) => state.preferences);

  useEffect(() => {
    if (!itineraryData) {
      router.push("/planner");
    }
  }, [itineraryData, router]);

  if (!itineraryData) return null;

  const budgetData = [
    { name: 'Flights', value: itineraryData.budget.flights },
    { name: 'Accommodation', value: itineraryData.budget.accommodation },
    { name: 'Food', value: itineraryData.budget.food },
    { name: 'Transport', value: itineraryData.budget.transport },
    { name: 'Activities', value: itineraryData.budget.activities },
    { name: 'Shopping', value: itineraryData.budget.shopping },
    { name: 'Emergency', value: itineraryData.budget.emergency },
  ].filter(item => item.value > 0);

  const handlePrint = () => {
    window.print();
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `My Trip to ${itineraryData.destination}`,
          text: `Check out my travel itinerary for ${itineraryData.destination}!`,
          url: window.location.href,
        });
      } catch (err) {
        console.error("Share failed", err);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  const handleSave = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(itineraryData, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `itinerary_${itineraryData.destination.replace(/\\s+/g, '_')}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  return (
    <div className="min-h-screen bg-muted/20 pt-24 pb-20">
      {/* Hero Section */}
      <div className="bg-primary/5 border-b border-border mb-10 py-12">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary mb-4 text-sm font-medium">
                <Compass className="w-4 h-4" />
                AI Generated Itinerary
              </div>
              <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4 flex items-center gap-3">
                <MapPin className="w-10 h-10 text-primary" />
                {itineraryData.destination}
              </h1>
              <p className="text-lg text-muted-foreground max-w-3xl leading-relaxed">
                {itineraryData.whyThisDestination}
              </p>
            </div>
            
            <div className="flex items-center gap-3 w-full md:w-auto">
              <Button variant="outline" className="flex-1 md:flex-none" onClick={handleShare}>
                <Share2 className="w-4 h-4 mr-2" /> Share
              </Button>
              <Button variant="outline" className="flex-1 md:flex-none" onClick={handlePrint}>
                <Printer className="w-4 h-4 mr-2" /> Print
              </Button>
              <Button className="flex-1 md:flex-none" onClick={handleSave}>
                <Download className="w-4 h-4 mr-2" /> Save Trip
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content: Itinerary */}
          <div className="lg:col-span-2 space-y-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Calendar className="w-6 h-6 text-primary" />
                Day-by-Day Plan
              </h2>
            </div>
            
            <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
              {itineraryData.itinerary.map((dayPlan: any, index: number) => (
                <div key={index} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border border-primary bg-background shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow flex-none z-10 text-primary font-bold ml-0 md:ml-auto md:mr-auto">
                    {dayPlan.day}
                  </div>
                  
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] glass p-6 rounded-2xl shadow-sm border border-border">
                    <h3 className="font-bold text-lg mb-1">Day {dayPlan.day}</h3>
                    {dayPlan.date && <p className="text-sm text-muted-foreground mb-4">{dayPlan.date}</p>}
                    
                    <div className="space-y-6 mt-4">
                      {dayPlan.activities.map((activity: any, actIdx: number) => (
                        <div key={actIdx} className="relative pl-6 border-l-2 border-primary/20">
                          <div className="absolute w-3 h-3 bg-primary rounded-full -left-[7.5px] top-1" />
                          <div className="flex justify-between items-start mb-1">
                            <span className="font-semibold text-foreground">{activity.title}</span>
                            <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded">
                              {activity.time}
                            </span>
                          </div>
                          
                          {activity.imageUrl && (
                            <div className="relative w-full h-40 my-3 rounded-xl overflow-hidden border border-border">
                              <img 
                                src={activity.imageUrl} 
                                alt={activity.title} 
                                className="object-cover w-full h-full"
                                onError={(e) => {
                                  e.currentTarget.src = "https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=600&auto=format&fit=crop";
                                }}
                              />
                            </div>
                          )}

                          <p className="text-sm text-muted-foreground mb-2">{activity.description}</p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground font-medium">
                            <span className="flex items-center gap-1">
                              <MapIcon className="w-3 h-3" /> {activity.location}
                            </span>
                            {activity.costEstimate > 0 && (
                              <span className="flex items-center gap-1 text-green-600 dark:text-green-400">
                                <Wallet className="w-3 h-3" /> {activity.costEstimate} {activity.currency}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar: Budget & Checklist */}
          <div className="space-y-8">
            
            {/* Weather Widget */}
            {itineraryData.weatherForecast && (
              <div className="glass rounded-3xl p-6 border border-border shadow-sm">
                <h2 className="text-xl font-bold flex items-center gap-2 mb-4">
                  <Compass className="w-5 h-5 text-primary" />
                  Expected Weather
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {itineraryData.weatherForecast}
                </p>
              </div>
            )}

            {/* Budget Widget */}
            <div className="glass rounded-3xl p-6 border border-border shadow-sm">
              <h2 className="text-xl font-bold flex items-center gap-2 mb-6">
                <Wallet className="w-5 h-5 text-primary" />
                Estimated Budget
              </h2>
              
              <div className="mb-6 h-[200px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={budgetData}
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {budgetData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} ${itineraryData.budget.currency}`, 'Cost']} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              
              <div className="space-y-3">
                {budgetData.map((item, index) => (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                      <span className="text-muted-foreground">{item.name}</span>
                    </div>
                    <span className="font-semibold">{item.value} {itineraryData.budget.currency}</span>
                  </div>
                ))}
                
                <div className="pt-4 mt-4 border-t border-border flex items-center justify-between font-bold text-lg">
                  <span>Total</span>
                  <span className="text-primary">{itineraryData.budget.total} {itineraryData.budget.currency}</span>
                </div>
              </div>
            </div>

            {/* Checklist Widget */}
            <div className="glass rounded-3xl p-6 border border-border shadow-sm">
              <h2 className="text-xl font-bold flex items-center gap-2 mb-6">
                <CheckSquare className="w-5 h-5 text-primary" />
                Packing List
              </h2>
              
              <div className="space-y-6">
                {itineraryData.checklist.map((category: any, index: number) => (
                  <div key={index}>
                    <h3 className="font-semibold text-sm mb-3 text-muted-foreground uppercase tracking-wider">{category.category}</h3>
                    <div className="space-y-2">
                      {category.items.map((item: string, itemIdx: number) => (
                        <label key={itemIdx} className="flex items-center gap-3 p-2 hover:bg-muted rounded-lg cursor-pointer transition-colors">
                          <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary" />
                          <span className="text-sm">{item}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}
