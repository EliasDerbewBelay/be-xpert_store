const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://api.escuelajs.co/api/v1";

export class ApiError extends Error {
  status: number;
  data: unknown;

  constructor(message: string, status: number, data?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

interface FetchOptions extends RequestInit {
  params?: Record<string, string | number | undefined | null>;
  token?: string | null;
}

export async function apiClient<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const { params, token, headers = {}, ...customConfig } = options;

  let url = endpoint.startsWith("http")
    ? endpoint
    : `${BASE_URL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;

  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== "") {
        searchParams.append(key, String(val));
      }
    });
    const queryString = searchParams.toString();
    if (queryString) {
      url += (url.includes("?") ? "&" : "?") + queryString;
    }
  }

  const defaultHeaders: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (token) {
    defaultHeaders["Authorization"] = `Bearer ${token}`;
  }

  const config: RequestInit = {
    headers: {
      ...defaultHeaders,
      ...(headers as Record<string, string>),
    },
    ...customConfig,
  };

  try {
    const response = await fetch(url, config);

    if (!response.ok) {
      let errorData: unknown = null;
      let errorMessage = `API request failed with status ${response.status}`;
      try {
        errorData = await response.json();
        if (
          typeof errorData === "object" &&
          errorData !== null &&
          "message" in errorData
        ) {
          const msg = (errorData as { message: unknown }).message;
          if (Array.isArray(msg)) {
            errorMessage = msg.join(", ");
          } else if (typeof msg === "string") {
            errorMessage = msg;
          }
        }
      } catch {
        // Fallback to text or status message
      }
      throw new ApiError(errorMessage, response.status, errorData);
    }

    // If 204 No Content
    if (response.status === 204) {
      return {} as T;
    }

    const data = await response.json();
    return data as T;
  } catch (err) {
    if (err instanceof ApiError) {
      throw err;
    }
    const message = err instanceof Error ? err.message : "Network error";
    throw new ApiError(message, 500);
  }
}
