import apiClient from '../api/apiClient';
import { API_ENDPOINTS } from '../config/api';

class CategoryService {
  /**
   * Fetches all active categories
   * @returns {Promise<Array>} - List of categories
   */
  async getCategories() {
    const response = await apiClient.get(API_ENDPOINTS.CATEGORIES);
    return response.data;
  }

  /**
   * Fetches a single category by its slug
   * @param {string} slug - Category slug
   * @returns {Promise<Object>} - Category detail object
   */
  async getCategory(slug) {
    const response = await apiClient.get(`${API_ENDPOINTS.CATEGORIES}${slug}/`);
    return response.data;
  }
}

export const categoryService = new CategoryService();
