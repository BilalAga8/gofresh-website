"use client";

import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useMemo,
} from "react";
import type { ReactNode } from "react";

export type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
};

type CartState = {
  items: CartItem[];
  toastMessage: string | null;
};

type CartAction =
  | { type: "ADD_ITEM"; payload: CartItem }
  | { type: "REMOVE_ITEM"; payload: string }
  | { type: "CLEAR_CART" }
  | { type: "INCREASE_QUANTITY"; payload: string }
  | { type: "DECREASE_QUANTITY"; payload: string }
  | { type: "SET_TOAST_MESSAGE"; payload: string | null }
  | { type: "LOAD_CART"; payload: CartItem[] };

const initialState: CartState = {
  items: [],
  toastMessage: null,
};

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const existingItem = state.items.find(
        (item) => item.id === action.payload.id
      );
      if (existingItem) {
        return {
          ...state,
          items: state.items.map((item) =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + action.payload.quantity }
              : item
          ),
          toastMessage: `${action.payload.name} u shtua në shportë!`,
        };
      }
      return {
        ...state,
        items: [...state.items, action.payload],
        toastMessage: `${action.payload.name} u shtua në shportë!`,
      };
    }
    case "REMOVE_ITEM":
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.payload),
      };
    case "CLEAR_CART":
      return { ...state, items: [] };
    case "INCREASE_QUANTITY":
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === action.payload
            ? { ...item, quantity: item.quantity + 1 }
            : item
        ),
      };
    case "DECREASE_QUANTITY":
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === action.payload && item.quantity > 1
            ? { ...item, quantity: item.quantity - 1 }
            : item
        ),
      };
    case "SET_TOAST_MESSAGE":
      return { ...state, toastMessage: action.payload };
    case "LOAD_CART":
      return { ...state, items: action.payload };
    default:
      return state;
  }
}

const CartContext = createContext<{
  state: CartState;
  dispatch: React.Dispatch<CartAction>;
}>({
  state: initialState,
  dispatch: () => null,
});

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Ngarko nga localStorage vetëm pas montimit (client-side)
  useEffect(() => {
    try {
      const saved = localStorage.getItem("cart");
      if (saved) {
        dispatch({ type: "LOAD_CART", payload: JSON.parse(saved) });
      }
    } catch {
      // localStorage i dëmtuar — vazhdojmë me shportë bosh
    }
  }, []);

  // Ruaj në localStorage sa herë ndryshon shporta
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(state.items));
  }, [state.items]);

  useEffect(() => {
    if (state.toastMessage) {
      const timer = setTimeout(() => {
        dispatch({ type: "SET_TOAST_MESSAGE", payload: null });
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [state.toastMessage]);

  const value = useMemo(() => ({ state, dispatch }), [state, dispatch]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => useContext(CartContext);
