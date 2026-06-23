import React, { createContext, useState, useEffect, useContext } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // Load cart data from localStorage on mount
  useEffect(() => {
    const storedCart = localStorage.getItem('cartItems');
    if (storedCart) {
      try {
        setCartItems(JSON.parse(storedCart));
      } catch (err) {
        localStorage.removeItem('cartItems');
      }
    }
  }, []);

  // Save cart items to localStorage on modification
  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  // Add item to cart
  const addToCart = (product, qty = 1) => {
    setCartItems((prevItems) => {
      const existItem = prevItems.find((x) => x.product === product._id);

      if (existItem) {
        // Limit max quantity to available stock
        const newQty = Math.min(product.countInStock, existItem.qty + qty);
        return prevItems.map((x) =>
          x.product === product._id ? { ...x, qty: newQty } : x
        );
      } else {
        return [
          ...prevItems,
          {
            product: product._id,
            name: product.name,
            image: product.image,
            price: product.price,
            countInStock: product.countInStock,
            qty: Math.min(product.countInStock, qty),
          },
        ];
      }
    });
  };

  // Remove item from cart
  const removeFromCart = (id) => {
    setCartItems((prevItems) => prevItems.filter((x) => x.product !== id));
  };

  // Update item quantity directly
  const updateQty = (id, qty) => {
    setCartItems((prevItems) =>
      prevItems.map((x) => (x.product === id ? { ...x, qty: Number(qty) } : x))
    );
  };

  // Clear all cart items
  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('cartItems');
  };

  // Calculation helpers
  const itemsPrice = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  const shippingPrice = itemsPrice > 100 || itemsPrice === 0 ? 0 : 10;
  const taxPrice = Number((0.15 * itemsPrice).toFixed(2));
  const totalPrice = Number((itemsPrice + shippingPrice + taxPrice).toFixed(2));

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQty,
        clearCart,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
export default CartContext;
