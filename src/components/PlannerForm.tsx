"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft, Loader2, Plane, Map, Wallet, Utensils, Heart } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTravelStore } from "@/lib/store";

const STEPS = [
  { id: "basics", title: "The Basics", icon: Map },
  { id: "budget", title: "Budget & Style", icon: Wallet },
  { id: "preferences", title: "Preferences", icon: Heart },
  { id: "food", title: "Food & Transport", icon: Utensils },
];

export default function PlannerForm() {
  const router = useRouter();
  const setPreferences = useTravelStore((state) => state.setPreferences);
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // State for all form fields
  const [formData, setFormData] = useState({
    origin: "",
    destination: "",
    startDate: "",
    endDate: "",
    adults: 1,
    children: 0,
    budget: "moderate",
    travelStyle: "vacation",
    foodPreferences: [] as string[],
    interests: [] as string[],
    accommodation: "hotel",
    transportation: "flight",
    specialRequests: "",
  });

  const updateForm = (key: string, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const toggleArrayItem = (key: 'foodPreferences' | 'interests', value: string) => {
    setFormData(prev => {
      const array = prev[key];
      if (array.includes(value)) {
        return { ...prev, [key]: array.filter(i => i !== value) };
      }
      return { ...prev, [key]: [...array, value] };
    });
  };

  const handleNext = () => {
    if (currentStep === 0) {
      if (!formData.origin.trim() || !formData.destination.trim() || !formData.startDate || !formData.endDate || !formData.adults) {
        alert("Please fill all mandatory fields: Origin, Destination, Dates, and Adults.");
        return;
      }
    }
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(s => s + 1);
    } else {
      submitForm();
    }
  };

  const submitForm = () => {
    setIsSubmitting(true);
    const finalData = {
      ...formData,
      adults: parseInt(formData.adults as any) || 1,
      children: parseInt(formData.children as any) || 0,
    };
    setPreferences(finalData);
    router.push("/itinerary/loading");
  };

  return (
    <div className="relative">
      {/* Stepper Progress */}
      <div className="flex items-center justify-between mb-8 relative">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-muted -z-10 rounded-full" />
        <div 
          className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-primary -z-10 rounded-full transition-all duration-500" 
          style={{ width: `${(currentStep / (STEPS.length - 1)) * 100}%` }}
        />
        
        {STEPS.map((step, index) => {
          const Icon = step.icon;
          const isActive = index === currentStep;
          const isPast = index < currentStep;
          
          return (
            <div key={step.id} className="flex flex-col items-center gap-2">
              <div 
                className={`w-12 h-12 rounded-full flex items-center justify-center border-4 border-card transition-colors duration-300 ${
                  isActive || isPast ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <span className={`text-xs font-medium hidden md:block ${isActive ? "text-primary" : "text-muted-foreground"}`}>
                {step.title}
              </span>
            </div>
          );
        })}
      </div>

      <div className="min-h-[400px]">
        {/* Step 1: Basics */}
        {currentStep === 0 && (
          <div className="space-y-6 animate-in slide-in-from-right-4 fade-in">
            <h2 className="text-2xl font-semibold mb-4">Where are you going?</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="origin" className="text-sm font-medium">Leaving from</label>
                <input 
                  id="origin"
                  type="text" 
                  placeholder="e.g. New York, NY *" 
                  className="flex h-12 w-full rounded-xl border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  value={formData.origin}
                  onChange={(e) => updateForm('origin', e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="destination" className="text-sm font-medium">Going to (Leave blank for AI suggestions)</label>
                <input 
                  id="destination"
                  type="text" 
                  placeholder="e.g. Tokyo, Japan *" 
                  className="flex h-12 w-full rounded-xl border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  value={formData.destination}
                  onChange={(e) => updateForm('destination', e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="space-y-2">
                <label htmlFor="startDate" className="text-sm font-medium">Start Date</label>
                <input 
                  id="startDate"
                  type="date" 
                  className="flex h-12 w-full rounded-xl border border-input bg-transparent px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  value={formData.startDate}
                  onChange={(e) => updateForm('startDate', e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="endDate" className="text-sm font-medium">End Date</label>
                <input 
                  id="endDate"
                  type="date" 
                  className="flex h-12 w-full rounded-xl border border-input bg-transparent px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  value={formData.endDate}
                  onChange={(e) => updateForm('endDate', e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="space-y-2">
                <label htmlFor="adults" className="text-sm font-medium">Adults</label>
                <input 
                  id="adults"
                  type="number" min="1" 
                  className="flex h-12 w-full rounded-xl border border-input bg-transparent px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  value={formData.adults}
                  onChange={(e) => {
                    const val = e.target.value;
                    updateForm('adults', val === '' ? '' : (parseInt(val) || 1));
                  }}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="children" className="text-sm font-medium">Children</label>
                <input 
                  id="children"
                  type="number" min="0" 
                  className="flex h-12 w-full rounded-xl border border-input bg-transparent px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  value={formData.children}
                  onChange={(e) => {
                    const val = e.target.value;
                    updateForm('children', val === '' ? '' : (parseInt(val) || 0));
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Budget & Style */}
        {currentStep === 1 && (
          <div className="space-y-6 animate-in slide-in-from-right-4 fade-in">
            <h2 className="text-2xl font-semibold mb-4">Budget & Travel Style</h2>
            
            <div className="space-y-3">
              <label className="text-sm font-medium">Budget Level</label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {['Backpacker', 'Moderate', 'Luxury'].map((level) => (
                  <button
                    key={level}
                    onClick={() => updateForm('budget', level.toLowerCase())}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                      formData.budget === level.toLowerCase() 
                        ? 'border-primary bg-primary/5' 
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <div className="font-semibold">{level}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {level === 'Backpacker' && '$50 - $100 / day'}
                      {level === 'Moderate' && '$150 - $300 / day'}
                      {level === 'Luxury' && '$500+ / day'}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3 mt-6">
              <label htmlFor="currency" className="text-sm font-medium">Currency</label>
              <select 
                id="currency"
                className="flex h-12 w-full rounded-xl border border-input bg-transparent px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                value={(formData as any).currency || "USD"}
                onChange={(e) => updateForm('currency', e.target.value)}
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="INR">INR (₹)</option>
                <option value="AUD">AUD ($)</option>
                <option value="CAD">CAD ($)</option>
                <option value="JPY">JPY (¥)</option>
              </select>
            </div>

            <div className="space-y-3 mt-6">
              <label className="text-sm font-medium">Travel Style</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {['Solo', 'Couple', 'Family', 'Friends', 'Business', 'Adventure', 'Relaxing', 'Cultural'].map((style) => (
                  <button
                    key={style}
                    onClick={() => updateForm('travelStyle', style.toLowerCase())}
                    className={`p-3 rounded-xl border-2 text-center transition-all ${
                      formData.travelStyle === style.toLowerCase() 
                        ? 'border-primary bg-primary/5 text-primary font-medium' 
                        : 'border-border hover:border-primary/50 text-muted-foreground'
                    }`}
                  >
                    {style}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Interests */}
        {currentStep === 2 && (
          <div className="space-y-6 animate-in slide-in-from-right-4 fade-in">
            <h2 className="text-2xl font-semibold mb-4">What do you love doing?</h2>
            <p className="text-muted-foreground text-sm mb-4">Select all that apply to get better recommendations.</p>
            
            <div className="flex flex-wrap gap-3">
              {['Nature', 'History', 'Shopping', 'Nightlife', 'Museums', 'Wildlife', 'Hiking', 'Water Sports', 'Photography', 'Festivals', 'Architecture'].map((interest) => {
                const isSelected = formData.interests.includes(interest);
                return (
                  <button
                    key={interest}
                    onClick={() => toggleArrayItem('interests', interest)}
                    className={`px-4 py-2 rounded-full border transition-all ${
                      isSelected 
                        ? 'bg-primary border-primary text-primary-foreground shadow-md' 
                        : 'bg-transparent border-border hover:border-primary/50 hover:bg-muted'
                    }`}
                  >
                    {interest}
                  </button>
                )
              })}
            </div>

             <div className="space-y-2 mt-6">
              <label htmlFor="specialRequests" className="text-sm font-medium">Special Requests / Accessibility Needs</label>
              <textarea 
                id="specialRequests"
                placeholder="e.g. Wheelchair accessible, avoiding stairs, traveling with a pet..."
                className="flex min-h-[100px] w-full rounded-xl border border-input bg-transparent px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                value={formData.specialRequests}
                onChange={(e) => updateForm('specialRequests', e.target.value)}
              />
            </div>
          </div>
        )}

        {/* Step 4: Food & Logistics */}
        {currentStep === 3 && (
          <div className="space-y-6 animate-in slide-in-from-right-4 fade-in">
            <h2 className="text-2xl font-semibold mb-4">Final Details</h2>
            
            <div className="space-y-3">
              <label className="text-sm font-medium">Dietary Preferences</label>
              <div className="flex flex-wrap gap-3">
                {['No Preference', 'Vegetarian', 'Vegan', 'Halal', 'Kosher', 'Gluten-Free', 'Pescatarian'].map((diet) => {
                  const isSelected = formData.foodPreferences.includes(diet);
                  return (
                    <button
                      key={diet}
                      onClick={() => toggleArrayItem('foodPreferences', diet)}
                      className={`px-4 py-2 rounded-full border transition-all ${
                        isSelected 
                          ? 'bg-primary border-primary text-primary-foreground shadow-md' 
                          : 'bg-transparent border-border hover:border-primary/50 hover:bg-muted'
                      }`}
                    >
                      {diet}
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div className="space-y-3">
                <label htmlFor="transportation" className="text-sm font-medium">Preferred Transport</label>
                <select 
                  id="transportation"
                  className="flex h-12 w-full rounded-xl border border-input bg-transparent px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  value={formData.transportation}
                  onChange={(e) => updateForm('transportation', e.target.value)}
                >
                  <option value="flight">Flight</option>
                  <option value="train">Train</option>
                  <option value="bus">Bus</option>
                  <option value="car">Rental Car</option>
                  <option value="public">Public Transport</option>
                </select>
              </div>

              <div className="space-y-3">
                <label htmlFor="accommodation" className="text-sm font-medium">Accommodation Type</label>
                <select 
                  id="accommodation"
                  className="flex h-12 w-full rounded-xl border border-input bg-transparent px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  value={formData.accommodation}
                  onChange={(e) => updateForm('accommodation', e.target.value)}
                >
                  <option value="hotel">Hotel</option>
                  <option value="resort">Resort</option>
                  <option value="airbnb">Airbnb / Apartment</option>
                  <option value="hostel">Hostel</option>
                  <option value="camping">Camping</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-between mt-8 pt-6 border-t border-border">
        <Button 
          variant="outline" 
          onClick={() => setCurrentStep(s => s - 1)} 
          disabled={currentStep === 0 || isSubmitting}
          className="rounded-full"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <Button 
          onClick={handleNext} 
          disabled={isSubmitting}
          className="rounded-full shadow-md"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Generating Magic...
            </>
          ) : currentStep === STEPS.length - 1 ? (
            <>
              Generate Itinerary
              <ArrowRight className="w-4 h-4 ml-2" />
            </>
          ) : (
            <>
              Next Step
              <ArrowRight className="w-4 h-4 ml-2" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
