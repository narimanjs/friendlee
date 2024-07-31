import { NextResponse, NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const key = req.cookies.get("key");

  if (req.nextUrl.pathname === "/" && !key) {
    return NextResponse.redirect(new URL("/404", req.url));
  }

  return NextResponse.next();
}
