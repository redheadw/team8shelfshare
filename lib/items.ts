import "server-only";

import { sql } from "@/lib/db";
import type { Category, CreateItemData, Item } from "@/lib/types";

export async function getItemsByOwner(ownerId: string,): Promise<Item[]> {
  const items = await sql`
    SELECT
      id,
      owner_id AS "ownerId",
      category_id AS "categoryId",
      title,
      description,
      condition,
      image_url AS "imageUrl",
      is_available AS "isAvailable",
      deleted_at AS "deletedAt",
      created_at AS "createdAt",
      updated_at AS "updatedAt"
    FROM items
    WHERE owner_id = ${ownerId}
      AND deleted_at IS NULL
    ORDER BY created_at DESC
  `;

  return items as Item[];
}

export async function getItemById(id: string): Promise<Item | null> {
  const items = await sql`
    SELECT
      id,
      owner_id AS "ownerId",
      category_id AS "categoryId",
      title,
      description,
      condition,
      image_url AS "imageUrl",
      is_available AS "isAvailable",
      deleted_at AS "deletedAt",
      created_at AS "createdAt",
      updated_at AS "updatedAt"
    FROM items
    WHERE id = ${id}
      AND deleted_at IS NULL
    LIMIT 1
  `;

  if (items.length === 0) {
    return null;
  }

  return items[0] as Item;
}

export async function getCategories(): Promise<Category[]> {
  const categories = await sql`
    SELECT
      id,
      name,
      description
    FROM categories
    ORDER BY name ASC
  `;

  return categories as Category[];
}


export async function createItem(
  ownerId: string,
  data: CreateItemData,
): Promise<Item> {
  const items = await sql`
    INSERT INTO items (
      owner_id,
      category_id,
      title,
      description,
      condition,
      image_url,
      is_available
    )
    VALUES (
      ${ownerId},
      ${data.categoryId},
      ${data.title},
      ${data.description},
      ${data.condition},
      ${data.imageUrl},
      ${data.isAvailable}
    )
    RETURNING
      id,
      owner_id AS "ownerId",
      category_id AS "categoryId",
      title,
      description,
      condition,
      image_url AS "imageUrl",
      is_available AS "isAvailable",
      deleted_at AS "deletedAt",
      created_at AS "createdAt",
      updated_at AS "updatedAt"
  `;

  return items[0] as Item;
}

export async function updateItem(
  id: string,
  ownerId: string,
  data: CreateItemData,
): Promise<Item | null> {
  const items = await sql`
    UPDATE items
    SET
      category_id = ${data.categoryId},
      title = ${data.title},
      description = ${data.description},
      condition = ${data.condition},
      image_url = ${data.imageUrl},
      is_available = ${data.isAvailable},
      updated_at = NOW()
    WHERE id = ${id}
      AND owner_id = ${ownerId}
      AND deleted_at IS NULL
    RETURNING
      id,
      owner_id AS "ownerId",
      category_id AS "categoryId",
      title,
      description,
      condition,
      image_url AS "imageUrl",
      is_available AS "isAvailable",
      deleted_at AS "deletedAt",
      created_at AS "createdAt",
      updated_at AS "updatedAt"
  `;

  if (items.length === 0) {
    return null;
  }

  return items[0] as Item;
}

export async function deleteItem(
  id: string,
  ownerId: string,
): Promise<boolean> {
  const items = await sql`
    UPDATE items
    SET
      deleted_at = NOW(),
      updated_at = NOW()
    WHERE id = ${id}
      AND owner_id = ${ownerId}
      AND deleted_at IS NULL
    RETURNING id
  `;

  return items.length > 0;
}

export async function getFilteredItems(
  query: string = "",
  categoryId: number | null = null,
  availability: boolean | null = null,
): Promise<Item[]> {
  const searchTerm = `%${query.trim()}%`;

  const items = await sql`
    SELECT
      id,
      owner_id AS "ownerId",
      category_id AS "categoryId",
      title,
      description,
      condition,
      image_url AS "imageUrl",
      is_available AS "isAvailable",
      deleted_at AS "deletedAt",
      created_at AS "createdAt",
      updated_at AS "updatedAt"
    FROM items
    WHERE deleted_at IS NULL
      AND (
        title ILIKE ${searchTerm}
        OR description ILIKE ${searchTerm}
      )
      AND (
        ${categoryId}::integer IS NULL
        OR category_id = ${categoryId}::integer
      )
      AND (
        ${availability}::boolean IS NULL
        OR is_available = ${availability}::boolean
      )
    ORDER BY created_at DESC
  `;

  return items as Item[];
}
