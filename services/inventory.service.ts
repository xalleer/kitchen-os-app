import apiClient from '@/config/api';
import { AddFridgeItemDto, FridgeItem } from '@/types/api';

class InventoryService {
    async getFridgeItems(): Promise<FridgeItem[]> {
        const response = await apiClient.get<FridgeItem[]>('/inventory');
        return response.data;
    }

    async addFridgeItem(data: AddFridgeItemDto): Promise<FridgeItem> {
        const response = await apiClient.post<FridgeItem>('/inventory', data);
        return response.data;
    }

    async removeFridgeItem(itemId: string): Promise<void> {
        await apiClient.delete(`/inventory/${itemId}`);
    }

    async getExpiringItems(days: number = 3): Promise<FridgeItem[]> {
        const allItems = await this.getFridgeItems();

        const now = new Date();
        const threshold = new Date();
        threshold.setDate(now.getDate() + days);

        return allItems.filter(item => {
            if (!item.expirationDate) return false;
            const expDate = new Date(item.expirationDate);
            return expDate <= threshold && expDate >= now;
        });
    }

    async getFridgeStats(): Promise<{
        totalItems: number;
        expiringItems: number;
        categories: Record<string, number>;
    }> {
        const items = await this.getFridgeItems();
        const expiringItems = await this.getExpiringItems();

        const categories = items.reduce((acc, item) => {
            const category = item.product?.category || 'Other';
            acc[category] = (acc[category] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        return {
            totalItems: items.length,
            expiringItems: expiringItems.length,
            categories,
        };
    }
}

export default new InventoryService();