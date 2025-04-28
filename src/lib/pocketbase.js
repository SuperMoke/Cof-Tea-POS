// src/lib/pocketbase.js
import PocketBase from "pocketbase";

const pocketbaseUrl = process.env.NEXT_PUBLIC_POCKETBASE_URL;
if (!pocketbaseUrl) {
  throw new Error("Missing environment variable: NEXT_PUBLIC_POCKETBASE_URL");
}

// For client-side usage
let pbInstance = null;

if (typeof window !== "undefined") {
  if (!window.__pocketbaseInstance) {
    window.__pocketbaseInstance = new PocketBase(pocketbaseUrl);
    window.__pocketbaseInstance.autoCancellation(false);

    // Try to load auth store from cookie if available
    if (document.cookie) {
      window.__pocketbaseInstance.authStore.loadFromCookie(
        document.cookie,
        "pb_auth"
      );
    }
  }
  pbInstance = window.__pocketbaseInstance;
} else {
  // Server-side instance (for middleware, server components, etc.)
  pbInstance = new PocketBase(pocketbaseUrl);
  pbInstance.autoCancellation(false);
}

export const pb = pbInstance;

// For server components that need fresh PocketBase instances
export const createServerPB = () => {
  return new PocketBase(pocketbaseUrl);
};

export const isLoggedIn = () => {
  if (typeof window !== "undefined" && pb && pb.authStore) {
    return pb.authStore.isValid;
  }
  return false;
};

export const getUserData = () => {
  if (
    typeof window !== "undefined" &&
    pb &&
    pb.authStore &&
    pb.authStore.model
  ) {
    return pb.authStore.model;
  }
  return null;
};

export const logout = async () => {
  if (typeof window !== "undefined") {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      });

      if (response.ok) {
        pb.authStore.clear();
        window.location.href = "/login";
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  }
};
