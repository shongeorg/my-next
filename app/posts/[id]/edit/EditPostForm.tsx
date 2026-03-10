"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { updatePostApi, getErrorMessage } from "@/lib/api";
import type { ApiError, ValidationError } from "@/lib/types";

interface EditPostFormProps {
  postId: string;
  initialData: {
    title: string;
    content: string;
  };
}

export default function EditPostForm({ postId, initialData }: EditPostFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState(initialData);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Валідація
    if (!formData.title || formData.title.trim().length < 6) {
      setError("Заголовок має містити щонайменше 6 символів");
      setIsLoading(false);
      return;
    }

    if (!formData.content || formData.content.trim().length < 6) {
      setError("Контент має містити щонайменше 6 символів");
      setIsLoading(false);
      return;
    }

    const result = await updatePostApi(postId, formData);

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <main className="min-h-screen bg-white dark:bg-gray-900">
      <div className="container mx-auto max-w-2xl px-4 py-12">
        <header className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Редагувати пост</h1>
          <Link
            href={`/posts/${postId}`}
            className="px-4 py-2 rounded border hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            ← Назад до поста
          </Link>
        </header>

        <div className="rounded-lg border bg-white dark:bg-gray-800 p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-3 rounded bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}

            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium text-gray-900 dark:text-gray-100">
                Заголовок
              </label>
              <input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Введіть заголовок"
                required
                minLength={6}
                className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="content" className="text-sm font-medium text-gray-900 dark:text-gray-100">
                Контент
              </label>
              <textarea
                id="content"
                name="content"
                rows={6}
                value={formData.content}
                onChange={handleChange}
                placeholder="Введіть контент"
                required
                minLength={6}
                className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2 px-4 rounded bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium transition-colors"
            >
              {isLoading ? "Збереження..." : "Зберегти зміни"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
