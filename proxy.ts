import { NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  const adminSession = request.cookies.get("admin_session");
  if (!adminSession?.value) {
    return NextResponse.redirect(new URL("/login-admin", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
