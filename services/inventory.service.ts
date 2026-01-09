import apiClient from '@/config/api';
import {
    AddToInventoryDto,
    InventoryItem,
    InventoryResponse,
    RemoveFromInventoryDto,
    UpdateInventoryItemDto
} from '@/types/inventory';

class InventoryService {
    async getInventory(): Promise<InventoryResponse> {
        const response = await apiClient.get<InventoryResponse>('/inventory');
        return response.data;
    }

    async getInventoryItem(itemId: string): Promise<InventoryItem> {
        const response = await apiClient.get<InventoryItem>(`/inventory/${itemId}`);
        return response.data;
    }

    async addToInventory(data: AddToInventoryDto): Promise<InventoryItem> {
        const response = await apiClient.post<InventoryItem>('/inventory', data);
        return response.data;
    }

    async updateInventoryItem(itemId: string, data: UpdateInventoryItemDto): Promise<InventoryItem> {
        const response = await apiClient.patch<InventoryItem>(`/inventory/${itemId}`, data);
        return response.data;
    }

    async removeFromInventory(itemId: string, data: RemoveFromInventoryDto): Promise<any> {
        const response = await apiClient.post(`/inventory/${itemId}/remove`, data);
        return response.data;
    }

    async deleteInventoryItem(itemId: string): Promise<{ message: string }> {
        const response = await apiClient.delete(`/inventory/${itemId}`);
        return response.data;
    }

    async getExpiringProducts(daysAhead: number = 2): Promise<InventoryItem[]> {
        const response = await apiClient.get<InventoryItem[]>(
            `/inventory/expiring?daysAhead=${daysAhead}`
        );
        return response.data;
    }
}

export default new InventoryService();