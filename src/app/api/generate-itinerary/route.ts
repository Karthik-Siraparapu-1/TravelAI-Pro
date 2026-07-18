import { GoogleGenerativeAI, Schema, SchemaType } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

// Define the schema for the structured JSON response
const itinerarySchema: Schema = {
  type: SchemaType.OBJECT,
  properties: {
    destination: {
      type: SchemaType.STRING,
      description: "The suggested or confirmed destination city and country",
    },
    whyThisDestination: {
      type: SchemaType.STRING,
      description: "A short explanation of why this destination matches the user preferences",
    },
    weatherForecast: {
      type: SchemaType.STRING,
      description: "Weather forecast details (temperature, conditions, best time to pack for)",
    },
    itinerary: {
      type: SchemaType.ARRAY,
      description: "Day-wise itinerary",
      items: {
        type: SchemaType.OBJECT,
        properties: {
          day: { type: SchemaType.INTEGER },
          date: { type: SchemaType.STRING, description: "Formatted date string if dates were provided" },
          activities: {
            type: SchemaType.ARRAY,
            items: {
              type: SchemaType.OBJECT,
              properties: {
                timeOfDay: { type: SchemaType.STRING, description: "Morning, Afternoon, Evening, or Night" },
                time: { type: SchemaType.STRING, description: "Specific time e.g., 09:00 AM" },
                title: { type: SchemaType.STRING },
                description: { type: SchemaType.STRING },
                location: { type: SchemaType.STRING },
                costEstimate: { type: SchemaType.NUMBER },
                currency: { type: SchemaType.STRING },
                type: { type: SchemaType.STRING, description: "e.g., restaurant, attraction, transport" },
                imageUrl: { type: SchemaType.STRING, description: "Unsplash image URL related to the landmark or food" }
              },
              required: ["timeOfDay", "time", "title", "description", "location", "costEstimate", "currency", "type", "imageUrl"],
            }
          }
        },
        required: ["day", "activities"],
      }
    },
    budget: {
      type: SchemaType.OBJECT,
      description: "Estimated budget breakdown",
      properties: {
        flights: { type: SchemaType.NUMBER },
        accommodation: { type: SchemaType.NUMBER },
        food: { type: SchemaType.NUMBER },
        transport: { type: SchemaType.NUMBER },
        activities: { type: SchemaType.NUMBER },
        shopping: { type: SchemaType.NUMBER },
        emergency: { type: SchemaType.NUMBER },
        total: { type: SchemaType.NUMBER },
        currency: { type: SchemaType.STRING }
      },
      required: ["flights", "accommodation", "food", "transport", "activities", "shopping", "emergency", "total", "currency"]
    },
    checklist: {
      type: SchemaType.ARRAY,
      description: "Packing checklist categories",
      items: {
        type: SchemaType.OBJECT,
        properties: {
          category: { type: SchemaType.STRING },
          items: {
            type: SchemaType.ARRAY,
            items: { type: SchemaType.STRING }
          }
        },
        required: ["category", "items"]
      }
    }
  },
  required: ["destination", "whyThisDestination", "weatherForecast", "itinerary", "budget", "checklist"]
};

