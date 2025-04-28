"use client"; // Needs to be a client component to render the form

import { LoginForm } from "@/components/authentication/login_form"; // Adjust import path if needed

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <LoginForm />
    </div>
  );
}
