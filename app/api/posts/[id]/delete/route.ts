import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = "https://hono-on-vercel-woad.vercel.app";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const token = request.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const response = await fetch(`${API_BASE_URL}/api/posts/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await response.json();
  
  if (!response.ok) {
    return NextResponse.json(data, { status: response.status });
  }

  const res = NextResponse.redirect(new URL("/", request.url));
  return res;
}
