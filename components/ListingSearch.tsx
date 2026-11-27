"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function ListingSearch() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  function handleSearch(term: string) {
    const params = new URLSearchParams(searchParams.toString());

    if (term.trim()) {
      params.set("query", term);
    } else {
      params.delete("query");
    }

    replace(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="mb-6">
      <label
        htmlFor="listing-search"
        className="mb-2 block text-sm font-medium text-gray-700"
      >
        Search listings
      </label>

      <input
        id="listing-search"
        type="search"
        placeholder="Search by item name or description..."
        defaultValue={searchParams.get("query") ?? ""}
        onChange={(event) => handleSearch(event.target.value)}
        className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-green-600 focus:outline-none focus:ring-2 focus:ring-green-200"
      />
    </div>
  );
}