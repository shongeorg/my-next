"use client";

import { useState } from "react";
import { Comment } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { updateComment, deleteComment } from "./actions";
import { formatDistanceToNow } from "date-fns";

interface CommentItemProps {
  comment: Comment;
  postId: string;
}

export function CommentItem({ comment, postId }: CommentItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const formattedDate = formatDistanceToNow(new Date(comment.create_at), {
    addSuffix: true,
  });

  const handleDelete = async () => {
    if (!confirm("Видалити коментар?")) return;
    setIsDeleting(true);
    await deleteComment(postId, comment.comment_id);
  };

  if (isEditing) {
    return (
      <Card className="mb-4">
        <CardContent className="pt-6">
          <EditCommentForm
            postId={postId}
            commentId={comment.comment_id}
            initialContent={comment.content}
            initialAuthor={comment.author}
            onCancel={() => setIsEditing(false)}
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-4">
      <CardContent className="pt-6">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm">
              <span className="font-medium text-foreground">{comment.author}</span>
              <span className="text-muted-foreground">•</span>
              <time className="text-muted-foreground">{formattedDate}</time>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditing(true)}
                className="h-8 px-2"
              >
                ✏️
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleDelete}
                disabled={isDeleting}
                className="h-8 px-2"
              >
                −
              </Button>
            </div>
          </div>
          <p className="text-muted-foreground whitespace-pre-wrap">{comment.content}</p>
        </div>
      </CardContent>
    </Card>
  );
}

interface EditCommentFormProps {
  postId: string;
  commentId: string;
  initialContent: string;
  initialAuthor: string;
  onCancel: () => void;
}

function EditCommentForm({ postId, commentId, initialContent, initialAuthor, onCancel }: EditCommentFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true);
    await updateComment(postId, commentId, formData);
    setIsSubmitting(false);
  };

  return (
    <form action={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="author">Ваше ім'я</Label>
        <Textarea
          id="author"
          name="author"
          defaultValue={initialAuthor}
          className="min-h-[40px]"
          required
          minLength={2}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="content">Коментар</Label>
        <Textarea
          id="content"
          name="content"
          defaultValue={initialContent}
          className="min-h-[80px]"
          required
          minLength={3}
        />
      </div>
      <div className="flex gap-2">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Збереження..." : "Зберегти"}
        </Button>
        <Button type="button" variant="ghost" onClick={onCancel}>
          Скасувати
        </Button>
      </div>
    </form>
  );
}
