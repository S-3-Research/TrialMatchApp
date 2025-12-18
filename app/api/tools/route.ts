import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { toolName, params } = body;

    if (!toolName) {
      return NextResponse.json(
        { success: false, error: "Tool name is required" },
        { status: 400 }
      );
    }

    // Handle different tools
    switch (toolName) {
      case "get_weather":
        return handleGetWeather(params);
      
      // Add more tool handlers here
      default:
        return NextResponse.json(
          { success: false, error: `Unknown tool: ${toolName}` },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("Error handling tool request:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

async function handleGetWeather(params: Record<string, unknown>) {
  const location = String(params.location ?? "");
  const unit = String(params.unit ?? "f");

  if (!location) {
    return NextResponse.json(
      { success: false, error: "Location is required" },
      { status: 400 }
    );
  }

  try {
    // Option 1: Using OpenWeatherMap (requires API key in .env)
    const apiKey = process.env.OPENWEATHER_API_KEY;
    
    if (!apiKey) {
      // Fallback to mock data if no API key
      console.warn("OPENWEATHER_API_KEY not set, returning mock data");
      return NextResponse.json({
        success: true,
        temperature: 72,
        condition: "Sunny",
        description: "Clear sky",
        location: location,
        unit: unit === "c" ? "°C" : "°F",
        note: "This is mock data. Add OPENWEATHER_API_KEY to .env.local for real data."
      });
    }

    const units = unit === "c" ? "metric" : "imperial";
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
        location
      )}&units=${units}&appid=${apiKey}`
    );

    if (!response.ok) {
      return NextResponse.json(
        { success: false, error: "Weather data not found for this location" },
        { status: 404 }
      );
    }

    const data = await response.json();

    return NextResponse.json({
      success: true,
      temperature: Math.round(data.main.temp),
      condition: data.weather[0].main,
      description: data.weather[0].description,
      humidity: data.main.humidity,
      windSpeed: data.wind.speed,
      location: data.name,
      unit: unit === "c" ? "°C" : "°F"
    });
  } catch (error) {
    console.error("Error fetching weather data:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch weather data" },
      { status: 500 }
    );
  }
}
