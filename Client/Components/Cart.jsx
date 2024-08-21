import React, { useState } from 'react';

function Cart({ cart, setCart, orderId, setOrderId, deleteOrder, createOrder, updateDishQuantityInOrder, addDishToOrder, deleteDishFromOrder, getTotalPrice, forPayment }) {
  
  const incrementQuantity = async (dishId) => {
    setCart((prevCart) => {
      return prevCart.map(item => {
        if (item.dish.id === dishId) {
          const newQuantity = item.quantity + 1;
          updateDishQuantityInOrder(orderId, dishId, newQuantity);
          return { ...item, quantity: newQuantity };
        }
        return item;
      });
    });
  };

  const decrementQuantity = async (dishId) => {
    setCart((prevCart) => {
      return prevCart.map(item => {
        if (item.dish.id === dishId && item.quantity > 1) {
          const newQuantity = item.quantity - 1;
          updateDishQuantityInOrder(orderId, dishId, newQuantity);
          return { ...item, quantity: newQuantity };
        }
        return item;
      });
    });
  };

  const removeFromCart = async (dishId) => {
    const dishInCart = cart.find(item => item.dish.id === dishId);
    if (dishInCart && orderId) {
      await deleteDishFromOrder(orderId, dishId);
    }
    setCart((prevCart) => {
      const newCart = prevCart.filter(item => item.dish.id !== dishId);
      if (newCart.length === 0 && orderId) {
        deleteOrder(orderId); 
        setOrderId(null);
      }
      return newCart;
    });
  };

  const resetCart = async () => {
    try {
      if (orderId) {
        await deleteOrder(orderId); 
      }
      setCart([]);
      setOrderId(null);
    } catch (error) {
      console.error('Error resetting cart:', error);
    }
  };

  return (
    <div className="cart-sidebar" style={{ height: cart.length ? 'auto' : '500px' }}>
      <h2>סיכום הזמנה</h2>
      {cart.length === 0 ? (
        <>
          <img src="../pic/basket (1).png" className="basket-image" />
          <p className='empty-cart'>הסל שלך ריק</p>
        </>
      ) : (
        <>
          {cart.map((item) => (
            <div key={item.dish.id} className="cart-item">
              <p>
                {item.dish.dishName} - {item.dish.price}₪
              </p>
              <div className="quantity-controls">
                <button className="plus-btn" onClick={() => incrementQuantity(item.dish.id)}>+</button>
                <span>{item.quantity}</span>
                <button className="minus-btn" onClick={() => decrementQuantity(item.dish.id)} disabled={item.quantity === 1}>-</button>
                <button className="remove-icon-btnM" onClick={() => removeFromCart(item.dish.id)}>
                  <img src="../pic/trash-icon.png" className="remove-icon" />
                </button>
              </div>
            </div>
          ))}
          <p className="total-price">סה"כ לתשלום: {getTotalPrice()}₪</p>
          <button className="reset-cart-button" onClick={resetCart}>איפוס סל</button>
        </>
      )}
      <button className="checkout-button" onClick={forPayment}>לתשלום</button>
    </div>
  );
}

export default Cart;
