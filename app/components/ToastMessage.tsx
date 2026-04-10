"use client";

import { useCart } from "../context/CartContext";

export default function ToastMessage() {
  const { state } = useCart();

  if (!state.toastMessage) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-green-600 text-white px-4 py-2 rounded shadow-lg z-50">
      {state.toastMessage}
    </div>
  );
}
