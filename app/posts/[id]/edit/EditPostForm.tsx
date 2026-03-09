"use client";

import Link from "next/link";
import { useFormStatus } from "react-dom";
import { useActionState } from "react";
import { updatePost } from "./action";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ThemeToggle } from "@/components/ThemeToggle";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending} className="w-full rounded-full" size="lg">
      {pending ? "Збереження..." : "Зберегти зміни"}
    </Button>
  );
}

interface EditPostFormProps {
  postId: string;
  initialData: {
    title: string;
    content: string;
    author: string;
  };
}

export default function EditPostForm({ postId, initialData }: EditPostFormProps) {
  const [state, formAction] = useActionState(updatePost, {
    errors: {} as Record<string, string>,
    values: {} as Record<string, string>,
  });

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto max-w-2xl px-4 py-12">
        <header className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold tracking-tight text-foreground">Редагувати пост</h1>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link href={`/posts/${postId}`}>
              <Button variant="ghost">← Назад до поста</Button>
            </Link>
          </div>
        </header>

        <Card>
          <CardHeader>
            <CardTitle>Редагування інформації про пост</CardTitle>
          </CardHeader>
          <CardContent>
            <form action={formAction} className="space-y-6">
              <input type="hidden" name="postId" value={postId} />

              {state.errors?.form && (
                <div className="rounded-lg bg-destructive/15 p-4 text-sm text-destructive border border-destructive/30">
                  {state.errors.form}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="title">Заголовок</Label>
                <Input
                  id="title"
                  name="title"
                  defaultValue={state.values?.title || initialData.title}
                  placeholder="Введіть заголовок (мін. 6 символів)"
                />
                {state.errors?.title && (
                  <p className="text-sm text-destructive">{state.errors.title}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="author">Автор</Label>
                <Input
                  id="author"
                  name="author"
                  defaultValue={state.values?.author || initialData.author}
                  placeholder="Введіть ім'я автора"
                />
                {state.errors?.author && (
                  <p className="text-sm text-destructive">{state.errors.author}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Контент</Label>
                <Textarea
                  id="content"
                  name="content"
                  rows={6}
                  defaultValue={state.values?.content || initialData.content}
                  placeholder="Введіть контент (мін. 6 символів)"
                />
                {state.errors?.content && (
                  <p className="text-sm text-destructive">{state.errors.content}</p>
                )}
              </div>

              <SubmitButton />
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
