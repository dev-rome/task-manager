import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import LoginForm from "@/components/LoginForm";

export default async function LoginPage() {
  const user = await getCurrentUser();
  if (user) redirect("/board");

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#20212c] text-white px-4">
      <div className="w-full max-w-sm p-8 bg-[#2B2C37] rounded-lg">
        <h1 className="text-2xl font-medium mb-6">Sign in</h1>
        <LoginForm />
      </div>
    </main>
  );
}
