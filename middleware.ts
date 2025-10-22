import { NextRequest, NextResponse } from "next/server";

const locales = ["ms", "en"] as const;

type Locale = (typeof locales)[number];

export default async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  const seg = (pathname.split("/")[1] || "") as Locale;

  if (!locales.includes(seg)) {
    const url = req.nextUrl.clone();
    url.pathname = `/ms${pathname}`;
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}