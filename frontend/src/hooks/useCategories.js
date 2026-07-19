import { useState, useEffect, useCallback } from 'react';
import { categoryService } from '../services/categoryService';

/**
 * Hook to manage fetching categories or a single category
 * @param {string} [slug] - Optional category slug. If provided, fetches a single category. If omitted, fetches all.
 * @returns {Object} - data (array or object), loading, error, and refetch method
 */
export const useCategories = (slug = null) => {
  const [data, setData] = useState(slug ? null : []);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async (catSlug) => {
    setLoading(true);
    setError(null);
    try {
      let response;
      if (catSlug) {
        response = await categoryService.getCategory(catSlug);
      } else {
        response = await categoryService.getCategories();
        // If the backend paginates categories, extract results, otherwise use the array
        if (response && Array.isArray(response.results)) {
            response = response.results;
        }
      }
      setData(response);
    } catch (err) {
      console.error('Failed to fetch categories:', err);
      setError(err.response?.data?.detail || err.message || 'An error occurred while fetching categories.');
      setData(catSlug ? null : []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData(slug);
  }, [slug, fetchData]);

  return {
    [slug ? 'category' : 'categories']: data,
    loading,
    error,
    retry: () => fetchData(slug),
  };
};
