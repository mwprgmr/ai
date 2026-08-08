const zoneMap: Record<string, string> = {
  dubai: "Asia/Dubai",
  uae: "Asia/Dubai",
  "abu dhabi": "Asia/Dubai",
  riyadh: "Asia/Riyadh",
  "saudi arabia": "Asia/Riyadh",
  kochi: "Asia/Kolkata",
  kerala: "Asia/Kolkata",
  london: "Europe/London",
  "new york": "America/New_York",
  india: "Asia/Kolkata"
};

export function getTime(locationOrTimezone: string) {
  const key = locationOrTimezone.trim().toLowerCase();
  const timeZone = zoneMap[key] || locationOrTimezone;
  try {
    const now = new Date();
    return {
      location: locationOrTimezone,
      timeZone,
      iso: now.toISOString(),
      formatted: new Intl.DateTimeFormat("en", {
        timeZone,
        dateStyle: "full",
        timeStyle: "long"
      }).format(now)
    };
  } catch {
    return {
      location: locationOrTimezone,
      error: "Unknown timezone or location. Ask the user for a city or IANA timezone."
    };
  }
}
