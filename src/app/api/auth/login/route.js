// src/app/api/auth/login/route.js
import { NextResponse } from "next/server";
import PocketBase from "pocketbase";

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required" },
        { status: 400 }
      );
    }

    const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL);
    pb.autoCancellation(false);

    const authData = await pb
      .collection("users")
      .authWithPassword(email, password);

    // Get the cookie from PocketBase
    const cookie = pb.authStore.exportToCookie({
      secure: false, // Set to false for local development
      httpOnly: false, // Allow JavaScript access if needed
      sameSite: "Lax",
      path: "/",
    });

    // Create the response
    const response = NextResponse.json({
      success: true,
      user: authData.record,
    });

    // Set the cookie in the response headers
    response.headers.set("Set-Cookie", cookie);

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { message: "Invalid credentials" },
      { status: 401 }
    );
  }
}
