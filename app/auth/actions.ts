"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";

const API_BASE_URL = process.env.NEXT_PUBLIC_APP_URL;

export async function login(prevState: any, formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  // Валідація
  const errors: Record<string, string> = {};

  if (!email || !email.includes("@")) {
    errors.email = "Введіть правильний email";
  }

  if (!password || password.length < 6) {
    errors.password = "Пароль має містити щонайменше 6 символів";
  }

  if (Object.keys(errors).length > 0) {
    return { errors, values: { email } };
  }

  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();

  if (!response.ok) {
    return { errors: { form: data.error || "Помилка входу" }, values: { email } };
  }

  const { token, author } = data;

  const cookieStore = await cookies();
  cookieStore.set("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });
  cookieStore.set("author", JSON.stringify(author), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });

  redirect("/");
}

export async function register(prevState: any, formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  // Валідація
  const errors: Record<string, string> = {};

  if (!name || name.trim().length < 2) {
    errors.name = "Ім'я має містити щонайменше 2 символи";
  }

  if (!email || !email.includes("@")) {
    errors.email = "Введіть правильний email";
  }

  if (!password || password.length < 6) {
    errors.password = "Пароль має містити щонайменше 6 символів";
  }

  if (Object.keys(errors).length > 0) {
    return { errors, values: { name, email } };
  }

  const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });

  const data = await response.json();

  if (!response.ok) {
    return { errors: { form: data.error || "Помилка реєстрації" }, values: { name, email } };
  }

  const { token, author } = data;

  const cookieStore = await cookies();
  cookieStore.set("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });
  cookieStore.set("author", JSON.stringify(author), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });

  redirect("/");
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete("token");
  cookieStore.delete("author");
  redirect("/");
}
