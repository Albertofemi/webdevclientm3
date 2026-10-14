// Endpoint paths for TheMealDB. Fetching itself happens in the useFetch hook.
export const BASE = 'https://www.themealdb.com/api/json/v1/1';

export const paths = {
  categories: 'categories.php',
  search: (query) => `search.php?s=${encodeURIComponent(query)}`,
  byCategory: (category) => `filter.php?c=${encodeURIComponent(category)}`,
  meal: (id) => `lookup.php?i=${encodeURIComponent(id)}`,
};
