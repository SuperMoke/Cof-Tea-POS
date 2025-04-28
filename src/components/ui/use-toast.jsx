// This is a simplified version - you might want to use a proper toast library like react-hot-toast or sonner
import { createContext, useContext, useState } from "react";

const ToastContext = createContext({
  toast: () => {},
  toasts: [],
  dismissToast: () => {},
});

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const toast = ({ title, description, variant = "default" }) => {
    const id = Date.now().toString();
    const newToast = { id, title, description, variant };
    setToasts((prev) => [...prev, newToast]);

    // Auto dismiss after 5 seconds
    setTimeout(() => {
      dismissToast(id);
    }, 5000);

    return id;
  };

  const dismissToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ toast, toasts, dismissToast }}>
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}

function ToastContainer() {
  const { toasts, dismissToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-0 right-0 p-4 space-y-2 z-50">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`p-4 rounded-md shadow-md ${
            toast.variant === "destructive"
              ? "bg-destructive text-destructive-foreground"
              : "bg-background border"
          }`}
        >
          {toast.title && <h4 className="font-medium">{toast.title}</h4>}
          {toast.description && <p className="text-sm">{toast.description}</p>}
          <button
            onClick={() => dismissToast(toast.id)}
            className="absolute top-1 right-1 p-1 rounded-full hover:bg-muted"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}

// Simplified version for direct import
export const toast = {
  default: (props) => console.log("Toast:", props),
  destructive: (props) => console.log("Destructive Toast:", props),
};
