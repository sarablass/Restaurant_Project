import React, { useState } from 'react';
import '../css/dishPopupEdit.css';

const DishPopupEdit = ({ dish, onClose, onSave }) => {
  const [editDish, setEditDish] = useState(dish);

  if (!dish) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditDish({ ...editDish, [name]: value });
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`http://localhost:3000/dish/${editDish.id}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editDish),
      });

      if (response.ok) {
        onSave(editDish);
        onClose();
      } else {
        console.error('Failed to save dish');
      }
    } catch (error) {
      console.error('Error saving dish:', error);
    }
  };

  return (
    <div className="dish-popup-overlay">
      <div className="dish-popup-content">
      <img src={`http://localhost:3000/images/${editDish.imageUrl}`} alt={editDish.dishName} className="dish-popup-dish-image" />
        <div className="dish-popup-dish-details">
          <input
            type="text"
            name="dishName"
            value={editDish.dishName}
            onChange={handleChange}
            className="dish-popup-dish-name"
          />
          <textarea
            name="remarks"
            value={editDish.remarks}
            onChange={handleChange}
            className="dish-popup-dish-remarks"
          />
          <div className="dish-popup-dish-footer">
            <input
              type="text"
              name="price"
              value={editDish.price}
              onChange={handleChange}
              className="dish-popup-dish-price"
            />
          </div>
        </div>
        <button className="dish-popup-save" onClick={handleSave}>שמור</button>
        <button className="dish-popup-close" onClick={onClose}>סגור</button>
      </div>
    </div>
  );
};

export default DishPopupEdit;
