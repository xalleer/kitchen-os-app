import apiClient from '@/config/api';
import { ShoppingListItem } from '@/types/api';

class ShoppingService {
    async getShoppingList(): Promise<ShoppingListItem[]> {
        const response = await apiClient.get<ShoppingListItem[]>('/shopping-list');
        return response.data;
    }

    async generateShoppingList(): Promise<ShoppingListItem[]> {
        const response = await apiClient.post<ShoppingListItem[]>('/shopping-list/generate');
        return response.data;
    }

    async markAsBought(itemId: string): Promise<{ message: string }> {
        const response = await apiClient.patch(`/shopping-list/${itemId}/buy`);
        return response.data;
    }

    async getShoppingStats(items?: ShoppingListItem[]): Promise<{
        totalItems: number;
        boughtItems: number;
        remainingItems: number;
        totalPrice: number;
        boughtPrice: number;
        remainingPrice: number;
    }> {
        const list = items || await this.getShoppingList();

        const boughtItems = list.filter(item => item.isBought);
        const remainingItems = list.filter(item => !item.isBought);

        const totalPrice = list.reduce((sum, item) => sum + item.estimatedPrice, 0);
        const boughtPrice = boughtItems.reduce((sum, item) => sum + item.estimatedPrice, 0);
        const remainingPrice = remainingItems.reduce((sum, item) => sum + item.estimatedPrice, 0);

        return {
            totalItems: list.length,
            boughtItems: boughtItems.length,
            remainingItems: remainingItems.length,
            totalPrice,
            boughtPrice,
            remainingPrice,
        };
    }

    groupByCategory(items: ShoppingListItem[]): Record<string, ShoppingListItem[]> {
        return items.reduce((acc, item) => {
            const category = item.product?.category || 'Інше';
            if (!acc[category]) acc[category] = [];
            acc[category].push(item);
            return acc;
        }, {} as Record<string, ShoppingListItem[]>);
    }
}

export default new ShoppingService();