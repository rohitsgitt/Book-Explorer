import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Response Error:', error);

    if (error.response?.status === 404) {
      throw new Error('Resource not found');
    } else if (error.response?.status === 500) {
      throw new Error('Server error. Please try again later.');
    } else if (error.code === 'ECONNABORTED') {
      throw new Error('Request timeout. Please check your connection.');
    } else if (!error.response) {
      throw new Error('Network error. Please check your connection.');
    }

    throw error;
  }
);

// API methods
export const bookApi = {
  // Get paginated books with filters
  getBooks: async (params = {}) => {
    try {
      const response = await api.get('/api/books', { params });
      return response.data;
    } catch (error) {
      throw new Error(error.message || 'Failed to fetch books');
    }
  },

  // Get single book by ID
  getBookById: async (id) => {
    try {
      const response = await api.get(`/api/books/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.message || 'Failed to fetch book details');
    }
  },

  // Get database statistics
  getStats: async () => {
    try {
      const response = await api.get('/api/books/stats/summary');
      return response.data;
    } catch (error) {
      throw new Error(error.message || 'Failed to fetch statistics');
    }
  },

  // Trigger fresh scraping
  refreshData: async () => {
    try {
      const response = await api.post('/api/books/refresh');
      return response.data;
    } catch (error) {
      throw new Error(error.message || 'Failed to trigger data refresh');
    }
  },

  // Health check
  healthCheck: async () => {
    try {
      const response = await api.get('/health');
      return response.data;
    } catch (error) {
      throw new Error(error.message || 'Failed to check server health');
    }
  }
};

// Helper function to build query parameters
export const buildQueryParams = (filters) => {
  const params = {};

  // Pagination
  if (filters.page) params.page = filters.page;
  if (filters.limit) params.limit = filters.limit;

  // Search
  if (filters.search?.trim()) params.search = filters.search.trim();

  // Rating filter
  if (filters.minRating !== undefined && filters.minRating !== '') {
    params.minRating = filters.minRating;
  }
  if (filters.maxRating !== undefined && filters.maxRating !== '') {
    params.maxRating = filters.maxRating;
  }

  // Price filter
  if (filters.minPrice !== undefined && filters.minPrice !== '') {
    params.minPrice = filters.minPrice;
  }
  if (filters.maxPrice !== undefined && filters.maxPrice !== '') {
    params.maxPrice = filters.maxPrice;
  }

  // Stock filter
  if (filters.inStock !== undefined && filters.inStock !== '') {
    params.inStock = filters.inStock;
  }

  // Sorting
  if (filters.sortBy) params.sortBy = filters.sortBy;
  if (filters.sortOrder) params.sortOrder = filters.sortOrder;

  return params;
};

// Export the axios instance for custom requests
export default api;
