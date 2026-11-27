import { Suspense } from "react";
import Link from "next/link";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { getCategories } from "@/lib/items";
import { createListing } from "@/app/dashboard/lending/actions";
import ImageUploadField from "@/components/ImageUploadField";

async function NewListingForm() {
  await connection();

  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const categories = await getCategories();

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-8">
        <Link
          href="/dashboard/lending"
          className="text-sm font-semibold text-[#047857] hover:text-[#065F46]"
        >
          ← Back to My Listings
        </Link>

        <h1 className="mt-4 text-3xl font-bold text-[#065F46]">
          Create Listing
        </h1>

        <p className="mt-2 text-[#57534E]">
          Add an item you would like to share with your neighbors.
        </p>
      </div>

      <form
        action={createListing}
        className="space-y-6 rounded-xl border border-[#E7E5E4] bg-white p-6 shadow-sm"
      >
        <div>
          <label htmlFor="title" className="block font-medium text-[#1C1917]">
            Title
          </label>
          <input
            id="title"
            name="title"
            type="text"
            maxLength={150}
            required
            className="mt-2 w-full rounded-lg border border-[#E7E5E4] p-3 focus:outline-2 focus:outline-[#047857]"
            placeholder="Example: Electric drill"
          />
        </div>

        <div>
          <label
            htmlFor="categoryId"
            className="block font-medium text-[#1C1917]"
          >
            Category
          </label>
          <select
            id="categoryId"
            name="categoryId"
            required
            defaultValue=""
            className="mt-2 w-full rounded-lg border border-[#E7E5E4] bg-white p-3"
          >
            <option value="" disabled>
              Select a category
            </option>

            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="description"
            className="block font-medium text-[#1C1917]"
          >
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows={4}
            maxLength={2000}
            className="mt-2 w-full rounded-lg border border-[#E7E5E4] p-3"
            placeholder="Describe your item..."
          />
        </div>

        <div>
          <label
            htmlFor="condition"
            className="block font-medium text-[#1C1917]"
          >
            Condition
          </label>
          <select
            id="condition"
            name="condition"
            required
            defaultValue=""
            className="mt-2 w-full rounded-lg border border-[#E7E5E4] bg-white p-3"
          >
            <option value="" disabled>
              Select the condition
            </option>
            <option value="new">New</option>
            <option value="good">Good</option>
            <option value="fair">Fair</option>
            <option value="worn">Worn</option>
          </select>
        </div>

        <div>
          <ImageUploadField userId={session.user.id} required />
        </div>

        <div>
          <label
            htmlFor="isAvailable"
            className="block font-medium text-[#1C1917]"
          >
            Availability
          </label>
          <select
            id="isAvailable"
            name="isAvailable"
            required
            defaultValue="true"
            className="mt-2 w-full rounded-lg border border-[#E7E5E4] bg-white p-3"
          >
            <option value="true">Available</option>
            <option value="false">Unavailable</option>
          </select>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
          <Link
            href="/dashboard/lending"
            className="rounded-lg border border-[#E7E5E4] px-5 py-3 text-center font-semibold text-[#57534E] hover:bg-[#FAFAF9]"
          >
            Cancel
          </Link>

          <button
            type="submit"
            className="rounded-lg bg-[#047857] px-5 py-3 font-semibold text-white hover:bg-[#065F46]"
          >
            Create Listing
          </button>
        </div>
      </form>
    </div>
  );
}

export default function NewListingPage() {
  return (
    <main className="min-h-screen bg-[#FAFAF9] px-6 py-10">
      <Suspense
        fallback={
          <p className="mx-auto max-w-2xl p-8 text-[#57534E]">
            Loading form...
          </p>
        }
      >
        <NewListingForm />
      </Suspense>
    </main>
  );
}
