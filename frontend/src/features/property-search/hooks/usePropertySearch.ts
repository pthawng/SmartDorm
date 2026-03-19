import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { propertySearchApi, SearchFilters } from '../api/propertySearchApi';
import { useDebounce } from '@/shared/hooks/use-debounce';

/**
 * High-fidelity hook for managing property search experience.
 * Orchestrates results, filters, and loading states.
 */
export function usePropertySearch() {
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<SearchFilters>({
    city: '',
    priceRange: [0, 10000000],
    status: ''
  });

  const debouncedQuery = useDebounce(query, 400);

  const isDefault = useMemo(() => {
    return !debouncedQuery && !filters.city && filters.priceRange?.[0] === 0 && filters.priceRange?.[1] === 10000000;
  }, [debouncedQuery, filters]);

  const { data: properties = [], isLoading } = useQuery({
    queryKey: ['properties', debouncedQuery, filters, isDefault],
    queryFn: () => propertySearchApi.getProperties({
      query: debouncedQuery,
      featured: isDefault,
      city: filters.city,
      priceMin: filters.priceRange?.[0],
      priceMax: filters.priceRange?.[1]
    })
  });

  const isEmpty = !isLoading && properties.length === 0;

  const handleCityChange = (city: string) => {
    setFilters(prev => ({ ...prev, city }));
  };

  const handlePriceChange = (range: [number, number]) => {
    setFilters(prev => ({ ...prev, priceRange: range }));
  };

  const resetFilters = () => {
    setQuery('');
    setFilters({ city: '', priceRange: [0, 10000000], status: '' });
  };

  return {
    query,
    setQuery,
    filters,
    handleCityChange,
    handlePriceChange,
    properties,
    isLoading,
    isEmpty,
    isDefault,
    resetFilters
  };
}
