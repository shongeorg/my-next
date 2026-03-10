"use client";

import { Author } from "@/lib/types";

interface UserMenuProps {
  author: Author;
}

export function UserMenu({ author }: UserMenuProps) {
  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.reload();
  };

  return (
    <>
      <a
        href="/posts/create"
        className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white transition-colors"
      >
        + Створити пост
      </a>
      <button
        onClick={handleLogout}
        className="px-4 py-2 rounded border hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      >
        Вийти ({author.name})
      </button>
    </>
  );
}
