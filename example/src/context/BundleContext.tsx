import { createContext, useContext, type ReactNode } from "react";
import type {
  Document,
  HighlightResponseTypeWithComments,
  User,
} from "../utils/dbUtils";

interface BundleContextType {
  documents: Document[];
  highlightsWithComments: HighlightResponseTypeWithComments[];
  users: User[];
}

const BundleContext = createContext<BundleContextType | undefined>(undefined);

type Props = {
  children: ReactNode;
  documents: Document[];
  highlights: HighlightResponseTypeWithComments[];
  users: User[];
};

export function BundleProvider({
  children,
  documents,
  highlights,
  users,
}: Props) {
  return (
    <BundleContext.Provider
      value={{ documents, highlightsWithComments: highlights, users }}
    >
      {children}
    </BundleContext.Provider>
  );
}

export function useBundleContext() {
  const context = useContext(BundleContext);
  if (context === undefined) {
    throw new Error("useBundleContext must be used within a BundleProvider");
  }
  return context;
}
