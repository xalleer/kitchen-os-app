import apiClient from '@/config/api';
import {
    ShoppingListResponse,
    GenerateShoppingListDto,
    AddManualItemDto,
    UpdateShoppingItemDto,
    MarkAsBoughtDto,
    CompletedShopping,
    ShoppingListItem
} from '@/types/shopping-list';

class ShoppingListService {
    async getShoppingList(): Promise<ShoppingListResponse> {
        const response = await apiClient.get<ShoppingListResponse>('/shopping-list');
        return response.data;
    }

    async generateShoppingList(data?: GenerateShoppingListDto): Promise<ShoppingListResponse> {
        const response = await apiClient.post<ShoppingListResponse>(
            '/shopping-list/generate',
            data
        );
        return response.data;
    }

    async addManualItem(data: AddManualItemDto): Promise<ShoppingListItem> {
        const response = await apiClient.post<ShoppingListItem>(
            '/shopping-list/manual',
            data
        );
        return response.data;
    }

    async updateShoppingItem(
        itemId: string,
        data: UpdateShoppingItemDto
    ): Promise<ShoppingListItem> {
        const response = await apiClient.patch<ShoppingListItem>(
            `/shopping-list/${itemId}`,
            data
        );
        return response.data;
    }

    async markAsBought(
        itemId: string,
        data: MarkAsBoughtDto
    ): Promise<ShoppingListItem> {
        const response = await apiClient.post<ShoppingListItem>(
            `/shopping-list/${itemId}/mark-bought`,
            data
        );
        return response.data;
    }

    async deleteShoppingItem(itemId: string): Promise<{ message: string }> {
        const response = await apiClient.delete(`/shopping-list/${itemId}`);
        return response.data;
    }

    async completeShopping(): Promise<CompletedShopping> {
        const response = await apiClient.post<CompletedShopping>(
            '/shopping-list/complete'
        );
        return response.data;
    }

    async clearShoppingList(): Promise<{ message: string }> {
        const response = await apiClient.delete('/shopping-list');
        return response.data;
    }

    async getBudgetSummary(startDate?: string, endDate?: string): Promise<any> {
        const params = new URLSearchParams();
        if (startDate) params.append('startDate', startDate);
        if (endDate) params.append('endDate', endDate);

        const response = await apiClient.get(
            `/shopping-list/budget?${params.toString()}`
        );
        return response.data;
    }
}

export default new ShoppingListService();
