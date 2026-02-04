import { create } from 'zustand';
import {
    ShoppingListItem,
    ShoppingListSummary,
    GroupedShoppingList,
    AddManualItemDto,
    UpdateShoppingItemDto,
    MarkAsBoughtDto,
} from '@/types/shopping-list';
import shoppingListService from '@/services/shopping-list.service';

interface ShoppingListState {
    items: ShoppingListItem[];
    summary: ShoppingListSummary | null;
    groupedByCategory: GroupedShoppingList;
    isLoading: boolean;
    isGenerating: boolean;
    error: string | null;

    fetchShoppingList: () => Promise<void>;
    generateShoppingList: (startDate?: string, endDate?: string) => Promise<void>;
    addManualItem: (data: AddManualItemDto) => Promise<void>;
    updateItem: (itemId: string, data: UpdateShoppingItemDto) => Promise<void>;
    markAsBought: (itemId: string, data: MarkAsBoughtDto) => Promise<void>;
    deleteItem: (itemId: string) => Promise<void>;
    completeShopping: () => Promise<void>;
    clearShoppingList: () => Promise<void>;
    clearError: () => void;
    reset: () => void;
}

export const useShoppingListStore = create<ShoppingListState>((set, get) => ({
    items: [],
    summary: null,
    groupedByCategory: {},
    isLoading: false,
    isGenerating: false,
    error: null,

    fetchShoppingList: async () => {
        set({ isLoading: true, error: null });
        try {
            const data = await shoppingListService.getShoppingList();
            set({
                items: data.items,
                summary: data.summary,
                groupedByCategory: data.groupedByCategory,
                isLoading: false,
            });
        } catch (error: any) {
            set({ error: error.message, isLoading: false });
            throw error;
        }
    },

    generateShoppingList: async (startDate?, endDate?) => {
        set({ isGenerating: true, error: null });
        try {
            const data = await shoppingListService.generateShoppingList({
                startDate,
                endDate,
            });
            set({
                items: data.items,
                summary: data.summary,
                groupedByCategory: data.groupedByCategory,
                isGenerating: false,
            });
        } catch (error: any) {
            set({ error: error.message, isGenerating: false });
            throw error;
        }
    },

    addManualItem: async (data) => {
        set({ isLoading: true, error: null });
        try {
            await shoppingListService.addManualItem(data);
            await get().fetchShoppingList();
        } catch (error: any) {
            set({ error: error.message, isLoading: false });
            throw error;
        }
    },

    updateItem: async (itemId, data) => {
        set({ isLoading: true, error: null });
        try {
            await shoppingListService.updateShoppingItem(itemId, data);
            await get().fetchShoppingList();
        } catch (error: any) {
            set({ error: error.message, isLoading: false });
            throw error;
        }
    },

    markAsBought: async (itemId, data) => {
        try {
            await shoppingListService.markAsBought(itemId, data);
            await get().fetchShoppingList();
        } catch (error: any) {
            set({ error: error.message });
            throw error;
        }
    },

    deleteItem: async (itemId) => {
        set({ isLoading: true, error: null });
        try {
            await shoppingListService.deleteShoppingItem(itemId);
            await get().fetchShoppingList();
        } catch (error: any) {
            set({ error: error.message, isLoading: false });
            throw error;
        }
    },

    completeShopping: async () => {
        set({ isLoading: true, error: null });
        try {
            await shoppingListService.completeShopping();
            await get().fetchShoppingList();
        } catch (error: any) {
            set({ error: error.message, isLoading: false });
            throw error;
        }
    },

    clearShoppingList: async () => {
        set({ isLoading: true, error: null });
        try {
            await shoppingListService.clearShoppingList();
            set({
                items: [],
                summary: null,
                groupedByCategory: {},
                isLoading: false,
            });
        } catch (error: any) {
            set({ error: error.message, isLoading: false });
            throw error;
        }
    },

    clearError: () => set({ error: null }),

    reset: () =>
        set({
            items: [],
            summary: null,
            groupedByCategory: {},
            isLoading: false,
            isGenerating: false,
            error: null,
        }),
}));
