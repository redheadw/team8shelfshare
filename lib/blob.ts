import "server-only";

import { del } from "@vercel/blob";

export async function deleteListingImage(imageUrl: string | null) {
  if (!imageUrl) {
    return;
  }

  const blobHostname = process.env.BLOB_HOSTNAME;

  if (!blobHostname) {
    throw new Error("BLOB_HOSTNAME is not configured.");
  }

  const image = new URL(imageUrl);

  if (image.protocol !== "https:" || image.hostname !== blobHostname) {
    throw new Error("Invalid listing image URL.");
  }

  await del(imageUrl);
}
