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

// Helper function to map weather condition to icon
function getWeatherIcon(condition: string): string {
  const iconMap: Record<string, string> = {
    Clear: "https://cdn.openai.com/API/storybook/mostly-sunny.png",
    Clouds: "https://cdn.openai.com/API/storybook/mixed-sun.png",
    Rain: "https://cdn.openai.com/API/storybook/rain.png",
    Drizzle: "https://cdn.openai.com/API/storybook/rain.png",
    Thunderstorm: "https://cdn.openai.com/API/storybook/rain.png",
    Snow: "https://cdn.openai.com/API/storybook/windy.png",
    Mist: "https://cdn.openai.com/API/storybook/mixed-sun.png",
    Fog: "https://cdn.openai.com/API/storybook/mixed-sun.png",
  };
  return (
    iconMap[condition] ||
    "https://cdn.openai.com/API/storybook/mostly-sunny.png"
  );
}

// Helper function to get background gradient based on condition
function getWeatherBackground(condition: string): string {
  const backgroundMap: Record<string, string> = {
    Clear: "linear-gradient(111deg, #F59E0B 0%, #F59E0B 56.92%, #FCD34D 100%)",
    Clouds: "linear-gradient(111deg, #6B7280 0%, #9CA3AF 56.92%, #D1D5DB 100%)",
    Rain: "linear-gradient(111deg, #1E40AF 0%, #3B82F6 56.92%, #60A5FA 100%)",
    Snow: "linear-gradient(111deg, #E0F2FE 0%, #BAE6FD 56.92%, #7DD3FC 100%)",
  };
  return (
    backgroundMap[condition] ||
    "linear-gradient(111deg, #1769C8 0%, #258AE3 56.92%, #31A3F8 100%)"
  );
}

async function handleGetWeather(params: Record<string, unknown>) {
  const location = String(params.location ?? "");
  const unit = String(params.unit ?? "f");

  // simulate error
  // return NextResponse.json(
  //   { success: false, error: "Weather data not found for this location" },
  //   { status: 404 }
  // );

  if (!location) {
    return NextResponse.json(
      { success: false, error: "Location is required" },
      { status: 400 }
    );
  }

  try {
    const apiKey = process.env.OPENWEATHER_API_KEY;

    if (!apiKey) {
      // Fallback to mock data if no API key
      console.warn("OPENWEATHER_API_KEY not set, returning mock data");
      const unitSymbol = unit === "c" ? "°" : "°";
      return NextResponse.json({
        success: true,
        background:
          "linear-gradient(111deg, #1769C8 0%, #258AE3 56.92%, #31A3F8 100%)",
        conditionImage: "https://cdn.openai.com/API/storybook/mixed-sun.png",
        lowTemperature: `47${unitSymbol}`,
        highTemperature: `69${unitSymbol}`,
        location: location,
        conditionDescription: "Partly sunny skies accompanied by some clouds",
        forecast: [
          {
            conditionImage:
              "https://cdn.openai.com/API/storybook/mostly-sunny.png",
            temperature: `54${unitSymbol}`,
          },
          {
            conditionImage: "https://cdn.openai.com/API/storybook/rain.png",
            temperature: `54${unitSymbol}`,
          },
          {
            conditionImage:
              "https://cdn.openai.com/API/storybook/mixed-sun.png",
            temperature: `54${unitSymbol}`,
          },
          {
            conditionImage: "https://cdn.openai.com/API/storybook/windy.png",
            temperature: `54${unitSymbol}`,
          },
          {
            conditionImage:
              "https://cdn.openai.com/API/storybook/mostly-sunny.png",
            temperature: `54${unitSymbol}`,
          },
        ],
        note: "This is mock data. Add OPENWEATHER_API_KEY to .env.local for real data.",
      });
    }

    const units = unit === "c" ? "metric" : "imperial";

    // Fetch current weather
    const weatherResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
        location
      )}&units=${units}&appid=${apiKey}`
    );

    if (!weatherResponse.ok) {
      return NextResponse.json(
        { success: false, error: "Weather data not found for this location" },
        { status: 404 }
      );
    }

    const weatherData = await weatherResponse.json();

    // Fetch forecast data
    const forecastResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(
        location
      )}&units=${units}&appid=${apiKey}&cnt=5`
    );

    const forecastData = forecastResponse.ok
      ? await forecastResponse.json()
      : null;
    const unitSymbol = unit === "c" ? "°" : "°";

    // Build forecast array
    const forecast =
      forecastData?.list?.slice(0, 5).map((item: any) => ({
        conditionImage: getWeatherIcon(item.weather[0].main),
        temperature: `${Math.round(item.main.temp)}${unitSymbol}`,
      })) || [];

    return NextResponse.json({
      success: true,
      background: getWeatherBackground(weatherData.weather[0].main),
      conditionImage: getWeatherIcon(weatherData.weather[0].main),
      lowTemperature: `${Math.round(weatherData.main.temp_min)}${unitSymbol}`,
      highTemperature: `${Math.round(weatherData.main.temp_max)}${unitSymbol}`,
      location: weatherData.name,
      conditionDescription:
        weatherData.weather[0].description.charAt(0).toUpperCase() +
        weatherData.weather[0].description.slice(1),
      forecast: forecast,
    });
  } catch (error) {
    console.error("Error fetching weather data:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch weather data" },
      { status: 500 }
    );
  }
}
