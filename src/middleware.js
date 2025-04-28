// src/middleware.js (yes, it goes directly in the src directory, not in app)
import { NextResponse } from "next/server";
import PocketBase from "pocketbase";

const pocketbaseUrl = process.env.NEXT_PUBLIC_POCKETBASE_URL;
const publicPaths = ["/login"];
const USER_DASHBOARD_PATH = "/dashboard";

export async function middleware(request) {
  const pathname = request.nextUrl.pathname;
  const requestUrl = request.url;

  // Skip check for Next.js internals, public files, and API routes
  if (
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/api/") ||
    pathname.startsWith("/static/") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  if (!pocketbaseUrl) {
    console.error(
      "Middleware Error: NEXT_PUBLIC_POCKETBASE_URL is not defined."
    );
    return new Response(
      "Internal Server Error: PocketBase URL not configured.",
      { status: 500 }
    );
  }

  const pb = new PocketBase(pocketbaseUrl);
  const authCookie = request.cookies.get("pb_auth");
  let isValid = false;
  let clearCookieInResponse = false;

  if (authCookie) {
    try {
      pb.authStore.loadFromCookie(request.headers.get("cookie") || "");
      if (pb.authStore.isValid) {
        await pb.collection("users").authRefresh();
        isValid = pb.authStore.isValid;
      } else {
        clearCookieInResponse = true;
        pb.authStore.clear();
      }
    } catch (error) {
      console.warn("Middleware: Auth check/refresh failed:", error.message);
      pb.authStore.clear();
      isValid = false;
      clearCookieInResponse = true;
    }
  }

  const isPublicPath = publicPaths.some(
    (path) =>
      pathname === path || (path !== "/" && pathname.startsWith(path + "/"))
  );

  // Redirect logic
  if (!isValid && !isPublicPath) {
    const loginUrl = new URL("/login", requestUrl);
    loginUrl.searchParams.set("redirectedFrom", pathname);
    const response = NextResponse.redirect(loginUrl);
    if (authCookie) {
      response.cookies.set("pb_auth", "", { path: "/", expires: new Date(0) });
    }
    return response;
  }

  if (isValid && isPublicPath) {
    const dashboardUrl = new URL(USER_DASHBOARD_PATH, requestUrl);
    return NextResponse.redirect(dashboardUrl);
  }

  const response = NextResponse.next();
  if (clearCookieInResponse) {
    response.cookies.set("pb_auth", "", { path: "/", expires: new Date(0) });
  }

  return response;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|images/).*)"],
};
