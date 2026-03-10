"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updatePostSchema, type UpdatePostInput } from "@/lib/schemas";
import { updatePostApi } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function EditPostPage() {
  const router = useRouter();
  const params = useParams();
  const postId = params.id as string;
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<UpdatePostInput>({
    resolver: zodResolver(updatePostSchema),
    defaultValues: {
      title: "",
      content: "",
    },
  });

  const onSubmit = async (data: UpdatePostInput) => {
    setIsLoading(true);
    setError(null);

    const result = await updatePostApi(postId, data);

    if ("error" in result) {
      const errorMsg = typeof result.error === "string" ? result.error : "Помилка оновлення поста";
      if (errorMsg.includes("Unauthorized") || errorMsg.includes("auth")) {
        router.push("/auth/login");
      }
      setError(errorMsg);
      setIsLoading(false);
      return;
    }

    router.push(`/posts/${postId}`);
  };

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto max-w-2xl px-4 py-12">
        <header className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold">Редагувати пост</h1>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link href={`/posts/${postId}`}>
              <Button variant="outline">← Назад до поста</Button>
            </Link>
          </div>
        </header>

        <div className="rounded-lg border bg-card p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {error && (
              <div className="p-3 rounded bg-destructive/10 border border-destructive/50">
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}

            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium">
                Заголовок
              </label>
              <input
                id="title"
                type="text"
                placeholder="Введіть заголовок"
                {...register("title")}
                className="w-full px-3 py-2 rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              />
              {errors.title && (
                <p className="text-sm text-destructive">{errors.title.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="content" className="text-sm font-medium">
                Контент
              </label>
              <textarea
                id="content"
                rows={6}
                placeholder="Введіть контент"
                {...register("content")}
                className="w-full px-3 py-2 rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring resize-y"
              />
              {errors.content && (
                <p className="text-sm text-destructive">{errors.content.message}</p>
              )}
            </div>

            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? "Збереження..." : "Зберегти зміни"}
            </Button>
          </form>
        </div>
      </div>
    </main>
  );
}
