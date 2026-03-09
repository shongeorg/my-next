"use client";

import Link from "next/link";
import { useFormStatus } from "react-dom";
import { useActionState } from "react";
import { createPost } from "./action";
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
      {pending ? "Створення..." : "Створити пост"}
    </Button>
  );
}

export default function CreatePostPage() {
  const [state, formAction] = useActionState(createPost, {
    errors: {} as Record<string, string>,
    values: {} as Record<string, string>,
  });

  const fakeData = {
    title: "Test Post " + Math.random().toString(36).slice(2, 7),
    author: "Test Author",
    content: "This is a test post content for testing purposes. It has more than 6 characters.",
  };

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto max-w-2xl px-4 py-12">
        <header className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold tracking-tight text-foreground">Створити пост</h1>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link href="/">
              <Button variant="ghost">← На головну</Button>
            </Link>
          </div>
        </header>

        <Card>
          <CardHeader>
            <CardTitle>Заповніть інформацію про пост</CardTitle>
          </CardHeader>
          <CardContent>
            <form action={formAction} className="space-y-6">
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
                  defaultValue={state.values?.title || fakeData.title}
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
                  defaultValue={state.values?.author || fakeData.author}
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
                  defaultValue={state.values?.content || fakeData.content}
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
