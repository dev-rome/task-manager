import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import SignupForm from "@/components/SignupForm";

export default async function SignupPage() {
  const user = await getCurrentUser();
  if (user) redirect("/board");

  return (
    <main className="flex min-h-screen items-center justify-center bg-board text-ink px-4">
      <div className="w-full max-w-sm p-8 bg-surface rounded-lg">
        <h1 className="text-2xl font-medium mb-6">Create account</h1>
        <SignupForm />
        <p className="text-sm text-muted mt-4">
          Already have an account?{" "}
          <Link href="/login" className="text-accent">
            Log in
          </Link>
        </p>
      </div>
    </main>
  );
}
