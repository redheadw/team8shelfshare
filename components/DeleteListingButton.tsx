"use client";

import { useState } from "react";
import { deleteListing } from "@/app/dashboard/lending/actions";

interface DeleteListingButtonProps {
  id: string;
}

export default function DeleteListingButton({ id }: DeleteListingButtonProps) {
  const [isConfirming, setIsConfirming] = useState(false);

  if (isConfirming) {
    return (
      <div className="mt-3 rounded-lg border border-red-200 bg-red-50 p-3">
        <p className="text-sm text-red-800">
          Are you sure you want to delete this listing?
        </p>

        <div className="mt-3 flex gap-2">
          <form action={deleteListing.bind(null, id)}>
            <button
              type="submit"
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
            >
              Confirm delete
            </button>
          </form>

          <button
            type="button"
            onClick={() => setIsConfirming(false)}
            className="rounded-lg border border-[#E7E5E4] px-4 py-2 text-sm font-semibold text-[#57534E] hover:bg-white"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setIsConfirming(true)}
      className="mt-3 rounded-lg border border-red-200 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-50"
    >
      Delete listing
    </button>
  );
}
