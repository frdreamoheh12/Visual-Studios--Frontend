const API_URL =
  process.env.NEXT_PUBLIC_API_URL ??
  "https://visual-studios-backend1.onrender.com";

export class ApiClientError extends Error {
  status: number;
  details?: unknown;

  constructor(status: number, message: string, details?: unknown) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

interface RequestOptions extends RequestInit {
  json?: unknown;
}

async function request<T>(
  path: string,
  options: RequestOptions = {}
): Promise<T> {
  const { json, headers, ...rest } = options;

  const res = await fetch(`${API_URL}/api${path}`, {
    ...rest,
    credentials: "include",
    headers: {
      ...(json ? { "Content-Type": "application/json" } : {}),
      ...headers,
    },
    body: json ? JSON.stringify(json) : rest.body,
  });

  const isJson = res.headers
    .get("content-type")
    ?.includes("application/json");

  const data = isJson ? await res.json() : null;

  if (!res.ok) {
    throw new ApiClientError(
      res.status,
      data?.message ?? "Something went wrong.",
      data?.details
    );
  }

  return data as T;
}

export const api = {
  get: <T>(path: string) =>
    request<T>(path, { method: "GET" }),

  post: <T>(path: string, json?: unknown) =>
    request<T>(path, { method: "POST", json }),

  put: <T>(path: string, json?: unknown) =>
    request<T>(path, { method: "PUT", json }),

  patch: <T>(path: string, json?: unknown) =>
    request<T>(path, { method: "PATCH", json }),

  del: <T>(path: string) =>
    request<T>(path, { method: "DELETE" }),
};

export { API_URL };