import axios, { AxiosResponse, InternalAxiosRequestConfig } from "axios";

export const api = axios.create({
  baseURL: "/api",
  timeout: 10000,
});

const CACHE_PREFIX = "mh_offline_cache:";
const MAX_CACHE_ENTRIES = 100;

interface CacheEntry {
  data: any;
  timestamp: number;
  url: string;
}

function getCacheKey(config: InternalAxiosRequestConfig): string {
  const paramsKey = config.params ? JSON.stringify(config.params) : "";
  return `${CACHE_PREFIX}${config.method?.toUpperCase()}:${config.url}:${paramsKey}`;
}

export function getCachedResponse(url: string, params?: any): any | null {
  try {
    const paramsKey = params ? JSON.stringify(params) : "";
    const key = `${CACHE_PREFIX}GET:${url}:${paramsKey}`;
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const entry: CacheEntry = JSON.parse(raw);
    return entry.data;
  } catch {
    return null;
  }
}

function saveToCache(config: InternalAxiosRequestConfig, data: any) {
  try {
    if (!config.url) return;
    const key = getCacheKey(config);
    const entry: CacheEntry = {
      data,
      timestamp: Date.now(),
      url: config.url,
    };
    localStorage.setItem(key, JSON.stringify(entry));
  } catch (err) {
    // If storage is full, prune older cache entries
    try {
      const keys = Object.keys(localStorage).filter((k) => k.startsWith(CACHE_PREFIX));
      if (keys.length > MAX_CACHE_ENTRIES / 2) {
        keys.slice(0, 20).forEach((k) => localStorage.removeItem(k));
      }
    } catch {}
  }
}

function invalidateRelatedCache(url?: string) {
  if (!url) return;
  try {
    const keys = Object.keys(localStorage).filter((k) => k.startsWith(CACHE_PREFIX));
    // If a meeting, student, task, issue, or notification changes, purge related cached list queries
    keys.forEach((k) => {
      if (
        (url.includes("meeting") && k.includes("meeting")) ||
        (url.includes("student") && (k.includes("student") || k.includes("dashboard"))) ||
        (url.includes("action") && (k.includes("action") || k.includes("dashboard"))) ||
        (url.includes("issue") && (k.includes("issue") || k.includes("dashboard"))) ||
        (url.includes("notification") && k.includes("notification")) ||
        (url.includes("profile") && (k.includes("profile") || k.includes("auth/me")))
      ) {
        localStorage.removeItem(k);
      }
    });
  } catch {}
}

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("maa_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;

  // If browser is actively offline and it's a GET request, check cache before network
  if (typeof navigator !== "undefined" && !navigator.onLine && config.method?.toLowerCase() === "get") {
    const cachedData = getCachedResponse(config.url || "", config.params);
    if (cachedData !== null) {
      // Attach cached data directly to config adapter or handle via fallback
      (config as any).__offlineCachedData = cachedData;
    }
  }

  return config;
});

api.interceptors.response.use(
  (response) => {
    // Save successful GET requests to offline cache
    if (response.config.method?.toLowerCase() === "get" && response.status === 200 && response.data) {
      saveToCache(response.config, response.data);
    } else if (
      response.config.method &&
      ["post", "put", "patch", "delete"].includes(response.config.method.toLowerCase())
    ) {
      invalidateRelatedCache(response.config.url);
    }
    return response;
  },
  (error) => {
    const config = error?.config as InternalAxiosRequestConfig | undefined;

    // Handle 401 Unauthorized
    if (error?.response?.status === 401) {
      localStorage.removeItem("maa_token");
      localStorage.removeItem("maa_user");
      if (typeof window !== "undefined" && !window.location.pathname.startsWith("/login")) {
        window.location.href = "/login";
      }
      return Promise.reject(error);
    }

    // Offline or Network Error Fallback for GET requests
    const isNetworkError =
      !error.response ||
      error.code === "ERR_NETWORK" ||
      error.code === "ECONNABORTED" ||
      (typeof navigator !== "undefined" && !navigator.onLine);

    if (config && config.method?.toLowerCase() === "get" && isNetworkError) {
      const cached = (config as any).__offlineCachedData || getCachedResponse(config.url || "", config.params);
      if (cached !== null) {
        // Return synthetic response from offline cache
        const syntheticResponse: AxiosResponse = {
          data: cached,
          status: 200,
          statusText: "OK (Offline Cache)",
          headers: { "x-offline-cached": "true" },
          config,
        };
        (syntheticResponse as any).isOfflineCached = true;

        window.dispatchEvent(
          new CustomEvent("mentorhub:offline-fallback", {
            detail: { url: config.url, timestamp: Date.now() },
          })
        );

        return Promise.resolve(syntheticResponse);
      }
    }

    return Promise.reject(error);
  }
);

export function apiErrorMessage(err: unknown, fallback = "Something went wrong. Please try again."): string {
  const anyErr = err as any;
  if (typeof navigator !== "undefined" && !navigator.onLine) {
    return "You appear to be offline. Please check your network connection.";
  }
  return anyErr?.response?.data?.message ?? anyErr?.message ?? fallback;
}
