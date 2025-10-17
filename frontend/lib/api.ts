// lib/api.ts
export const apiFetch = async (path: string, options: RequestInit = {}) => {
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL!;
  return fetch(`${baseUrl}${path}`, options);
};
