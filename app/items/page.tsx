import { Suspense } from "react";
import { getFilteredItems, getCategories } from "@/lib/items";
import ListingCard from "@/components/ListingCard";
import ListingSearch from "@/components/ListingSearch";
import ListingFilters from "@/components/ListingFilters";

interface ListingsPageProps {
  searchParams: Promise<{
    query?: string | string[];
    category?: string | string[];
    availability?: string | string[];
  }>;
}

async function FiltersContent() {
  const categories = await getCategories();

  return <ListingFilters categories={categories} />;
}

async function ListingsContent({
  searchParams,
}: ListingsPageProps) {
  const params = await searchParams;

  const query =
    typeof params.query === "string" ? params.query : "";

  const parsedCategory =
    typeof params.category === "string"
      ? Number(params.category)
      : NaN;

  const categoryId =
    Number.isInteger(parsedCategory) &&
    parsedCategory > 0 &&
    parsedCategory <= 2147483647
      ? parsedCategory
      : null;

  const availability =
    params.availability === "available"
      ? true
      : params.availability === "unavailable"
        ? false
        : null;

  const items = await getFilteredItems(
    query,
    categoryId,
    availability
  );

  if (items.length === 0) {
    return (
      <p className="py-10 text-center text-gray-600">
        No listings match your search.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,240px),1fr))] gap-6">
      {items.map((item) => (
        <ListingCard key={item.id} item={item} />
      ))}
    </div>
  );
}

export default function ListingsPage({
  searchParams,
}: ListingsPageProps) {
  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-2 text-3xl font-bold text-gray-900">
        Browse Listings
      </h1>

      <p className="mb-8 text-gray-600">
        Discover items available to borrow in your community.
      </p>

      <Suspense fallback={<p>Loading search...</p>}>
        <ListingSearch />
      </Suspense>

      <Suspense fallback={<p>Loading filters...</p>}>
        <FiltersContent />
      </Suspense>

      <Suspense fallback={<p>Loading listings...</p>}>
        <ListingsContent searchParams={searchParams} />
      </Suspense>
    </main>
  );
}