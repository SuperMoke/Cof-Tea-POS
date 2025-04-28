// src/app/api/auth/logout/route.js
import { NextResponse } from "next/server";

export async function POST() {
  // Create the response
  const response = NextResponse.json({ success: true });

  // Clear the auth cookie
  response.cookies.set("pb_auth", "", {
    expires: new Date(0),
    path: "/",
  });

  return response;
}
