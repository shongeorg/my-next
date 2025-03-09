import { NextResponse } from "next/server";

// @ts-ignore
export function middleware(req) {
  const url = new URL(req.url);
  return NextResponse.next({
    request: {
      headers: req.headers,
    },
  });
}
