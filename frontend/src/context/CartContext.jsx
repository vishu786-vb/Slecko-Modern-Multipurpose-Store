import { createContext, useContext, useReducer, useEffect } from 'react';

const CartContext = createContext(null);

const CART_STORAGE_KEY = 'slekco_cart';

function loadCart() {
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveCart(items) {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
}

function cartReducer(state, action) {
  let newState;

  switch (action.type) {
    case 'ADD_ITEM': {
      const existing = state.find(item => item.id === action.payload.id);
      if (existing) {
        newState = state.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: item.quantity + (action.payload.quantity || 1) }
            : item
        );
      } else {
        newState = [...state, { ...action.payload, quantity: action.payload.quantity || 1 }];
      }
      break;
    }
    case 'REMOVE_ITEM':
      newState = state.filter(item => item.id !== action.payload);
      break;
    case 'UPDATE_QUANTITY':
      if (action.payload.quantity <= 0) {
        newState = state.filter(item => item.id !== action.payload.id);
      } else {
        newState = state.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        );
      }
      break;
    case 'CLEAR_CART':
      newState = [];
      break;
    default:
      return state;
  }

  saveCart(newState);
  return newState;
}

export function CartProvider({ children }) {
  const [items, dispatch] = useReducer(cartReducer, [], loadCart);

  const addItem = (product, quantity = 1) => {
    dispatch({
      type: 'ADD_ITEM',
      payload: {
        id: product.id,
        name: product.name,
        price: parseFloat(product.price),
        thumbnail: product.thumbnail,
        slug: product.slug,
        quantity,
      },
    });
  };

  const removeItem = (id) => {
    dispatch({ type: 'REMOVE_ITEM', payload: id });
  };

  const updateQuantity = (id, quantity) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.08;
  const shipping = subtotal >= 100 ? 0 : (items.length > 0 ? 9.99 : 0);
  const total = subtotal + tax + shipping;

  return (
    <CartContext.Provider value={{
      items,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      itemCount,
      subtotal,
      tax,
      shipping,
      total,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
