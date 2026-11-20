
import { Suspense } from "react";
import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";

type LoginPageProps = {
  searchParams: Promise<{ error?: string }>;
};

// Login form reads the URL parameters inside Suspense.
async function LoginForm({ searchParams }: LoginPageProps) {
  const { error } = await searchParams;

  async function login(formData: FormData) {
    "use server";

    try {
      await signIn("credentials", {
        email: formData.get("email"),
        password: formData.get("password"),
        redirectTo: "/profile",
      });
    } catch (error) {
      if (error instanceof AuthError) {
        redirect("/login?error=invalid");
      }

      throw error;
    }
  }

  return (
    <main className="mx-auto max-w-md px-6 py-12">
      <h1 className="text-3xl font-bold text-green-700">
        Welcome to ShelfShare
      </h1>

      <p className="mt-3 text-gray-600">
        Sign in to share and borrow items in Lake Valley.
      </p>

      <form action={login} className="mt-8 space-y-5">
        <div>
          <label htmlFor="email" className="block font-medium">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            className="mt-2 w-full rounded-lg border p-3"
          />
        </div>

        <div>
          <label htmlFor="password" className="block font-medium">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            className="mt-2 w-full rounded-lg border p-3"
          />
        </div>

        {error && (
          <p role="alert" className="text-red-600">
            Invalid email or password.
          </p>
        )}

        <button
          type="submit"
          className="w-full rounded-lg bg-green-700 p-3 font-semibold text-white hover:bg-green-800"
        >
          Sign In
        </button>
      </form>

      <p className="mt-6 text-center">
        New to ShelfShare?{" "}
        <a
          href="/register"
          className="font-semibold text-green-700 underline"
        >
          Create an account
        </a>
      </p>
    </main>
  );
}

// Suspense allows Next.js to handle dynamic search parameters.
export default function LoginPage({
  searchParams,
}: LoginPageProps) {
  return (
    <Suspense
      fallback={
        <p className="p-8">Loading login...</p>
      }
    >
      <LoginForm searchParams={searchParams} />
    </Suspense>
  );
}
