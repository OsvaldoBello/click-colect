/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useContext } from 'react';
// Cria o contexto
const CartContext = createContext();

// Provider que vai envolver a aplicação
export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  const addToCart = (product, quantity, size = '') => {
    setCart((prevCart) => {
      const cartItemId = `${product.id}-${size}`;
      const existingItem = prevCart.find(item => item.cartItemId === cartItemId);

      if (existingItem) {
        return prevCart.map(item => 
          item.cartItemId === cartItemId 
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prevCart, { ...product, cartItemId, quantity, selectedSize: size }];
    });
  };

  const removeFromCart = (cartItemId) => {
    setCart((prevCart) => prevCart.filter(item => item.cartItemId !== cartItemId));
  };

  const updateQuantity = (cartItemId, newQuantity) => {
    if (newQuantity < 1) return;
    setCart((prevCart) => 
      prevCart.map(item => 
        item.cartItemId === cartItemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartTotal = cart.reduce((acc, item) => acc + (item.discountPrice * item.quantity), 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, cartCount, cartTotal }}>
      {children}
    </CartContext.Provider>
  );
}

// Hook customizado para facilitar o uso
export function useCart() {
  return useContext(CartContext);
}