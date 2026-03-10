import { notFound, redirect } from "next/navigation";
import { cookies } from "next/headers";
import EditPostForm from "./EditPostForm";
import { getPostApi } from "@/lib/api";

interface EditPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditPostPage({ params }: EditPageProps) {
  const { id } = await params;
  
  // Check if user is authenticated
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    redirect("/auth/login");
  }

  // Fetch post data
  const postResult = await getPostApi(id);
  
  if ("error" in postResult) {
    notFound();
  }

  const post = postResult as { title: string; content: string };

  return (
    <EditPostForm
      postId={id}
      initialData={{
        title: post.title,
        content: post.content,
      }}
    />
  );
}
