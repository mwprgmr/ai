const safeMathPattern = /^[0-9+\-*/().,%\s]+$/;

export async function calculate(expression: string) {
  const normalized = expression.replace(/,/g, "").replace(/%/g, "/100");
  if (!safeMathPattern.test(normalized)) {
    return {
      expression,
      error: "Only arithmetic expressions are supported by the calculator."
    };
  }

  try {
    const result = Function(`"use strict"; return (${normalized});`)() as unknown;
    if (typeof result !== "number" || !Number.isFinite(result)) {
      return { expression, error: "The calculation did not produce a finite number." };
    }
    return { expression, result };
  } catch (error) {
    return { expression, error: error instanceof Error ? error.message : "Calculation failed." };
  }
}

export async function convertCurrency(amount: number, from: string, to: string) {
  const upperFrom = from.toUpperCase();
  const upperTo = to.toUpperCase();
  try {
    const params = new URLSearchParams({ from: upperFrom, to: upperTo, amount: String(amount) });
    if (process.env.EXCHANGE_RATE_API_KEY) params.set("access_key", process.env.EXCHANGE_RATE_API_KEY);
    const response = await fetch(`https://api.exchangerate.host/convert?${params}`);
    if (!response.ok) {
      return { amount, from: upperFrom, to: upperTo, error: `Exchange-rate lookup failed with status ${response.status}.` };
    }
    const data = (await response.json()) as { result?: number; info?: { rate?: number }; success?: boolean };
    if (typeof data.result !== "number") {
      return { amount, from: upperFrom, to: upperTo, error: "Exchange-rate data was unavailable." };
    }
    return { amount, from: upperFrom, to: upperTo, result: data.result, rate: data.info?.rate };
  } catch (error) {
    return { amount, from: upperFrom, to: upperTo, error: error instanceof Error ? error.message : "Currency conversion failed." };
  }
}
