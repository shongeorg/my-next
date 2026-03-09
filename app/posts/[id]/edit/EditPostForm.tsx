"use client";

import Link from "next/link";
import { useFormStatus } from "react-dom";
import { useActionState } from "react";
import { updatePost } from "./action";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
    >
      {pending ? "Збереження..." : "Зберегти зміни"}
    </button>
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
  const [state, formAction] = useActionState(updatePost, { errors: {} as Record<string, string>, values: {} as Record<string, string> });

  return (
    <main className="container mx-auto max-w-2xl px-4 py-8 space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-4xl font-bold tracking-tight">Редагувати пост</h1>
        <Link
          href={`/posts/${postId}`}
          className="text-sm font-medium text-primary hover:underline"
        >
          ← Назад до поста
        </Link>
      </header>

      <form action={formAction} className="space-y-6">
        <input type="hidden" name="postId" value={postId} />
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
            defaultValue={state.values?.title || initialData.title}
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
            defaultValue={state.values?.author || initialData.author}
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
            defaultValue={state.values?.content || initialData.content}
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
