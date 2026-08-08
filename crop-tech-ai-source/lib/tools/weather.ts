export type WeatherReport = {
  location: string;
  localTime?: string;
  temperatureC?: number;
  condition?: string;
  rainProbability?: number;
  humidity?: number;
  windKph?: number;
  forecast?: Array<{ date: string; condition: string; minC: number; maxC: number; rainProbability: number }>;
  error?: string;
};

type WeatherApiResponse = {
  location?: { name?: string; country?: string; localtime?: string };
  current?: { temp_c?: number; humidity?: number; wind_kph?: number; condition?: { text?: string } };
  forecast?: {
    forecastday?: Array<{
      date: string;
      day: { mintemp_c: number; maxtemp_c: number; daily_chance_of_rain?: number; condition?: { text?: string } };
    }>;
  };
};

export async function getWeather(location: string, days = 2): Promise<WeatherReport> {
  const key = process.env.WEATHER_API_KEY;
  if (!key) {
    return {
      location,
      error: "Weather is not configured. Add WEATHER_API_KEY on the server."
    };
  }

  try {
    const params = new URLSearchParams({
      key,
      q: location,
      days: String(Math.min(Math.max(days, 1), 7)),
      aqi: "no",
      alerts: "no"
    });
    const response = await fetch(`https://api.weatherapi.com/v1/forecast.json?${params}`);
    if (!response.ok) {
      return { location, error: `Weather lookup failed with status ${response.status}.` };
    }
    const data = (await response.json()) as WeatherApiResponse;
    const place = [data.location?.name, data.location?.country].filter(Boolean).join(", ") || location;
    return {
      location: place,
      localTime: data.location?.localtime,
      temperatureC: data.current?.temp_c,
      condition: data.current?.condition?.text,
      humidity: data.current?.humidity,
      windKph: data.current?.wind_kph,
      rainProbability: data.forecast?.forecastday?.[0]?.day.daily_chance_of_rain,
      forecast: data.forecast?.forecastday?.map((day) => ({
        date: day.date,
        condition: day.day.condition?.text || "Unavailable",
        minC: day.day.mintemp_c,
        maxC: day.day.maxtemp_c,
        rainProbability: day.day.daily_chance_of_rain || 0
      }))
    };
  } catch (error) {
    return { location, error: error instanceof Error ? error.message : "Weather lookup failed." };
  }
}
