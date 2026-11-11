
export default function RegisterPage() {
  return (
    <main className="mx-auto max-w-md px-6 py-12">
      <h1 className="text-3xl font-bold text-green-700">
        Join ShelfShare
      </h1>

      <p className="mt-3 text-gray-600">
        Create an account to share and borrow items
        in Lake Valley.
      </p>

      <form className="mt-8 space-y-5">
        <div>
          <label htmlFor="name" className="block font-medium">
            Full Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            required
            className="mt-2 w-full rounded-lg border p-3"
          />
        </div>

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
            autoComplete="new-password"
            minLength={8}
            required
            className="mt-2 w-full rounded-lg border p-3"
          />
        </div>

        <div>
          <label
            htmlFor="neighborhood"
            className="block font-medium"
          >
            Neighborhood
          </label>
          <input
            id="neighborhood"
            name="neighborhood"
            type="text"
            defaultValue="Lake Valley"
            required
            className="mt-2 w-full rounded-lg border p-3"
          />
        </div>

        <button
          type="button"
          disabled
          className="w-full cursor-not-allowed rounded-lg bg-green-700 p-3 font-semibold text-white opacity-60"
        >
          Registration Coming Soon
        </button>
      </form>

      <p className="mt-6 text-center">
        Already have an account?{" "}
        <a
          href="/login"
          className="font-semibold text-green-700 underline"
        >
          Sign In
        </a>
      </p>
    </main>
  );
}
