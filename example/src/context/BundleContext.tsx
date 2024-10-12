import { createContext, useContext, type ReactNode } from 'react';
import type { BundleWithDocuments } from '../utils/dbUtils';

interface BundleContextType {
    bundlesWithDocuments: BundleWithDocuments[];
}

const BundleContext = createContext<BundleContextType | undefined>(undefined);

export function BundleProvider({ children, bundlesWithDocuments }: { children: ReactNode; bundlesWithDocuments: BundleWithDocuments[] }) {
    return (
        <BundleContext.Provider value={{ bundlesWithDocuments }}>
            {children}
        </BundleContext.Provider>
    );
}

export function useBundleContext() {
    const context = useContext(BundleContext);
    if (context === undefined) {
        throw new Error('useBundleContext must be used within a BundleProvider');
    }
    return context;
}
