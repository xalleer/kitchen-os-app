import apiClient from '@/config/api';
import { Allergy } from '@/types/dictionaries';

class DictionaryService {
    async getAllergies(): Promise<Allergy[]> {
        const response = await apiClient.get<Allergy[]>('/dictionaries/allergies');
        return response.data;
    }
}

export default new DictionaryService();