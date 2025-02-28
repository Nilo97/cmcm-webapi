import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const cookieStore = cookies();
  const token = cookieStore.has("token");

  if (token) {
  } else {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }
}

export const config = {
  matcher: ["/dashboard/:path*", "/dashboard", "/sales", "/cashflow"],
};
