import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Number(searchParams.get("page")) || 1;
    const pageSize = 10;

    const totalPosts = await prisma.post.count();
    const totalPages = Math.ceil(totalPosts / pageSize);
    const skip = (page - 1) * pageSize;

    if (page < 1 || (totalPosts > 0 && page > totalPages)) {
      return NextResponse.json(
        { error: "Сторінка не знайдена" },
        { status: 404 }
      );
    }

    const posts = await prisma.post.findMany({
      skip,
      take: pageSize,
      orderBy: {
        id: "desc",
      },
    });

    const response = {
      firstPage: 1,
      lastPage: totalPages,
      currentPage: page,
      totalPages: totalPages,
      data: posts,
      nextPage: page < totalPages ? page + 1 : null,
      prevPage: page > 1 ? page - 1 : null,
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Не вдалося отримати пости" },
      { status: 500 }
    );
  }
}
