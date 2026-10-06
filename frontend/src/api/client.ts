const API_BASE_URL = import.meta.env.VITE_API_URL;

export async function apiFetch<T>(
  path: string,
  options?: RequestInit,
): Promise<T> {
  const method = options?.method?.toUpperCase() ?? "GET";

  const headers = new Headers(options?.headers);

  headers.set("Content-Type", "application/json");

  if (["POST", "PUT", "PATCH", "DELETE"].includes(method)) {
    const csrfToken = getCsrfTokenFromCookie();

    if (!csrfToken) {
      throw new Error("CSRF token is missing.");
    }

    headers.set("X-CSRFToken", csrfToken);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    credentials: "include",
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(JSON.stringify(errorData));
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}


export async function getCsrfToken() {
    const response = await fetch(`${API_BASE_URL}/auth/csrf/`, {
        credentials: "include",
    });

    if (!response.ok) {
        throw new Error("Failed to initialize CSRF protection.");
    }
}


function getCsrfTokenFromCookie(): string | null {
  const cookies = document.cookie.split(";");

  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split("=");

    if (name === "csrftoken") {
      return decodeURIComponent(value);
    }
  }

  return null;
}