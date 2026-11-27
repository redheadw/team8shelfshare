import Image from "next/image";
import type { Item } from "@/lib/types";

interface ListingCardProps {
  item: Item;
}

export default function ListingCard({ item }: ListingCardProps) {
  return (
    <article className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md">
      <div className="relative aspect-[4/3] w-full bg-gray-100">
        {item.imageUrl ? (
          <Image
            src={item.imageUrl}
            alt={item.title}
            fill
            unoptimized
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-contain p-2"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-gray-500">
            No image available
          </div>
        )}
      </div>

      <div className="space-y-3 p-4">
        <h2 className="text-lg font-semibold text-gray-900">
          {item.title}
        </h2>

        <p className="text-sm text-gray-600">
          Condition:{" "}
          <span className="font-medium capitalize">
            {item.condition}
          </span>
        </p>

        <span
          className={`inline-block rounded-full px-3 py-1 text-sm font-medium ${
            item.isAvailable
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {item.isAvailable ? "Available" : "Unavailable"}
        </span>
      </div>
    </article>
  );
}