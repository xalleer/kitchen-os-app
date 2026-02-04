import { Unit } from './enums';

export interface ShoppingListProduct {
    id: string;
    name: string;
    category: string | null;
    baseUnit: Unit;
    averagePrice: number | null;
    image: string | null;
}

export interface ShoppingListItem {
    id: string;
    familyId: string;
    productId: string;
    quantity: number;
    isBought: boolean;
    estimatedPrice: number | null;
    actualPrice: number | null;
    boughtAt: string | null;
    manualNote: string | null;
    createdAt: string;
    updatedAt: string;
    product: ShoppingListProduct;
}

export interface ShoppingListSummary {
    totalItems: number;
    boughtItems: number;
    remainingItems: number;
    estimatedCost: number;
    budgetLimit: number;
}

export interface GroupedShoppingList {
    [category: string]: ShoppingListItem[];
}

export interface ShoppingListResponse {
    items: ShoppingListItem[];
    summary: ShoppingListSummary;
    groupedByCategory: GroupedShoppingList;
}

export interface GenerateShoppingListDto {
    startDate?: string;
    endDate?: string;
}

export interface AddManualItemDto {
    productId: string;
    quantity: number;
    note?: string;
}

export interface UpdateShoppingItemDto {
    quantity: number;
    manualNote?: string;
}

export interface MarkAsBoughtDto {
    isBought: boolean;
    actualPrice?: number;
}

export interface CompletedShopping {
    message: string;
    addedToInventory: number;
    products: Array<{
        name: string;
        quantity: number;
        unit: Unit;
        estimatedPrice: number | null;
        actualPrice: number | null;
    }>;
    budget: {
        estimated: number;
        actual: number;
        difference: number;
        savedMoney: boolean;
    };
}
