import { create } from 'zustand';
import {
    AddToInventoryDto,
    GroupedInventory,
    InventoryItem,
    RemoveFromInventoryDto,
    UpdateInventoryItemDto
} from '@/types/inventory';
import inventoryService from '@/services/inventory.service';

interface InventoryState {
    items: InventoryItem[];
    grouped: GroupedInventory;
    total: number;
    isLoading: boolean;
    error: string | null;

    fetchInventory: () => Promise<void>;
    addItem: (data: AddToInventoryDto) => Promise<void>;
    updateItem: (itemId: string, data: UpdateInventoryItemDto) => Promise<void>;
    removeItem: (itemId: string, quantity: number) => Promise<void>;
    deleteItem: (itemId: string) => Promise<void>;
    clearError: () => void;
    reset: () => void;
}

export const useInventoryStore = create<InventoryState>((set, get) => ({
    items: [],
    grouped: {},
    total: 0,
    isLoading: false,
    error: null,

    fetchInventory: async () => {
        set({ isLoading: true, error: null });
        try {
            const data = await inventoryService.getInventory();
            set({
                items: data.items,
                grouped: data.grouped,
                total: data.total,
                isLoading: false
            });
        } catch (error: any) {
            set({ error: error.message, isLoading: false });
            throw error;
        }
    },

    addItem: async (data) => {
        set({ isLoading: true, error: null });
        try {
            await inventoryService.addToInventory(data);
            await get().fetchInventory();
        } catch (error: any) {
            set({ error: error.message, isLoading: false });
            throw error;
        }
    },

    updateItem: async (itemId, data) => {
        set({ isLoading: true, error: null });
        try {
            await inventoryService.updateInventoryItem(itemId, data);
            await get().fetchInventory();
        } catch (error: any) {
            set({ error: error.message, isLoading: false });
            throw error;
        }
    },

    removeItem: async (itemId, quantity) => {
        set({ isLoading: true, error: null });
        try {
            await inventoryService.removeFromInventory(itemId, { quantity });
            await get().fetchInventory();
        } catch (error: any) {
            set({ error: error.message, isLoading: false });
            throw error;
        }
    },

    deleteItem: async (itemId) => {
        set({ isLoading: true, error: null });
        try {
            await inventoryService.deleteInventoryItem(itemId);
            await get().fetchInventory();
        } catch (error: any) {
            set({ error: error.message, isLoading: false });
            throw error;
        }
    },

    clearError: () => set({ error: null }),

    reset: () => set({
        items: [],
        grouped: {},
        total: 0,
        isLoading: false,
        error: null,
    }),
}));