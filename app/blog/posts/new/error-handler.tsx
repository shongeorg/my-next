"use client";

import { useEffect } from "react";

export default function ErrorHandler({
  formAction,
}: {
  formAction: (formData: FormData) => Promise<{ error?: string } | undefined>;
}) {
  useEffect(() => {
    const form = document.querySelector("form");
    const errorDiv = document.getElementById("form-error");
    const errorMessage = document.getElementById("error-message");

    if (!form || !errorDiv || !errorMessage) return;

    const originalAction = form.action;

    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      errorDiv.classList.add("hidden");

      const formData = new FormData(form);
      const result = await formAction(formData);

      if (result?.error) {
        errorDiv.classList.remove("hidden");
        errorMessage.textContent = result.error;
      } else {
        form.submit();
      }
    });

    return () => {
      form.action = originalAction;
    };
  }, [formAction]);

  return null;
}
