import * as React from "react";
import { X } from "lucide-react";
import { cn } from "../../lib/utils";

export interface ToastProps {
  id: string;
  message: string;
  type: "success" | "error" | "info";
  onClose: (id: string) => void;
}

export const Toast: React.FC<ToastProps> = ({ id, message, type, onClose }) => {
  React.useEffect(() => {
    const timer = setTimeout(() => {
      onClose(id);
    }, 5000);

    return () => clearTimeout(timer);
  }, [id, onClose]);

  const bgColor = {
    success: "bg-green-500",
    error: "bg-red-500",
    info: "bg-blue-500",
  }[type];

  return (
    <div
      className={cn(
        "flex items-center justify-between gap-4 rounded-md p-4 text-white shadow-lg min-w-[300px]",
        bgColor
      )}
    >
      <p className="text-sm font-medium">{message}</p>
      <button
        onClick={() => onClose(id)}
        className="hover:opacity-80 transition-opacity"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};

export interface ToasterProps {
  toasts: Array<{ id: string; message: string; type: "success" | "error" | "info" }>;
  onClose: (id: string) => void;
}

export const Toaster: React.FC<ToasterProps> = ({ toasts, onClose }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} onClose={onClose} />
      ))}
    </div>
  );
};
