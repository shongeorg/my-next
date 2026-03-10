"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createPostSchema, type CreatePostInput } from "@/lib/schemas";
import { createPostApi } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function CreatePostPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<CreatePostInput>({
    resolver: zodResolver(createPostSchema),
    defaultValues: {
      title: `Test Post ${Math.random().toString(36).slice(2, 7)}`,
      content: "This is a test post content for testing purposes.",
    },
  });

  const onSubmit = async (data: CreatePostInput) => {
    setIsLoading(true);
    setError(null);

    const result = await createPostApi(data);

    if ("error" in result) {
      const errorMsg = typeof result.error === "string" ? result.error : "Помилка створення поста";
      setError(errorMsg);
      if (errorMsg.includes("Unauthorized") || errorMsg.includes("auth")) {
        router.push("/auth/login");
      }
      setIsLoading(false);
      return;
    }

    router.push(`/posts/${result.post_id}`);
  };

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto max-w-2xl px-4 py-12">
        <header className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold">Створити пост</h1>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link href="/">
              <Button variant="outline">← На головну</Button>
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
              {isLoading ? "Створення..." : "Створити пост"}
            </Button>
          </form>
        </div>
      </div>
    </main>
  );
}
