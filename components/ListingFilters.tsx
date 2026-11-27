"use client";

import {
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import type { Category } from "@/lib/types";

interface ListingFiltersProps {
  categories: Category[];
}

export default function ListingFilters({
  categories,
}: ListingFiltersProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  function handleFilter(name: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());

    if (value) {
      params.set(name, value);
    } else {
      params.delete(name);
    }

    const queryString = params.toString();

    replace(
      queryString ? `${pathname}?${queryString}` : pathname
    );
  }

  return (
    <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div>
        <label
          htmlFor="category-filter"
          className="mb-2 block text-sm font-medium text-gray-700"
        >
          Category
        </label>

        <select
          id="category-filter"
          value={searchParams.get("category") ?? ""}
          onChange={(event) =>
            handleFilter("category", event.target.value)
          }
          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 focus:border-green-600 focus:outline-none focus:ring-2 focus:ring-green-200"
        >
          <option value="">All Categories</option>

          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label
          htmlFor="availability-filter"
          className="mb-2 block text-sm font-medium text-gray-700"
        >
          Availability
        </label>

        <select
          id="availability-filter"
          value={searchParams.get("availability") ?? ""}
          onChange={(event) =>
            handleFilter("availability", event.target.value)
          }
          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 focus:border-green-600 focus:outline-none focus:ring-2 focus:ring-green-200"
        >
          <option value="">All Items</option>
          <option value="available">Available</option>
          <option value="unavailable">Unavailable</option>
        </select>
      </div>
    </div>
  );
}