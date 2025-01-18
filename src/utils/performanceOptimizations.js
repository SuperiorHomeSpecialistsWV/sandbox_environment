// src/utils/performanceOptimizations.js
import { useMemo, useCallback } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';

// Memoized warranty calculations
export const useWarrantyCalculations = (products) => {
    return useMemo(() => {
        // Implement complex warranty calculations here
        return products.map(product => ({
            ...product,
            warrantyStatus: calculateWarrantyStatus(product),
        }));
    }, [products]);
};

// Virtualized list component for large datasets
export const VirtualizedList = ({ items, rowHeight, renderItem }) => {
    const parentRef = useRef(null);

    const virtualizer = useVirtualizer({
        count: items.length,
        getScrollElement: () => parentRef.current,
        estimateSize: () => rowHeight,
    });

    return (
        <div ref={parentRef} style={{ height: '100vh', overflow: 'auto' }}>
            <div
                style={{
                    height: `${virtualizer.getTotalSize()}px`,
                    width: '100%',
                    position: 'relative',
                }}
            >
                {virtualizer.getVirtualItems().map((virtualItem) => (
                    <div
                        key={virtualItem.key}
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: `${rowHeight}px`,
                            transform: `translateY(${virtualItem.start}px)`,
                        }}
                    >
                        {renderItem(items[virtualItem.index])}
                    </div>
                ))}
            </div>
        </div>
    );
};

// Optimized chart rendering
export const OptimizedChart = ({ data, width, height }) => {
    const memoizedData = useMemo(() => processChartData(data), [data]);

    return (
        <ResponsiveContainer width={width} height={height}>
            <LineChart
                data={memoizedData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
                {/* Chart components */}
            </LineChart>
        </ResponsiveContainer>
    );
};

// Mock API call optimization
export const createMockAPIHandler = (mockData, latency = 100) => {
    const cache = new Map();

    return async (endpoint, params) => {
        const cacheKey = JSON.stringify({ endpoint, params });

        if (cache.has(cacheKey)) {
            return cache.get(cacheKey);
        }

        await new Promise(resolve => setTimeout(resolve, latency));
        const result = mockData[endpoint]?.(params);
        cache.set(cacheKey, result);

        return result;
    };
};