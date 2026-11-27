"use server";

import { auth } from "@/auth";
import { createItem, updateItem, deleteItem, getItemById } from "@/lib/items";
import type { CreateItemData, ItemCondition } from "@/lib/types";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { deleteListingImage } from "@/lib/blob";

export async function createListing(formData: FormData) {
  // Verify that the resident is signed in.
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }
  // Read and validate the listing title.
  const titleValue = formData.get("title");

  if (typeof titleValue !== "string") {
    throw new Error("Invalid listing title.");
  }

  const title = titleValue.trim();

  if (title.length === 0 || title.length > 150) {
    throw new Error("The title must be between 1 and 150 characters.");
  }

  // Read and validate the category.
  const categoryValue = formData.get("categoryId");

  const categoryId = Number(categoryValue);

  if (!Number.isInteger(categoryId) || categoryId <= 0) {
    throw new Error("Please select a valid category.");
  }

  // Read and validate the description.
  const descriptionValue = formData.get("description");

  if (descriptionValue !== null && typeof descriptionValue !== "string") {
    throw new Error("Invalid listing description.");
  }

  const description = descriptionValue?.trim() || null;

  if (description && description.length > 2000) {
    throw new Error("The description must be 2000 characters or fewer.");
  }

  // Read and validate the item condition.
  const conditionValue = formData.get("condition");

  const validConditions: ItemCondition[] = ["new", "good", "fair", "worn"];

  if (
    typeof conditionValue !== "string" ||
    !validConditions.includes(conditionValue as ItemCondition)
  ) {
    throw new Error("Please select a valid item condition.");
  }

  const condition = conditionValue as ItemCondition;

  // Read and validate the image URL.
  const imageUrlValue = formData.get("imageUrl");

  if (typeof imageUrlValue !== "string" || imageUrlValue.trim() === "") {
    throw new Error("Please upload an image for your listing.");
  }

  const imageUrl = imageUrlValue.trim();

  try {
    const parsedUrl = new URL(imageUrl);

    if (parsedUrl.protocol !== "http:" && parsedUrl.protocol !== "https:") {
      throw new Error("Invalid image URL protocol.");
    }
  } catch {
    throw new Error("Please provide a valid image URL.");
  }

  // Read the item's availability.
  const isAvailableValue = formData.get("isAvailable");

  const isAvailable = isAvailableValue === "true";

  // Prepare the listing data.
  const itemData: CreateItemData = {
    title,
    categoryId,
    description,
    condition,
    imageUrl,
    isAvailable,
  };

  // Save the listing in the database.
  await createItem(session.user.id, itemData);

  // Refresh the listing pages.
  revalidatePath("/dashboard/lending");
  revalidatePath("/items");

  // Redirect to the listings page.
  redirect("/dashboard/lending");
}

export async function updateListing(id: string, formData: FormData) {
  // Verify that the resident is signed in.
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  // Get the current listing and verify ownership.
  const currentItem = await getItemById(id);

  if (!currentItem || currentItem.ownerId !== session.user.id) {
    throw new Error(
      "Listing not found or you do not have permission to edit it.",
    );
  }

  // Read and validate the listing title.
  const titleValue = formData.get("title");

  if (typeof titleValue !== "string") {
    throw new Error("Invalid listing title.");
  }

  const title = titleValue.trim();

  if (title.length === 0 || title.length > 150) {
    throw new Error("The title must be between 1 and 150 characters.");
  }

  // Read and validate the category.
  const categoryValue = formData.get("categoryId");

  const categoryId = Number(categoryValue);

  if (!Number.isInteger(categoryId) || categoryId <= 0) {
    throw new Error("Please select a valid category.");
  }

  // Read and validate the description.
  const descriptionValue = formData.get("description");

  if (descriptionValue !== null && typeof descriptionValue !== "string") {
    throw new Error("Invalid listing description.");
  }

  const description = descriptionValue?.trim() || null;

  if (description && description.length > 2000) {
    throw new Error("The description must be 2000 characters or fewer.");
  }

  // Read and validate the item condition.
  const conditionValue = formData.get("condition");

  const validConditions: ItemCondition[] = ["new", "good", "fair", "worn"];

  if (
    typeof conditionValue !== "string" ||
    !validConditions.includes(conditionValue as ItemCondition)
  ) {
    throw new Error("Please select a valid item condition.");
  }

  const condition = conditionValue as ItemCondition;

  // Read and validate the image URL.
  const imageUrlValue = formData.get("imageUrl");

  if (imageUrlValue !== null && typeof imageUrlValue !== "string") {
    throw new Error("Invalid image URL.");
  }

  const imageUrl =
    imageUrlValue === null
      ? currentItem.imageUrl
      : imageUrlValue.trim() || null;

  if (imageUrl) {
    try {
      const parsedUrl = new URL(imageUrl);

      if (parsedUrl.protocol !== "http:" && parsedUrl.protocol !== "https:") {
        throw new Error("Invalid image URL protocol.");
      }
    } catch {
      throw new Error("Please provide a valid image URL.");
    }
  }

  // Read the item's availability.
  const isAvailableValue = formData.get("isAvailable");

  const isAvailable = isAvailableValue === "true";

  // Prepare the updated listing data.
  const itemData: CreateItemData = {
    title,
    categoryId,
    description,
    condition,
    imageUrl,
    isAvailable,
  };

  // Update the listing in the database.
  const updatedItem = await updateItem(id, session.user.id, itemData);

  if (!updatedItem) {
    throw new Error(
      "Listing not found or you do not have permission to edit it.",
    );
  }

  // Delete the previous image if it was replaced or removed.
  if (currentItem.imageUrl && currentItem.imageUrl !== updatedItem.imageUrl) {
    try {
      await deleteListingImage(currentItem.imageUrl);
    } catch (error) {
      console.error("Unable to delete the previous listing image:", error);
    }
  }

  // Refresh the listing pages.
  revalidatePath("/dashboard/lending");
  revalidatePath(`/dashboard/lending/${id}/edit`);
  revalidatePath("/items");
  revalidatePath(`/items/${id}`);

  // Redirect to the listings page.
  redirect("/dashboard/lending");
}

export async function deleteListing(id: string) {
  // Verify that the resident is signed in.
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  // Get the current listing and verify ownership.
  const currentItem = await getItemById(id);

  if (!currentItem || currentItem.ownerId !== session.user.id) {
    throw new Error(
      "Listing not found or you do not have permission to delete it.",
    );
  }

  // Soft-delete the listing from the database.
  const deleted = await deleteItem(id, session.user.id);

  if (!deleted) {
    throw new Error(
      "Listing not found or you do not have permission to delete it.",
    );
  }

  // Delete the listing image from Blob.
  if (currentItem.imageUrl) {
    try {
      await deleteListingImage(currentItem.imageUrl);
    } catch (error) {
      console.error("Unable to delete the listing image:", error);
    }
  }

  // Refresh the listing pages.
  revalidatePath("/dashboard/lending");
  revalidatePath("/items");

  // Redirect to the listings page.
  redirect("/dashboard/lending");
}
