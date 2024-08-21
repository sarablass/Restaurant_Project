import React from 'react';
import '../css/dishPopup.css'; 

const DishPopup = ({ dish, onClose, onAddToCart }) => {
  if (!dish) return null;

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <img src={`http://localhost:3000/images/${dish.imageUrl}`} alt={dish.dishName} className="popup-dish-image" />
        <div className="popup-dish-details">
          <h3 className="popup-dish-name">{dish.dishName}</h3>
          <p className="popup-dish-remarks">{dish.remarks}</p>
          <div className="popup-dish-footer">
            <p className="popup-dish-price">{dish.price}₪</p>
            <button className="popup-add-to-cart" onClick={onAddToCart}>הוספה לסל</button>
          </div>
        </div>
        <button className="popup-close" onClick={onClose}>סגור</button>
      </div>
    </div>
  );
};

export default DishPopup;
