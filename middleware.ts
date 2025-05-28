import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

export async function middleware(request: NextRequest) {
  const sessionCookie = getSessionCookie(request);
  const { pathname } = request.nextUrl;

  if (!sessionCookie && !pathname.startsWith("/authentication")) {
    return NextResponse.redirect(
      new URL("/authentication/sign-in", request.url)
    );
  }

  if (sessionCookie && pathname.startsWith("/authentication")) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard", "/budgets", "/transactions", "/categories"], // Apply middleware to specific routes
};
