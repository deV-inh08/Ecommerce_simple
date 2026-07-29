/**
 * BFF-side fetch wrapper: called from Next.js Route Handlers to reach .NET Gateway.
 * Client-side code should always call /api/... (Next BFF routes), never this directly.
 */

const GATEWAY_URL =
  process.env.GATEWAY_URL ?? "http://localhost:5223";

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly data?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

interface FetchOptions extends RequestInit {
  token?: string; // Bearer token to forward
}

export async function gatewayFetch<T = unknown>(
  path: string,
  options: FetchOptions = {},
): Promise<T> {
  const { token, headers, ...rest } = options;

  const res = await fetch(`${GATEWAY_URL}${path}`, {
    ...rest,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(headers ?? {}),
    },
  });

  if (!res.ok) {
    let message = res.statusText;
    let data: unknown;
    try {
      data = await res.json();
      if (typeof data === "object" && data !== null && "message" in data) {
        message = (data as { message: string }).message;
      }
    } catch {
      // ignore parse error
    }
    throw new ApiError(res.status, message, data);
  }

  // 204 No Content
  if (res.status === 204) return undefined as T;

  return res.json() as Promise<T>;
}

/**
 * Client-side fetch: calls Next BFF /api/... routes (NOT .NET directly).
 * Reads accessToken from the request cookie that BFF set on login.
 */
export async function apiFetch<T = unknown>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const res = await fetch(path, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers ?? {}),
    },
    credentials: "include", // send httpOnly cookie automatically
  });

  if (!res.ok) {
    let message = res.statusText;
    let data: unknown;
    try {
      data = await res.json();
      if (typeof data === "object" && data !== null && "message" in data) {
        message = (data as { message: string }).message;
      }
    } catch {
      // ignore
    }
    throw new ApiError(res.status, message, data);
  }

  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}
