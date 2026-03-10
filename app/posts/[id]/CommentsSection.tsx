"use client";

import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { uk } from "date-fns/locale";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createCommentSchema, type CreateCommentInput } from "@/lib/schemas";
import { createCommentApi, updateCommentApi, deleteCommentApi } from "@/lib/api";
import { Button } from "@/components/ui/button";
import type { Comment, Author } from "@/lib/types";

interface CommentsSectionProps {
  postId: string;
  comments: Comment[];
  author?: Author | null;
}

export function CommentsSection({ postId, comments: initialComments, author }: CommentsSectionProps) {
  const [comments, setComments] = useState(initialComments);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  
  const authorId = author?.authorId;
  const authorName = author?.name;

  const { register: registerComment, handleSubmit: handleSubmitComment, formState: { errors: commentErrors }, reset } = useForm<CreateCommentInput>({
    resolver: zodResolver(createCommentSchema),
    defaultValues: { content: "" },
  });

  const { register: registerEdit, handleSubmit: handleSubmitEdit, formState: { errors: editErrors } } = useForm({
    resolver: zodResolver(createCommentSchema),
    defaultValues: { content: editContent },
  });

  const onAddComment = async (data: CreateCommentInput) => {
    const result = await createCommentApi(postId, data);
    if ("error" in result) {
      alert(typeof result.error === "string" ? result.error : "Помилка додавання коментаря");
      return;
    }
    setComments([...comments, result as Comment]);
    reset();
  };

  const onEditComment = async (data: CreateCommentInput) => {
    if (!editingId) return;
    const result = await updateCommentApi(postId, editingId, data);
    if ("error" in result) {
      alert(typeof result.error === "string" ? result.error : "Помилка оновлення коментаря");
      return;
    }
    setComments(comments.map(c => c.comment_id === editingId ? { ...c, content: data.content } : c));
    setEditingId(null);
  };

  const onDeleteComment = async (commentId: string) => {
    if (!confirm("Видалити коментар?")) return;
    const result = await deleteCommentApi(postId, commentId);
    if ("error" in result) {
      alert(typeof result.error === "string" ? result.error : "Помилка видалення коментаря");
      return;
    }
    setComments(comments.filter(c => c.comment_id !== commentId));
  };

  const startEdit = (comment: Comment) => {
    setEditingId(comment.comment_id);
    setEditContent(comment.content);
  };

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold mb-6">Коментарі ({comments.length})</h2>

      {authorId ? (
        <form onSubmit={handleSubmitComment(onAddComment)} className="mb-8 space-y-4">
          <div>
            <textarea
              {...registerComment("content")}
              rows={3}
              placeholder="Введіть коментар"
              className="w-full px-3 py-2 rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring resize-y"
            />
            {commentErrors.content && (
              <p className="text-sm text-destructive">{commentErrors.content.message}</p>
            )}
          </div>
          <Button type="submit">Додати коментар</Button>
        </form>
      ) : (
        <div className="mb-8 p-4 rounded border bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800">
          <p className="text-muted-foreground">
            <a href="/auth/login" className="text-primary hover:underline font-medium">Увійдіть</a> щоб додати коментар
          </p>
        </div>
      )}

      {comments.length === 0 ? (
        <p className="text-muted-foreground">Коментарів ще немає. Будьте першими!</p>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => {
            const isCommentAuthor = authorId === comment.author_id;
            const isEditing = editingId === comment.comment_id;

            return (
              <div key={comment.comment_id} className="rounded-lg border bg-card p-4">
                {isEditing ? (
                  <form onSubmit={handleSubmitEdit(onEditComment)} className="space-y-3">
                    <textarea
                      {...registerEdit("content")}
                      rows={3}
                      defaultValue={editContent}
                      className="w-full px-3 py-2 rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring resize-y"
                    />
                    {editErrors.content && (
                      <p className="text-sm text-destructive">{editErrors.content.message}</p>
                    )}
                    <div className="flex gap-2">
                      <Button type="submit" size="sm">Зберегти</Button>
                      <Button type="button" variant="outline" size="sm" onClick={() => setEditingId(null)}>Скасувати</Button>
                    </div>
                  </form>
                ) : (
                  <>
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">
                          {comment.authorName || 'Користувач'}
                        </span>
                        <time className="text-sm text-muted-foreground">
                          {formatDistanceToNow(new Date(comment.create_at), { addSuffix: true, locale: uk })}
                        </time>
                      </div>
                      {isCommentAuthor && (
                        <div className="flex gap-2">
                          <Button variant="ghost" size="icon" onClick={() => startEdit(comment)}>✏️</Button>
                          <Button variant="ghost" size="icon" onClick={() => onDeleteComment(comment.comment_id)}>−</Button>
                        </div>
                      )}
                    </div>
                    <p className="text-muted-foreground whitespace-pre-wrap">{comment.content}</p>
                  </>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
