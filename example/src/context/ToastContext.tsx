import { createContext, useContext, type ReactNode } from "react";
import {
  type Toast,
  Toaster,
  useToast as useToastHook,
} from "../components/Toast";

interface ToastContextType {
  addToast: (toast: Omit<Toast, "id">) => void;
  removeToast: (id: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { toasts, addToast, removeToast } = useToastHook();

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <Toaster toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};
