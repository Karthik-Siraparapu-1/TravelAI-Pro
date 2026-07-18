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
                type: { type: SchemaType.STRING, description: "e.g., restaurant, attraction, transport" }
              },
              required: ["timeOfDay", "time", "title", "description", "location", "costEstimate", "currency", "type"],
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
  required: ["destination", "whyThisDestination", "itinerary", "budget", "checklist"]
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
  let dest = preferences.destination;
  if (!dest) {
    const interests = preferences.interests || [];
    if (interests.includes("Nature") || interests.includes("Wildlife")) {
      dest = "Banff, Canada";
    } else if (interests.includes("History") || interests.includes("Museums")) {
      dest = "Rome, Italy";
    } else if (interests.includes("Nightlife") || interests.includes("Shopping")) {
      dest = "Tokyo, Japan";
    } else {
      dest = "Paris, France";
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

  const currency = "USD";
  const budgetMultiplier = preferences.budget === "luxury" ? 2.5 : preferences.budget === "backpacker" ? 0.4 : 1.0;
  
  const flightsCost = Math.round((preferences.transportation === "flight" ? 650 : 120) * budgetMultiplier * (preferences.adults + preferences.children * 0.7));
  const accomCost = Math.round(150 * budgetMultiplier * days);
  const foodCost = Math.round(60 * budgetMultiplier * days * (preferences.adults + preferences.children * 0.5));
  const transportCost = Math.round((preferences.transportation === "car" ? 70 : 25) * budgetMultiplier * days);
  const activitiesCost = Math.round(45 * budgetMultiplier * days);
  const shoppingCost = Math.round(150 * budgetMultiplier);
  const emergencyCost = Math.round(100);
  
  const total = flightsCost + accomCost + foodCost + transportCost + activitiesCost + shoppingCost + emergencyCost;

  // Day wise activities template generator
  const activitiesTemplates = [
    {
      timeOfDay: "Morning",
      time: "09:00 AM",
      title: "City Sightseeing & Key Landmark Tour",
      description: "Take a guided walking tour to the most iconic historic landmark in town. Get scenic views and capture photographs before the crowds arrive.",
      type: "attraction",
      costOffset: 15
    },
    {
      timeOfDay: "Afternoon",
      time: "01:00 PM",
      title: "Authentic Local Lunch Experience",
      description: "Dine at a highly recommended local market or bistro, enjoying local delicacies and neighborhood specialty dishes.",
      type: "restaurant",
      costOffset: 25
    },
    {
      timeOfDay: "Evening",
      time: "04:30 PM",
      title: "Museum Exploration or Cultural Tour",
      description: "Dive deep into the culture by visiting a major local gallery, museum, or historical cathedral, featuring stunning classic architecture.",
      type: "attraction",
      costOffset: 20
    },
    {
      timeOfDay: "Night",
      time: "07:30 PM",
      title: "Scenic Dinner & Evening Leisurely Walk",
      description: "Enjoy a relaxed dining experience at a cozy spot with beautiful views of the cityscape, followed by a walk through the bustling main square.",
      type: "restaurant",
      costOffset: 45
    }
  ];

  const itinerary = [];
  for (let i = 1; i <= days; i++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(startDate.getDate() + i - 1);
    const formattedDate = currentDate.toLocaleDateString("en-US", {
      weekday: "long",
      month: "short",
      day: "numeric",
      year: "numeric"
    });

    const dayActivities = activitiesTemplates.map((template) => {
      // Customize descriptions/titles based on day number
      let title = template.title;
      let description = template.description;
      let location = `Central ${dest}`;

      if (i === 1 && template.timeOfDay === "Morning") {
        title = `Welcome to ${dest} - Orientation Walk`;
        description = `Arrive in ${dest}, check into your accommodation, and take a casual stroll to get oriented with the nearby neighborhoods.`;
      } else if (i === days && template.timeOfDay === "Night") {
        title = "Farewell Dinner & Night Views";
        description = `Celebrate your final night in ${dest} with a memorable culinary experience and look out over the city lights.`;
      } else {
        // Vary details slightly
        title = `Day ${i} - ${template.title}`;
        description = `${template.description.replace("town", dest).replace("city", dest)}`;
      }

      return {
        timeOfDay: template.timeOfDay,
        time: template.time,
        title,
        description,
        location,
        costEstimate: Math.round(template.costOffset * budgetMultiplier),
        currency,
        type: template.type
      };
    });

    itinerary.push({
      day: i,
      date: formattedDate,
      activities: dayActivities
    });
  }

  return {
    destination: dest,
    whyThisDestination: `Based on your interest in ${preferences.interests?.join(", ") || "traveling"} and your preference for a ${preferences.travelStyle} style, ${dest} is an exceptional fit. This customized itinerary balances your ${preferences.budget} budget with selected accommodation and transportation logistics.`,
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
          "Comfortable walking sneakers",
          "Layered clothing options (cardigan/jacket)",
          "Smart casual wear for dinner outings",
          "All-weather umbrella or light raincoat"
        ]
      },
      {
        category: "Documents & Finances",
        items: [
          "Passport and/or travel IDs",
          "Printed booking confirmations (hotel, flights)",
          "Credit card with zero foreign transaction fees",
          "Small amount of local currency cash"
        ]
      },
      {
        category: "Electronics",
        items: [
          "Universal power plug adapter",
          "Mobile phone chargers & portable power banks",
          "Camera & spare memory cards",
          "Noise-cancelling travel headphones"
        ]
      },
      {
        category: "Health & Personal Care",
        items: [
          "Prescribed medicines & basic first-aid supplies",
          "Travel size toiletries (TSA compliant)",
          "Sunscreen and UV lip balm",
          "Hand sanitizer & sanitizing wipes"
        ]
      }
    ]
  };
}
