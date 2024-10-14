import { useState, useEffect } from "react";
import "./Toast.css";

// User api
export type Toast = {
  message: string;
  type: "info" | "success" | "warning" | "error";
  duration: number;
};

// Private type
type IdToast = Toast & {
  id: number;
};

interface Toaster {
  toasts: IdToast[];
  removeToast: (id: number) => void;
}

const useToast = () => {
  const [toasts, setToasts] = useState<IdToast[]>([]);

  // Add a new toast notification
  const addToast = (toast: Toast) => {
    const id = Date.now();
    setToasts([...toasts, { ...toast, id }]);
  };

  // Remove toast by id, we internally manage the id
  const removeToast = (id: number) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  };

  return { toasts, addToast, removeToast };
};

// Toast component
const Toast: React.FC<IdToast & { removeToast: (id: number) => void }> = ({
  id,
  removeToast,
  message,
  type,
  duration,
}) => {
  const [isLeaving, setIsLeaving] = useState(false);
  const handleRemoveToast = () => {
    // Show CSS animation leaving
    setIsLeaving(true);

    // Finally unrender component after leave animation finishes
    //  this is 0.3 seconds in Toast.css .toast-leaving
    setTimeout(() => {
      removeToast(id);
    }, 500);
  };

  useEffect(() => {
    setTimeout(() => {
      handleRemoveToast();
    }, duration);
  });

  return (
    <div className="toast">
      <div
        className={`toast toast-${type} ${isLeaving ? "toast-leaving" : ""}`}
      >
        <button className="toast-close-button" onClick={() => removeToast(id)}>
          x
        </button>
        <p>{message}</p>
      </div>
      <p></p>
    </div>
  );
};

// ToastContainer component to manage multiple toasts
const Toaster: React.FC<Toaster> = ({ toasts, removeToast }) => {
  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} removeToast={removeToast} />
      ))}
    </div>
  );
};

export { Toaster, useToast };
