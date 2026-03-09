"use client";

import { useState } from "react";
import { Comment } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { createComment } from "./actions";

interface CommentsFormProps {
  postId: string;
}

export function CommentsForm({ postId }: CommentsFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true);
    await createComment(postId, formData);
    setIsSubmitting(false);
  };

  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <form action={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="author">Ваше ім'я</Label>
            <Textarea
              id="author"
              name="author"
              placeholder="Введіть ваше ім'я"
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
              placeholder="Напишіть коментар..."
              className="min-h-[80px]"
              required
              minLength={3}
            />
          </div>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Відправка..." : "Додати коментар"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
