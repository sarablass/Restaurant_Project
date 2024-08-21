import React, { useState } from 'react';
import '../css/dishPopupAdd.css';

const DishPopupAdd = ({ dishType, onClose, onSave }) => {
  const [newDish, setNewDish] = useState({
    dishName: '',
    idDishTypes: dishType,
    remarks: '',
    price: '',
    vegan: false,
    gluten: false,
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    setNewDish({ ...newDish, [name]: newValue });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreviewUrl(null);
    }
  };

  const handleSave = async () => {
    const formData = new FormData();
    formData.append('dishName', newDish.dishName);
    formData.append('idDishTypes', newDish.idDishTypes);
    formData.append('remarks', newDish.remarks);
    formData.append('price', newDish.price);
    formData.append('vegan', newDish.vegan);
    formData.append('gluten', newDish.gluten);
    if (imageFile) {
      formData.append('image', imageFile);
    }

    try {
      const response = await fetch('http://localhost:3000/dish', {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });
      if (response.ok) {
        const addedDish = await response.json();
        console.log('Added dish:', addedDish);
        onSave({
          ...addedDish,
          dishType: newDish.idDishTypes
        });
        onClose();
      } else {
        const errorText = await response.text();
        console.error('Failed to add dish, response text:', errorText);
      }
    } catch (error) {
      console.error('Error adding dish:', error);
    }
  };

  return (
    <div className="dish-popup-overlay">
      <div className="dish-popup-content">
        <div className="dish-popup-dish-details">
          <input
            type="file"
            name="image"
            onChange={handleFileChange}
            className="dish-popup-dish-image-file"     
          />
           {/* <img src={'../pic/upload.png'}  /> */}
          {imagePreviewUrl && (
            <img src={imagePreviewUrl} alt="Preview" className="dish-popup-image-preview" />
          )}
          <input
            type="text"
            name="dishName"
            placeholder="שם המנה"
            value={newDish.dishName}
            onChange={handleChange}
            className="dish-popup-dish-name"
          />
          <textarea
            name="remarks"
            placeholder="הערות"
            value={newDish.remarks}
            onChange={handleChange}
            className="dish-popup-dish-remarks"
          />
          <div className="dish-popup-dish-footer">
            <input
              type="text"
              name="price"
              placeholder="מחיר"
              value={newDish.price}
              onChange={handleChange}
              className="dish-popup-dish-price"
            />
            <div>
            <input
                  type="checkbox"
                  name="vegan"
                  checked={newDish.vegan}
                  onChange={handleChange}
                />
              <label className='lbl-checkGlu'>טבעוני</label>
              <input
                  type="checkbox"
                  name="gluten"
                  checked={newDish.gluten}
                  onChange={handleChange}
                />
              <label className='lbl-checkGlu'>ללא גלוטן</label>                   
            </div>
          </div>
        </div>
        <button className="dish-popup-save" onClick={handleSave}>שמור</button>
        <button className="dish-popup-close" onClick={onClose}>סגור</button>
      </div>
    </div>
  );
};

export default DishPopupAdd;
