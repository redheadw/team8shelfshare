import { Suspense } from "react";
import Link from "next/link";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getCategories, getItemsByOwner } from "@/lib/items";
import { connection } from "next/server";
import DeleteListingButton from "@/components/DeleteListingButton";

// This component loads the signed-in user's listings.
async function LendingContent() {
  await connection();

  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  // Load the user's listings and available categories.
  const [items, categories] = await Promise.all([
    getItemsByOwner(session.user.id),
    getCategories(),
  ]);

  const categoryNames = new Map(
    categories.map((category) => [category.id, category.name]),
  );

  return (
    <div className="mx-auto max-w-5xl">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#065F46]">My Listings</h1>
          <p className="mt-2 text-[#57534E]">
            Manage the items you share with your community.
          </p>
        </div>

        <Link
          href="/dashboard/lending/new"
          className="rounded-lg bg-[#047857] px-5 py-3 text-center font-semibold text-white hover:bg-[#065F46]"
        >
          Create Listing
        </Link>
      </div>

      {items.length === 0 ? (
        <div className="mt-8 rounded-xl border border-[#E7E5E4] bg-white p-8 text-center">
          <h2 className="text-xl font-semibold text-[#1C1917]">
            No listings yet
          </h2>
          <p className="mt-2 text-[#57534E]">
            Start sharing with your neighbors by creating your first listing.
          </p>
        </div>
      ) : (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <article
              key={item.id}
              className="rounded-xl border border-[#E7E5E4] bg-white p-5 shadow-sm"
            >
              {item.imageUrl && (
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="mb-4 h-48 w-full rounded-lg object-cover"
                />
              )}

              <div className="flex items-start justify-between gap-3">
                <h2 className="text-lg font-semibold text-[#1C1917]">
                  {item.title}
                </h2>

                <span
                  className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${
                    item.isAvailable
                      ? "bg-[#ECFDF5] text-[#065F46]"
                      : "bg-stone-100 text-stone-600"
                  }`}
                >
                  {item.isAvailable ? "Available" : "Unavailable"}
                </span>
              </div>

              <p className="mt-3 text-sm text-[#57534E]">
                Category: {categoryNames.get(item.categoryId) ?? "Unknown"}
              </p>

              <p className="mt-1 text-sm text-[#57534E]">
                Condition: {item.condition}
              </p>

              {item.description && (
                <p className="mt-3 text-sm text-[#57534E]">
                  {item.description}
                </p>
              )}

              <div className="mt-5 border-t border-[#E7E5E4] pt-4">
                <Link
                  href={`/dashboard/lending/${item.id}/edit`}
                  className="font-semibold text-[#047857] underline hover:text-[#065F46]"
                >
                  Edit listing
                </Link>

                <DeleteListingButton id={item.id} />
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

// Suspense handles the asynchronous authentication and database queries.
export default function LendingPage() {
  return (
    <main className="min-h-screen bg-[#FAFAF9] px-6 py-10">
      <Suspense
        fallback={
          <p className="mx-auto max-w-5xl p-8 text-[#57534E]">
            Loading your listings...
          </p>
        }
      >
        <LendingContent />
      </Suspense>
    </main>
  );
}
