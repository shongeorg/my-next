"use client";

import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { deleteCommentApi, getErrorMessage } from "@/lib/api";
import type { Comment, ApiError } from "@/lib/types";

interface CommentsListProps {
  comments: Comment[];
  postId: string;
  currentAuthorId?: string;
  onCommentDeleted: () => void;
}

export function CommentsList({ comments, postId, currentAuthorId, onCommentDeleted }: CommentsListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async (commentId: string) => {
    setError(null);
    setDeletingId(commentId);

    const result = await deleteCommentApi(postId, commentId);

    if ("error" in result) {
      setError(getErrorMessage(result));
      setDeletingId(null);
      return;
    }

    onCommentDeleted();
  };

  if (comments.length === 0) {
    return (
      <div className="mt-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Коментарі</h2>
        <p className="text-gray-600 dark:text-gray-400">Коментарів ще немає. Будьте першими!</p>
      </div>
    );
  }

  return (
    <div className="mt-8 space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Коментарі ({comments.length})
      </h2>
      
      {error && (
        <div className="p-3 rounded bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}
      
      {comments.map((comment) => {
        const isAuthor = currentAuthorId === comment.author_id;
        const isDeleting = deletingId === comment.comment_id;
        
        return (
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
              
              {isAuthor && (
                <button
                  onClick={() => handleDelete(comment.comment_id)}
                  disabled={isDeleting}
                  className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 text-sm disabled:opacity-50"
                >
                  {isDeleting ? "Видалення..." : "− Видалити"}
                </button>
              )}
            </div>
            
            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
              {comment.content}
            </p>
          </div>
        );
      })}
    </div>
  );
}
