import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const postId = Number(params.id);

    if (isNaN(postId)) {
      return NextResponse.json({ error: "Некоректний ID" }, { status: 400 });
    }

    const post = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      return NextResponse.json({ error: "Пост не знайдено" }, { status: 404 });
    }

    return NextResponse.json(post, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Не вдалося отримати пост" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
