import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const session = request.cookies.get("admin_session");
  return NextResponse.json({ isAdmin: session?.value === "1" });
}
