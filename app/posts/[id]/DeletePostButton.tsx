"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { deletePostApi, getErrorMessage } from "@/lib/api";

interface DeletePostButtonProps {
  postId: string;
}

export function DeletePostButton({ postId }: DeletePostButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    startTransition(async () => {
      const result = await deletePostApi(postId);

      if ("error" in result) {
        setError(getErrorMessage(result));
        return;
      }

      router.push("/");
      router.refresh();
    });
  };

  return (
    <>
      {error && (
        <div className="mb-4 p-3 rounded bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <button
          type="submit"
          disabled={isPending}
          className="px-4 py-2 rounded border border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors disabled:opacity-50"
        >
          {isPending ? "Видалення..." : "− Delete"}
        </button>
      </form>
    </>
  );
}
