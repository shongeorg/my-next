"use client";

import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  deletePostApi,
  createCommentApi,
  getErrorMessage,
} from "@/lib/api";
import type { Post, Comment, Author } from "@/lib/types";

interface PostPageClientProps {
  post: Post;
  comments: Comment[];
  author: Author | null;
}

export default function PostPageClient({ post, comments: initialComments, author }: PostPageClientProps) {
  const router = useRouter();
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [commentText, setCommentText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isCommenting, setIsCommenting] = useState(false);
  
  const isPostAuthor = author && author.authorId === post.author_id;

  const handleDeletePost = async () => {
    if (!confirm("Ви впевнені?")) return;
    
    setIsDeleting(true);
    setError(null);
    
    const result = await deletePostApi(post.post_id);
    
    if ("error" in result) {
      setError(getErrorMessage(result));
      setIsDeleting(false);
      return;
    }
    
    router.push("/");
    router.refresh();
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Валідація
    if (!commentText || commentText.trim().length < 1) {
      setError("Введіть текст коментаря");
      return;
    }
    
    setIsCommenting(true);
    setError(null);
    
    const result = await createCommentApi(post.post_id, { content: commentText });
    
    if ("error" in result) {
      const errorMsg = typeof result.error === "string" ? result.error : "Помилка додавання коментаря";
      setError(errorMsg);
      setIsCommenting(false);
      return;
    }
    
    // Clear form and refresh
    setCommentText("");
    setIsCommenting(false);
    
    // Reload page to show new comment
    window.location.reload();
  };

  return (
    <main className="min-h-screen bg-white dark:bg-gray-900">
      <article className="container mx-auto max-w-3xl px-4 py-12">
        <header className="flex items-center justify-between mb-8">
          <Link
            href="/"
            className="px-4 py-2 rounded border hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            ← Back to all posts
          </Link>
          <div className="flex items-center gap-2">
            {isPostAuthor && (
              <>
                <Link
                  href={`/posts/${post.post_id}/edit`}
                  className="px-4 py-2 rounded border hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  ✏️ Edit
                </Link>
                <button
                  onClick={handleDeletePost}
                  disabled={isDeleting}
                  className="px-4 py-2 rounded border border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors disabled:opacity-50"
                >
                  {isDeleting ? "Deleting..." : "− Delete"}
                </button>
              </>
            )}
          </div>
        </header>

        {error && (
          <div className="mb-6 p-3 rounded bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        <div className="space-y-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              {post.title}
            </h1>
            <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
              <span className="font-medium text-gray-900 dark:text-gray-100">
                {post.authorName || post.author_id}
              </span>
              <span>•</span>
              <time dateTime={post.create_at}>
                {formatDistanceToNow(new Date(post.create_at), { addSuffix: true })}
              </time>
            </div>
          </div>
        </div>

        <div className="my-8 border-t dark:border-gray-700" />

        <div className="prose prose-lg dark:prose-invert max-w-none">
          <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
            {post.content}
          </p>
        </div>

        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Коментарі ({comments.length})
          </h2>
          
          {author ? (
            <form onSubmit={handleAddComment} className="mb-8 space-y-4">
              <div>
                <label htmlFor="comment" className="sr-only">
                  Додати коментар
                </label>
                <textarea
                  id="comment"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  rows={3}
                  placeholder="Введіть коментар"
                  required
                  className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
                />
              </div>
              <button
                type="submit"
                disabled={isCommenting || !commentText.trim()}
                className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium transition-colors"
              >
                {isCommenting ? "Додавання..." : "Додати коментар"}
              </button>
            </form>
          ) : (
            <div className="mb-8 p-4 rounded border bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800">
              <p className="text-gray-700 dark:text-gray-300">
                <Link href="/auth/login" className="text-blue-600 hover:underline font-medium">
                  Увійдіть
                </Link>{" "}
                щоб додати коментар
              </p>
            </div>
          )}
          
          {comments.length === 0 ? (
            <p className="text-gray-600 dark:text-gray-400">
              Коментарів ще немає. Будьте першими!
            </p>
          ) : (
            <div className="space-y-4">
              {comments.map((comment) => (
                <div
                  key={comment.comment_id}
                  className="rounded-lg border bg-white dark:bg-gray-800 p-4"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900 dark:text-gray-100">
                        {comment.authorName || comment.author_id}
                      </span>
                      <time className="text-sm text-gray-500 dark:text-gray-400">
                        {formatDistanceToNow(new Date(comment.create_at), { addSuffix: true })}
                      </time>
                    </div>
                  </div>
                  
                  <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                    {comment.content}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </article>
    </main>
  );
}
