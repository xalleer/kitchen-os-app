import apiClient from '@/config/api';
import { Unit } from '@/types/enums';

export interface Product {
    id: string;
    name: string;
    category: string | null;
    baseUnit: Unit;
    image?: string;
    caloriesPer100: number | null;
    standardAmount: number | null;
}

export interface GetProductsParams {
    search?: string;
    category?: string;
    baseUnit?: Unit;
    page?: number;
    limit?: number;
}

export interface ProductsResponse {
    products: Product[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

class ProductService {
    async getProducts(params?: GetProductsParams): Promise<ProductsResponse> {
        const queryParams = new URLSearchParams();

        if (params?.search) queryParams.append('search', params.search);
        if (params?.category) queryParams.append('category', params.category);
        if (params?.baseUnit) queryParams.append('baseUnit', params.baseUnit);
        if (params?.page) queryParams.append('page', params.page.toString());
        if (params?.limit) queryParams.append('limit', params.limit.toString());

        const response = await apiClient.get<ProductsResponse>(
            `/products?${queryParams.toString()}`
        );
        return response.data;
    }

    async getProductById(productId: string): Promise<Product> {
        const response = await apiClient.get<Product>(`/products/${productId}`);
        return response.data;
    }

    async getCategories(): Promise<string[]> {
        const response = await apiClient.get<string[]>('/products/categories');
        return response.data;
    }
}

export default new ProductService();