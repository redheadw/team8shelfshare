
export default function ProfilePage() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-12">
      <h1 className="text-3xl font-bold text-green-700">
        My ShelfShare Profile
      </h1>

      <p className="mt-3 text-gray-600">
        Manage your Lake Valley community profile.
      </p>

      <div className="mt-8 rounded-xl border p-6 shadow-sm">
        <h2 className="text-xl font-semibold">
          Resident Information
        </h2>

        <p className="mt-2 text-sm text-gray-500">
          Demonstration profile — not yet connected
          to the database.
        </p>

        <form className="mt-6 space-y-5">
          <div>
            <label htmlFor="name" className="block font-medium">
              Full Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              defaultValue="Alex Morgan"
              disabled
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
              defaultValue="alex@example.com"
              disabled
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
              disabled
              className="mt-2 w-full rounded-lg border p-3"
            />
          </div>

          <div>
            <label htmlFor="bio" className="block font-medium">
              About Me
            </label>
            <textarea
              id="bio"
              name="bio"
              rows={4}
              defaultValue="I enjoy sharing tools and helping my neighbors."
              disabled
              className="mt-2 w-full rounded-lg border p-3"
            />
          </div>

          <button
            type="button"
            disabled
            className="w-full cursor-not-allowed rounded-lg bg-green-700 p-3 font-semibold text-white opacity-60"
          >
            Save Profile — Coming Soon
          </button>
        </form>
      </div>
    </main>
  );
}
