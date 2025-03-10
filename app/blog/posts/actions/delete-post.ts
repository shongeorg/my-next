// app/blog/posts/actions/delete-post.ts
import { PrismaClient } from "@prisma/client";
import { redirect } from "next/navigation";

const prisma = new PrismaClient();

export async function deletePost(id: number) {
  "use server";
  try {
    console.log(`Starting deletePost for ID: ${id}`);

    const post = await prisma.post.findUnique({
      where: { id },
    });

    if (!post) {
      throw new Error("Post not found");
    }

    await prisma.post.delete({
      where: { id },
    });

    console.log(`Post with ID ${id} deleted successfully`);
    redirect("/blog/posts?page=1");
  } catch (error) {
    console.error("Error in deletePost:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
    console.log("Prisma disconnected");
  }
}
