import { Unit } from './enums';

export interface InventoryItem {
    id: string;
    familyId: string;
    productId: string;
    quantity: number;
    expiryDate: string | null;
    createdAt: string;
    updatedAt: string;
    product: {
        id: string;
        name: string;
        category: string | null;
        baseUnit: Unit;
        caloriesPer100: number | null;
    };
}

export interface GroupedInventory {
    [category: string]: InventoryItem[];
}

export interface InventoryResponse {
    items: InventoryItem[];
    grouped: GroupedInventory;
    total: number;
}

export interface AddToInventoryDto {
    productId: string;
    quantity: number;
    expiryDate?: string;
}

export interface UpdateInventoryItemDto {
    quantity?: number;
    expiryDate?: string;
}

export interface RemoveFromInventoryDto {
    quantity: number;
}