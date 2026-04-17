import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const password = body?.password;

    if (!password) {
      return NextResponse.json(
        { success: false, message: "Password is required." },
        { status: 400 }
      );
    }

    const expectedPassword = process.env.BETA_ACCESS_PASSWORD;

    if (!expectedPassword) {
      return NextResponse.json(
        { success: false, message: "Beta password is not configured." },
        { status: 500 }
      );
    }

    if (password !== expectedPassword) {
      return NextResponse.json(
        { success: false, message: "Incorrect password." },
        { status: 401 }
      );
    }

    const response = NextResponse.json({ success: true });

    response.cookies.set("access_granted", "true", {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch {
    return NextResponse.json(
      { success: false, message: "Something went wrong." },
      { status: 500 }
    );
  }
}