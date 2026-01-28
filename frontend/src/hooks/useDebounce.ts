/**
 * useDebounce Hook
 * 
 * Delays updating a value until after a specified delay since the last change.
 * Perfect for search inputs to avoid excessive API calls.
 * 
 * @param value - The value to debounce
 * @param delay - Delay in milliseconds (default: 500ms)
 * @returns The debounced value
 * 
 * @example
 * const [searchTerm, setSearchTerm] = useState('');
 * const debouncedSearch = useDebounce(searchTerm, 500);
 * 
 * // Use debouncedSearch in API calls instead of searchTerm
 */

import { useEffect, useState } from 'react';

export function useDebounce<T>(value: T, delay: number = 500): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        // Set a timer to update the debounced value after the delay
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        // Clear the timeout if value changes before delay expires
        // This is the cleanup function that runs on every re-render
        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]); // Only re-run if value or delay changes

    return debouncedValue;
}
