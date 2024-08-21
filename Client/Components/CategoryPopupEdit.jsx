import React, { useState } from 'react';
import  '../css/categoryPopupEdit.css';

const CategoryPopupEdit = ({ categories, onClose, onSave }) => {
    const [selectedCategory, setSelectedCategory] = useState(categories[0].id);
    const [newCategoryName, setNewCategoryName] = useState('');

    const handleSave = async () => {
        try {
            const response = await fetch(`http://localhost:3000/dishesTypes/${selectedCategory}`, {
                method: 'PUT',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ title: newCategoryName }),
            });

            if (response.ok) {
                onSave({ id: selectedCategory, title: newCategoryName });
                onClose();
            } else {
                console.error('Failed to update category');
            }
        } catch (error) {
            console.error('Error updating category:', error);
        }
    };

    return (
        <div className="category-popup-overlay">
            <div className="category-popup-content">
                <h2 className="title-Category">עריכת קטגוריה</h2>
                <select
                    className="category-popup-input"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                >
                    {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                            {category.title}
                        </option>
                    ))}
                </select>
                <input
                    className="category-popup-input"
                    type="text"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder="שם קטגוריה חדש"
                />
                <div className="category-popup-buttons">
                    <button className="category-popup-save" onClick={handleSave}>שמור</button>
                    <button className="category-popup-close" onClick={onClose}>ביטול</button>
                </div>
            </div>
        </div>
    );
};

export default CategoryPopupEdit;
