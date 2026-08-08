export type SearchResult = {
  title: string;
  url: string;
  content: string;
};

type TavilyResponse = {
  results?: Array<{
    title?: string;
    url?: string;
    content?: string;
    snippet?: string;
  }>;
};

export async function searchWeb(query: string, maxResults = 5): Promise<{ query: string; results: SearchResult[]; error?: string }> {
  const key = process.env.SEARCH_API_KEY;
  if (!key) {
    return {
      query,
      results: [],
      error: "Live web search is not configured. Add SEARCH_API_KEY on the server."
    };
  }

  try {
    const response = await fetch("https://api.tavily.com/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${key}`
      },
      body: JSON.stringify({
        query,
        max_results: maxResults,
        search_depth: "advanced",
        include_answer: false
      })
    });

    if (!response.ok) {
      return { query, results: [], error: `Search failed with status ${response.status}.` };
    }

    const data = (await response.json()) as TavilyResponse;
    return {
      query,
      results: (data.results || [])
        .filter((item) => item.url)
        .slice(0, maxResults)
        .map((item) => ({
          title: item.title || item.url || "Source",
          url: item.url || "",
          content: item.content || item.snippet || ""
        }))
    };
  } catch (error) {
    return {
      query,
      results: [],
      error: error instanceof Error ? error.message : "Search failed."
    };
  }
}
