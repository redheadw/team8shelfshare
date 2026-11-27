import { Suspense } from "react";
import Link from "next/link";
import { auth } from "@/auth";
import { redirect, notFound } from "next/navigation";
import { connection } from "next/server";
import { getCategories, getItemById } from "@/lib/items";
import { updateListing } from "@/app/dashboard/lending/actions";
import ImageUploadField from "@/components/ImageUploadField";

interface EditListingPageProps {
  params: Promise<{ id: string }>;
}

async function EditListingForm({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await connection();

  const { id } = await params;

  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const item = await getItemById(id);

  if (!item || item.ownerId !== session.user.id) {
    notFound();
  }

  const categories = await getCategories();
  const updateListingWithId = updateListing.bind(null, item.id);

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-8">
        <Link
          href="/dashboard/lending"
          className="text-sm font-semibold text-[#047857] hover:text-[#065F46]"
        >
          ← Back to My Listings
        </Link>

        <h1 className="mt-4 text-3xl font-bold text-[#065F46]">Edit Listing</h1>

        <p className="mt-2 text-[#57534E]">
          Update the details of the item you share with your neighbors.
        </p>
      </div>

      <form
        action={updateListingWithId}
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
            defaultValue={item.title}
            className="mt-2 w-full rounded-lg border border-[#E7E5E4] p-3 focus:outline-2 focus:outline-[#047857]"
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
            defaultValue={String(item.categoryId)}
            className="mt-2 w-full rounded-lg border border-[#E7E5E4] bg-white p-3"
          >
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
            defaultValue={item.description ?? ""}
            className="mt-2 w-full rounded-lg border border-[#E7E5E4] p-3"
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
            defaultValue={item.condition}
            className="mt-2 w-full rounded-lg border border-[#E7E5E4] bg-white p-3"
          >
            <option value="new">New</option>
            <option value="good">Good</option>
            <option value="fair">Fair</option>
            <option value="worn">Worn</option>
          </select>
        </div>

        <ImageUploadField
          userId={session.user.id}
          initialImageUrl={item.imageUrl}
        />

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
            defaultValue={String(item.isAvailable)}
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
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}

export default function EditListingPage({ params }: EditListingPageProps) {
  return (
    <main className="min-h-screen bg-[#FAFAF9] px-6 py-10">
      <Suspense
        fallback={
          <p className="mx-auto max-w-2xl p-8 text-[#57534E]">
            Loading form...
          </p>
        }
      >
        <EditListingForm params={params} />
      </Suspense>
    </main>
  );
}
