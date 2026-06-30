import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import LoginForm from "@/components/LoginForm";

export default async function LoginPage() {
  const user = await getCurrentUser();
  if (user) redirect("/board");

  return (
    <main className="flex min-h-screen items-center justify-center bg-board text-white px-4">
      <div className="w-full max-w-sm p-8 bg-surface rounded-lg">
        <h1 className="text-2xl font-medium mb-6">Sign in</h1>
        <LoginForm />
        <p className="text-sm text-muted mt-4">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-accent">
            Sign up
          </Link>
        </p>
      </div>
    </main>
  );
}
