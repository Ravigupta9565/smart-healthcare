const rawBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.trim();

export function apiUrl(path: string): string {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  if (!rawBaseUrl) {
    // If not configured, use relative path
    return normalizedPath;
  }

  // Accept either the Render origin or an origin that already includes /api.
  const baseUrl = rawBaseUrl.replace(/\/+$/, "").replace(/\/api$/, "");
  return `${baseUrl}${normalizedPath}`;
}

export async function parseApiResponse<T = any>(res: Response): Promise<T> {
  const contentType = res.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    const data = await res.json();
    if (!res.ok) {
      const errorMsg =
        data?.detail ||
        data?.message ||
        (typeof data === "string" ? data : JSON.stringify(data));
      throw new Error(errorMsg || `Request failed with status ${res.status}`);
    }
    return data as T;
  }

  const text = await res.text();
  if (!res.ok) {
    if (
      res.status === 404 ||
      text.includes("The page could not be found") ||
      text.includes("DNS_HOSTNAME_RESOLVED_PRIVATE")
    ) {
      throw new Error(
        "Backend server is not reachable. Please ensure your backend is deployed on Render and NEXT_PUBLIC_API_BASE_URL is added to Vercel settings."
      );
    }
    throw new Error(text.slice(0, 150) || `Server error (${res.status})`);
  }

  try {
    return JSON.parse(text) as T;
  } catch {
    throw new Error("Invalid response format received from server.");
  }
}

