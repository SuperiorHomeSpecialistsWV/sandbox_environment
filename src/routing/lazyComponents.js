// src/routing/lazyComponents.js
import React, { Suspense } from 'react';

// Lazy load components
const WarrantyCalculator = React.lazy(() => import('../components/warranty-calculator'));
const DataDashboard = React.lazy(() => import('../components/data-dashboard'));
const CustomerInterface = React.lazy(() => import('../components/customer-interface-refined'));
const ServiceWorkflows = React.lazy(() => import('../components/service-workflows'));
const AdvancedIntegrations = React.lazy(() => import('../components/advanced-integrations'));

// Loading fallback component
const LoadingFallback = () => (
    <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
    </div>
);

// HOC for lazy loading
export const withLazyLoading = (Component) => (props) => (
    <Suspense fallback={<LoadingFallback />}>
        <Component {...props} />
    </Suspense>
);

export {
    WarrantyCalculator,
    DataDashboard,
    CustomerInterface,
    ServiceWorkflows,
    AdvancedIntegrations,
    LoadingFallback
};