import { parseCookies } from "nookies";
import { CashFlowResponse } from "../types";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
const { ["token"]: token } = parseCookies();

export async function fetchPaginatedCashFlows(
  page: number,
  size: number
): Promise<
  { cashFlows: CashFlowResponse[]; totalPages: number } | { error: string }
> {
  try {
    const url = `${BASE_URL}/api/cashflow/paginated?page=${page}&size=${size}`;
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data?.message || "Failed to  cash flows");
    }

    return { cashFlows: data.content, totalPages: data.totalPages };
  } catch (error: any) {
    console.error("Error fetching cash flows:", error);
    return { error: error.message || "Failed to  cash flows" };
  }
}

export async function fetchCurrentCashFlow(): Promise<
  CashFlowResponse | { error: string }
> {
  try {
    const url = `${BASE_URL}/api/cashflow/current`;
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null); 
      const errorMessage =
        errorData?.message || "Failed to fetch current cash flow";
      throw new Error(errorMessage);
    }

    const isJson = response.headers
      .get("content-type")
      ?.includes("application/json");
    const data = isJson ? await response.json().catch(() => null) : null;

    if (!data || Object.keys(data).length === 0) {
      return {} as CashFlowResponse;
    }

    return data;
  } catch (error: any) {
    console.error("Error fetching current cash flow:", error.message);
    return { error: error.message || "Failed to fetch current cash flow" };
  }
}

export async function openCashFlow(
  request: any
): Promise<CashFlowResponse | { error: string }> {
  try {
    console.log(request);
    const url = `${BASE_URL}/api/cashflow/open`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(request),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data?.message || "Failed to open cash flow");
    }

    return data;
  } catch (error: any) {
    console.error("Error opening cash flow:", error);
    return { error: error.message || "Failed to open cash flow" };
  }
}

export async function closeCashFlow(): Promise<
  CashFlowResponse | { error: string }
> {
  try {
    const url = `${BASE_URL}/api/cashflow/close`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data?.message || "Failed to close cash flow");
    }

    return data;
  } catch (error: any) {
    console.error("Error closing cash flow:", error);
    return { error: error.message || "Failed to close cash flow" };
  }
}

export async function fetchOpenedCashFlowsSummary(): Promise<
  CashFlowResponse | { error: string }
> {
  try {
    const url = `${BASE_URL}/api/cashflow/total`;
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      const errorMessage =
        errorData?.message || "Failed to fetch opened cash flows summary";
      throw new Error(errorMessage);
    }

    const data = await response.json();

    return data;
  } catch (error: any) {
    console.error("Error fetching opened cash flows summary:", error.message);
    return {
      error: error.message || "Failed to fetch opened cash flows summary",
    };
  }
}
