import React, { useEffect } from "react";

interface ToastProps {
  message: string;
  type: "success" | "error" | "warning" | "info";
  onClose: () => void;
  duration?: number;
}

const Toast: React.FC<ToastProps> = ({
  message,
  type,
  onClose,
  duration = 3000,
}) => {
  useEffect(() => {
    if (duration) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const bgColor =
    type === "success"
      ? "bg-success"
      : type === "error"
      ? "bg-error"
      : type === "warning"
      ? "bg-warning"
      : "bg-info";

  return (
    <div
      className={`fixed bottom-4 right-4 p-4 rounded-md text-white animate-slide-in ${bgColor} shadow-md flex items-center gap-2 z-50`}
    >
      <p className="text-sm">{message}</p>
      <button
        onClick={onClose}
        className="text-white hover:text-primary transition-colors duration-200"
      >
        X
      </button>
    </div>
  );
};

export default Toast;
