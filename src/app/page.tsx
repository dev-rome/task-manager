import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";

export default async function HomePage() {
  const user = await getCurrentUser();
  if (user) redirect("/board");

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-board text-white p-6">
      <div className="max-w-md text-center">
        <h1 className="text-4xl font-medium mb-4">Kanban</h1>
        <p className="text-muted mb-8">
          A simple, focused task board. Organize your work into Todo, In
          progress, and Done — and get things done.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link
            href="/login"
            className="bg-accent rounded-full px-6 py-2 text-sm font-medium"
          >
            Log in
          </Link>
          <Link
            href="/signup"
            className="border border-muted/40 rounded-full px-6 py-2 text-sm font-medium hover:border-white"
          >
            Sign up
          </Link>
        </div>
      </div>
    </main>
  );
}
