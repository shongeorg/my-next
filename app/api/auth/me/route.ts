import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = "https://hono-on-vercel-woad.vercel.app";

export async function GET(request: NextRequest) {
  const cookieStore = request.cookies;
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    return NextResponse.json({ error: data.error }, { status: response.status });
  }

  return NextResponse.json(data);
}
