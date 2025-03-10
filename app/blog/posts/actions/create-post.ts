// actions/create-post.ts
import { PrismaClient } from "@prisma/client";
import { redirect } from "next/navigation";

const prisma = new PrismaClient();

export default async function createPost(formData: FormData) {
  "use server";
  try {
    const title = formData.get("title") as string;
    const body = formData.get("body") as string;

    if (!title || !body) {
      throw new Error("Title and body are required");
    }

    const data = {
      title: title.trim(),
      body: body.trim(),
    };

    await prisma.post.create({ data });
    redirect("/blog/posts?page=1"); // Використовуємо redirect від Next.js
  } catch (error) {
    console.error(error);
    throw error; // Перекидаємо помилку для обробки на клієнті
  } finally {
    await prisma.$disconnect();
  }
}
