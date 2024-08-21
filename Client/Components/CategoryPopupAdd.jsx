import React, { useState } from 'react';
import '../css/categoryPopupAdd.css';

function CategoryPopupAdd({ onClose, onSave }) {
  const [categoryName, setCategoryName] = useState('');

  const handleSave = async () => {
    if (categoryName.trim()) {
      try {
        const response = await fetch('http://localhost:3000/dishesTypes', {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ title: categoryName }),
        });

        if (response.ok) {
          const newCategory = await response.json();
          onSave(newCategory);
        } else {
          console.error('Failed to add category');
        }
      } catch (error) {
        console.error('Error adding category:', error);
      }
    }
  };

  return (
    <div className="category-popup-overlay">
      <div className="category-popup-content">
        <h2 className='title-Category'>הוספת קטגוריה</h2>
        <input
          type="text"
          placeholder="שם הקטגוריה"
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
          className="category-popup-input"
        />
        <div className="category-popup-buttons">
          <button onClick={handleSave} className="category-popup-save">שמור</button>
          <button onClick={onClose} className="category-popup-close">סגור</button>
        </div>
      </div>
    </div>
  );
}

export default CategoryPopupAdd;
