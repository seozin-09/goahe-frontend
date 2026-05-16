export const API_BASE_URL = "https://goahe-backend-359009877925.asia-northeast3.run.app";

export async function apiFetch(path: string, options: RequestInit = {}) {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  // JSON이 아닐 수도 있어서 안전하게 처리
  const text = await res.text();
  let data: any = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  if (!res.ok) {
    throw new Error(
      typeof data === "string"
        ? data
        : data?.message || `HTTP ${res.status}`
    );
  }

  return data;
}