"use client";

import Link from "next/link";
import { useFormStatus } from "react-dom";
import { useActionState } from "react";
import { createPost } from "./action";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
    >
      {pending ? "Створення..." : "Створити пост"}
    </button>
  );
}

export default function CreatePostPage() {
  const [state, formAction] = useActionState(createPost, { errors: {} as Record<string, string>, values: {} as Record<string, string> });

  const fakeData = {
    title: "Test Post " + Math.random().toString(36).slice(2, 7),
    author: "Test Author",
    content: "This is a test post content for testing purposes. It has more than 6 characters.",
  };

  return (
    <main className="container mx-auto max-w-2xl px-4 py-8 space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-4xl font-bold tracking-tight">Створити пост</h1>
        <Link
          href="/"
          className="text-sm font-medium text-primary hover:underline"
        >
          ← На головну
        </Link>
      </header>

      <form action={formAction} className="space-y-6">
        {state.errors?.form && (
          <div className="rounded-md bg-destructive/15 p-4 text-sm text-destructive">
            {state.errors.form}
          </div>
        )}

        <div className="space-y-2">
          <label
            htmlFor="title"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Заголовок
          </label>
          <input
            type="text"
            id="title"
            name="title"
            defaultValue={state.values?.title || fakeData.title}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="Введіть заголовок (мін. 6 символів)"
          />
          {state.errors?.title && (
            <p className="text-sm text-destructive">{state.errors.title}</p>
          )}
        </div>

        <div className="space-y-2">
          <label
            htmlFor="author"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Автор
          </label>
          <input
            type="text"
            id="author"
            name="author"
            defaultValue={state.values?.author || fakeData.author}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="Введіть ім'я автора"
          />
          {state.errors?.author && (
            <p className="text-sm text-destructive">{state.errors.author}</p>
          )}
        </div>

        <div className="space-y-2">
          <label
            htmlFor="content"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Контент
          </label>
          <textarea
            id="content"
            name="content"
            rows={6}
            defaultValue={state.values?.content || fakeData.content}
            className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="Введіть контент (мін. 6 символів)"
          />
          {state.errors?.content && (
            <p className="text-sm text-destructive">{state.errors.content}</p>
          )}
        </div>

        <SubmitButton />
      </form>
    </main>
  );
}
