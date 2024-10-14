import { createContext, useContext, type ReactNode } from 'react';
import type { Document, HighlightResponseTypeWithComments } from '../utils/dbUtils';

interface BundleContextType {
    documents: Document[];
    highlightsWithComments: HighlightResponseTypeWithComments[];

}

const BundleContext = createContext<BundleContextType | undefined>(undefined);

type Props = { children: ReactNode; documents: Document[]; highlights: HighlightResponseTypeWithComments[] }

export function BundleProvider({ children, documents, highlights }: Props) {
    return (
        <BundleContext.Provider value={{ documents, highlightsWithComments: highlights }}>
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
