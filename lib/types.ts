export type ItemCondition = "new" | "good" | "fair" | "worn";

export interface Item {
  id: string;
  ownerId: string;
  categoryId: number;
  title: string;
  description: string | null;
  condition: ItemCondition;
  imageUrl: string | null;
  isAvailable: boolean;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: number;
  name: string;
  description: string | null;
}

export interface CreateItemData {
  title: string;
  categoryId: number;
  description: string | null;
  condition: ItemCondition;
  imageUrl: string | null;
  isAvailable: boolean;
}