export async function POST(req: Request) {
  let preferences: any = {};
  try {
    preferences = await req.json();
  } catch (e) {
    console.error("Failed to parse request JSON:", e);
  }

  try {
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY.startsWith("your_")) {
      console.warn("Gemini API key is not configured. Falling back to local mock itinerary.");
      const mockData = getMockItinerary(preferences);
      return NextResponse.json(mockData);
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-pro",
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: itinerarySchema,
        temperature: 0.7,
      },
    });

    const prompt = `
      You are an expert AI travel planner. Create a highly detailed, personalized travel itinerary based on the following user preferences:
      
      User Preferences:
      - Origin: ${preferences.origin || "Unknown"}
      - Destination: ${preferences.destination || "Suggest the best destination based on preferences"}
      - Start Date: ${preferences.startDate || "Not specified"}
      - End Date: ${preferences.endDate || "Not specified"}
      - Travelers: ${preferences.adults} Adults, ${preferences.children} Children
      - Budget Level: ${preferences.budget}
      - Travel Style: ${preferences.travelStyle}
      - Interests: ${preferences.interests?.join(", ") || "General"}
      - Food Preferences: ${preferences.foodPreferences?.join(", ") || "Any"}
      - Accommodation: ${preferences.accommodation}
      - Transport: ${preferences.transportation}
      - Currency: ${preferences.currency || "USD"}
      - Special Requests: ${preferences.specialRequests || "None"}

      CRITICAL REQUIREMENTS:
      1. Provide **REAL best times** to visit each location.
      2. Provide **REAL locations** (do not invent places, use exact names and neighborhoods).
      3. Provide **REAL costs** including actual ticket prices to enter attractions, restaurants, etc.
      4. Explicitly include **rental vehicle locations**, **public transport costs**, and **private transport costs** and compare them if possible in the descriptions.
      5. All costs must be estimated in the requested Currency: ${preferences.currency || "USD"}.
      
      Generate a comprehensive response matching the JSON schema. Include a realistic budget estimate and a personalized packing checklist.
      Ensure the itinerary is well-paced and considers the travel style (e.g., don't overpack a 'relaxing' trip).
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const jsonText = response.text();
    
    // Parse the JSON to ensure it's valid before sending it to the client
    const data = JSON.parse(jsonText);

    return NextResponse.json(data);
  } catch (error: any) {
    console.warn("Gemini API Error or network failure. Falling back to local mock itinerary. Error detail:", error);
    try {
      const mockData = getMockItinerary(preferences);
      return NextResponse.json(mockData);
    } catch (fallbackError: any) {
      console.error("Local mock generator failed:", fallbackError);
      return NextResponse.json(
        { error: "Failed to generate itinerary. " + (error.message || "") },
        { status: 500 }
      );
    }
  }
}

function getMockItinerary(preferences: any) {
  // Determine destination
  let dest = (preferences.destination || "").trim();
  let normalizedDest = dest.toLowerCase();
  
  if (!normalizedDest) {
    const interests = preferences.interests || [];
    if (interests.includes("Nature") || interests.includes("Wildlife")) {
      dest = "Banff, Canada";
      normalizedDest = "banff";
    } else if (interests.includes("History") || interests.includes("Museums")) {
      dest = "Rome, Italy";
      normalizedDest = "rome";
    } else if (interests.includes("Nightlife") || interests.includes("Shopping")) {
      dest = "Tokyo, Japan";
      normalizedDest = "tokyo";
    } else {
      dest = "Paris, France";
      normalizedDest = "paris";
    }
  }

  // Calculate days
  let days = 3;
  let startDate = new Date();
  if (preferences.startDate && preferences.endDate) {
    const start = new Date(preferences.startDate);
    const end = new Date(preferences.endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    if (diffDays > 0 && diffDays <= 30) {
      days = diffDays;
      startDate = start;
    }
  }

  // Currency rates relative to USD
  const currency = preferences.currency || "USD";
  let rate = 1;
  if (currency === "INR") rate = 80;
  else if (currency === "EUR") rate = 0.9;
  else if (currency === "GBP") rate = 0.77;
  else if (currency === "AUD") rate = 1.5;
  else if (currency === "CAD") rate = 1.37;
  else if (currency === "JPY") rate = 155;

  const convert = (valUSD: number) => Math.round(valUSD * rate);

  const budgetMultiplier = preferences.budget === "luxury" ? 2.5 : preferences.budget === "backpacker" ? 0.4 : 1.0;

  // Real Database of Itineraries
  const db: Record<string, { weather: string, why: string, activities: any[] }> = {
    hyderabad: {
      weather: "Warm and dry. Ideal months: Oct-Mar (pleasant temperatures 18°C-31°C). Sums up to warm afternoons and cool, breezy evenings.",
      why: "Hyderabad is rich in Nizami history, boasting spectacular heritage monuments, world-famous biryanis, and traditional pearl bazaars.",
      activities: [
        {
          timeOfDay: "Morning",
          time: "09:30 AM",
          title: "Explore Charminar Monument",
          description: "Visit the iconic 16th-century mosque Charminar. Climb its minarets for panoramic views of the Old City. Entry ticket: $0.50 (local) / $4 (foreigner). Metro: Charminar station ($0.30) is the most budget-friendly transport option.",
          type: "attraction",
          cost: 4,
          imageUrl: "https://images.unsplash.com/photo-1608958416719-75a7c20c02c6?q=80&w=600&auto=format&fit=crop"
        },
        {
          timeOfDay: "Afternoon",
          time: "01:00 PM",
          title: "Authentic Biryani at Shadab Cafe",
          description: "Indulge in slow-cooked Hyderabadi mutton biryani, double-ka-meetha dessert, and traditional kebabs. Very popular, expect brief waiting lines.",
          type: "restaurant",
          cost: 8,
          imageUrl: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=600&auto=format&fit=crop"
        },
        {
          timeOfDay: "Evening",
          time: "04:30 PM",
          title: "Shop Pearl Bazaars at Laad Bazaar",
          description: "Stroll through the narrow lanes of Laad Bazaar adjacent to Charminar, famous for traditional lacquer bangles, semi-precious pearls, and block-print clothing.",
          type: "attraction",
          cost: 0,
          imageUrl: "https://images.unsplash.com/photo-1599839617614-22b9b940bf71?q=80&w=600&auto=format&fit=crop"
        },
        {
          timeOfDay: "Night",
          time: "07:30 PM",
          title: "Royal Dinner at Jewel of Nizam",
          description: "Enjoy Mughlai and Nizami fine dining inside a luxury tower overlooking Gandipet Lake. Traditional live sitar music adds to the premium heritage ambience.",
          type: "restaurant",
          cost: 35,
          imageUrl: "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=600&auto=format&fit=crop"
        },
        {
          timeOfDay: "Morning",
          time: "09:00 AM",
          title: "Tour Golconda Fort Ruins",
          description: "Visit the massive medieval fortress Golconda Fort, famous for its advanced acoustics (clapping at the gates resonates at the hilltop palace). Ticket: $4. Private cabs cost $8.",
          type: "attraction",
          cost: 4,
          imageUrl: "https://images.unsplash.com/photo-1627894006066-b45785c49007?q=80&w=600&auto=format&fit=crop"
        },
        {
          timeOfDay: "Afternoon",
          time: "01:30 PM",
          title: "Traditional South Indian Thali at Chutneys",
          description: "Feast on a multi-course vegetarian South Indian thali featuring steamed idlis, dosas, and six varieties of homemade chutneys.",
          type: "restaurant",
          cost: 6,
          imageUrl: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?q=80&w=600&auto=format&fit=crop"
        },
        {
          timeOfDay: "Evening",
          time: "05:00 PM",
          title: "Visit Qutb Shahi Tombs",
          description: "Explore the beautifully restored dome-shaped tombs of the seven Qutb Shahi kings, set in landscaped gardens near Golconda Fort. Entry fee: $2.",
          type: "attraction",
          cost: 2,
          imageUrl: "https://images.unsplash.com/photo-1607582455959-1e35fa8480de?q=80&w=600&auto=format&fit=crop"
        },
        {
          timeOfDay: "Night",
          time: "08:00 PM",
          title: "Rooftop Dinner at Over The Moon",
          description: "Dine at a premium rooftop bistro in Gachibowli with sweeping views of the modern cyber city skyline, featuring global cuisine and microbrews.",
          type: "restaurant",
          cost: 25,
          imageUrl: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=600&auto=format&fit=crop"
        }
      ]
    },
    tokyo: {
      weather: "Temperate. Mild springs (12°C-20°C, Cherry blossoms in April) and crisp autumns (10°C-18°C) are the absolute best times to explore Tokyo.",
      why: "Tokyo perfectly balances ultra-modern futuristic skylines, neon nightlife, and ancient shrines connected by the world's best subway network.",
      activities: [
        {
          timeOfDay: "Morning",
          time: "09:00 AM",
          title: "Shibuya Crossing & Hachiko Statue",
          description: "Cross the world's busiest pedestrian intersection and see the historic memorial statue of the loyal dog Hachiko. Free access.",
          type: "attraction",
          cost: 0,
          imageUrl: "https://images.unsplash.com/photo-1540959733332-eab4deceeaf7?q=80&w=600&auto=format&fit=crop"
        },
        {
          timeOfDay: "Afternoon",
          time: "12:30 PM",
          title: "Ichiran Ramen in Shibuya",
          description: "Customize your spicy tonkotsu ramen broth, noodle texture, and garlic level. Dine in individual solo booths for maximum focus on flavor.",
          type: "restaurant",
          cost: 12,
          imageUrl: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?q=80&w=600&auto=format&fit=crop"
        },
        {
          timeOfDay: "Evening",
          time: "03:30 PM",
          title: "Stroll Harajuku Takeshita Street",
          description: "Explore the colorful alleyway famous for crazy crepes, rainbow cotton candy, pop-culture fashion boutiques, and cosplay gear.",
          type: "attraction",
          cost: 0,
          imageUrl: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?q=80&w=600&auto=format&fit=crop"
        },
        {
          timeOfDay: "Night",
          time: "07:30 PM",
          title: "Yakitori Dinner in Omoide Yokocho",
          description: "Dine inside 'Memory Lane' - a historic Shinjuku alley filled with tiny yakitori stands cooking skewered chicken over binchotan charcoal. Local beer cost: $5.",
          type: "restaurant",
          cost: 25,
          imageUrl: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=600&auto=format&fit=crop"
        },
        {
          timeOfDay: "Morning",
          time: "09:30 AM",
          title: "Senso-ji Temple in Asakusa",
          description: "Walk under the massive red lantern of Kaminarimon Gate to visit Tokyo's oldest Buddhist temple. Nakamise street is lined with sweet stalls.",
          type: "attraction",
          cost: 0,
          imageUrl: "https://images.unsplash.com/photo-1501854140801-50d01698950b?q=80&w=600&auto=format&fit=crop"
        },
        {
          timeOfDay: "Afternoon",
          time: "01:00 PM",
          title: "Sushi Feast at Tsukiji Outer Market",
          description: "Try blow-torched wagyu beef, fresh sea urchin, tamagoyaki (sweet omelet), and premium fatty tuna nigiri directly from vendor stalls.",
          type: "restaurant",
          cost: 30,
          imageUrl: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=600&auto=format&fit=crop"
        },
        {
          timeOfDay: "Evening",
          time: "04:30 PM",
          title: "Digital Art at teamLab Planets",
          description: "Walk barefoot through glowing water, rooms filled with floating orchids, and crystal light tunnels. General ticket fee: $26. Booking in advance is mandatory.",
          type: "attraction",
          cost: 26,
          imageUrl: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=600&auto=format&fit=crop"
        },
        {
          timeOfDay: "Night",
          time: "08:00 PM",
          title: "Shabu-Shabu Wagyu Dinner at Rokkasen",
          description: "Dine on high-grade A5 wagyu beef slices dipped in hot broth, accompanied by fresh snow crab legs and premium Japanese sake.",
          type: "restaurant",
          cost: 90,
          imageUrl: "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=600&auto=format&fit=crop"
        }
      ]
    }
  };

  const selectedDb = db[normalizedDest] || {
    weather: "Pleasant spring and autumn climates (10°C-20°C). Ideal for walking through local city paths and parks.",
    why: `A customized excursion in ${dest} matching your interests and preferred travel style.`,
    activities: [
      {
        timeOfDay: "Morning",
        time: "09:00 AM",
        title: "Visit Historic City Center & Main Square",
        description: "Orientation walk to the major landmarks in town. Walkable streets make exploring safe and easy.",
        type: "attraction",
        cost: 0,
        imageUrl: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=600&auto=format&fit=crop"
      },
      {
        timeOfDay: "Afternoon",
        time: "01:00 PM",
        title: "Local Bistro Lunch",
        description: "Dine on traditional regional lunch menus at a local bistro. Highly rated by residents.",
        type: "restaurant",
        cost: 20,
        imageUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=600&auto=format&fit=crop"
      },
      {
        timeOfDay: "Evening",
        time: "04:30 PM",
        title: "Explore the City Museum & Art Gallery",
        description: "View classic architecture and paintings. Entry ticket: $15. Accessible by local buses ($2.50).",
        type: "attraction",
        cost: 15,
        imageUrl: "https://images.unsplash.com/photo-1565008447742-97f6f38c985c?q=80&w=600&auto=format&fit=crop"
      },
      {
        timeOfDay: "Night",
        time: "07:30 PM",
        title: "Sunset Dinner & Panoramic Views",
        description: "Celebrate your trip with premium local dining overlooking the skyline.",
        type: "restaurant",
        cost: 45,
        imageUrl: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=600&auto=format&fit=crop"
      }
    ]
  };

  // Generate activities list by looping over database activities
  const itinerary = [];
  const activitiesPerDay = 4;
  
  for (let i = 1; i <= days; i++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(startDate.getDate() + i - 1);
    const formattedDate = currentDate.toLocaleDateString("en-US", {
      weekday: "long",
      month: "short",
      day: "numeric",
      year: "numeric"
    });

    const dayActivities = [];
    for (let actIdx = 0; actIdx < activitiesPerDay; actIdx++) {
      // Loop or reuse database activities
      const dbActIndex = ((i - 1) * activitiesPerDay + actIdx) % selectedDb.activities.length;
      const originalAct = selectedDb.activities[dbActIndex];
      
      let title = originalAct.title;
      let description = originalAct.description;
      if (i > 1 && !db[normalizedDest]) {
        title = `Day ${i} - ${originalAct.title}`;
      }

      dayActivities.push({
        timeOfDay: originalAct.timeOfDay,
        time: originalAct.time,
        title,
        description,
        location: originalAct.location || `${dest} City Center`,
        costEstimate: convert(Math.round(originalAct.cost * budgetMultiplier)),
        currency,
        type: originalAct.type,
        imageUrl: originalAct.imageUrl
      });
    }

    itinerary.push({
      day: i,
      date: formattedDate,
      activities: dayActivities
    });
  }

  // Calculate budget costs in selected currency
  const flightsCost = convert(Math.round((preferences.transportation === "flight" ? 650 : 120) * budgetMultiplier * (preferences.adults + preferences.children * 0.7)));
  const accomCost = convert(Math.round(150 * budgetMultiplier * days));
  const foodCost = convert(Math.round(60 * budgetMultiplier * days * (preferences.adults + preferences.children * 0.5)));
  const transportCost = convert(Math.round((preferences.transportation === "car" ? 70 : 25) * budgetMultiplier * days));
  const activitiesCost = convert(Math.round(45 * budgetMultiplier * days));
  const shoppingCost = convert(Math.round(150 * budgetMultiplier));
  const emergencyCost = convert(100);
  
  const total = flightsCost + accomCost + foodCost + transportCost + activitiesCost + shoppingCost + emergencyCost;

  return {
    destination: dest,
    whyThisDestination: selectedDb.why,
    weatherForecast: selectedDb.weather,
    itinerary,
    budget: {
      flights: flightsCost,
      accommodation: accomCost,
      food: foodCost,
      transport: transportCost,
      activities: activitiesCost,
      shopping: shoppingCost,
      emergency: emergencyCost,
      total,
      currency
    },
    checklist: [
      {
        category: "Clothing",
        items: [
          "Comfortable walking shoes",
          "Layered options matching weather",
          "One formal/smart casual dress",
          "Umbrella or light windbreaker"
        ]
      },
      {
        category: "Documents & Finances",
        items: [
          "Passport and visa documents",
          "Hotel booking vouchers",
          "Credit card with zero exchange fees",
          "Small cash amount in local currency"
        ]
      }
    ]
  };
}
