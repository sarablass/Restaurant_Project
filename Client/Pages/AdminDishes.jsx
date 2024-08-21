
import React, { useState, useEffect, useContext } from 'react';
import '../css/pickup.css';
import { userContext } from '../Components/App';
import HomeHeader from '../Components/HomeHeader';
import DishPopupEdit from '../Components/DishPopupEdit';
import DishPopupAdd from '../Components/DishPopupAdd';
import ConfirmationPopup from '../Components/ConfirmationPopup';
import CategoryPopupAdd from '../Components/CategoryPopupAdd';
import CategoryPopupEdit from '../Components/CategoryPopupEdit';
import { useNavigate } from 'react-router-dom';

function AdminDishes() {
  const [dishes, setDishes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedDish, setSelectedDish] = useState(null);
  const [dishToDelete, setDishToDelete] = useState(null);
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [showCategoryAddPopup, setShowCategoryAddPopup] = useState(false);
  const [showCategoryEditPopup, setShowCategoryEditPopup] = useState(false);
  const { user } = useContext(userContext);
  const navigate = useNavigate();

  useEffect(() => {
    console.log('User ID Type:', user?.idUserType);
    if (user?.idUserType !== 1) {
        console.error('Access denied: Only admins can view this page.');
        navigate('/home')
      }
    fetch('http://localhost:3000/dishes')
      .then((res) => res.json())
      .then((dishes) => {
        setDishes(dishes);
        if (dishes.length > 0) {
          setSelectedCategory(dishes[0].dishType);
        }
      })
      .catch((error) => console.error('Error fetching dishes:', error));
  }, [user]);//??

  useEffect(() =>{
    if (user?.idUserType !== 1) {
        console.error('Access denied: Only admins can view this page.');
        return;
      }
    fetch('http://localhost:3000/dishesTypes')
    .then((res) => res.json())
    .then((categories) => {
      setCategories(categories);
      if (categories.length > 0 && !selectedCategory) {
        setSelectedCategory(categories[0].title);
      }
    })
    .catch((error) => console.error('Error fetching categories:', error));
  },[categories,user]);//??

  const handleSave = (updatedDish) => {
    setDishes((prevDishes) =>
      prevDishes.map((dish) =>
        dish.id === updatedDish.id ? updatedDish : dish
      )
    );
    setSelectedDish(null);
  };

  const handleAdd = (newDish) => {
    setDishes((prevDishes) => [...prevDishes, newDish]);
    setShowAddPopup(false);
    setSelectedCategory(newDish.dishType);
  };

  const handleDelete = async (dishId) => {
    if (user?.idUserType !== 1) {
      console.error('Access denied: Only admins can view this page.');
      return;
    }
    try {
      const response = await fetch(`http://localhost:3000/dish/${dishId}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (response.ok) {
        setDishes((prevDishes) => prevDishes.filter((dish) => dish.id !== dishId));
        setDishToDelete(null);
      } else {
        console.error('Failed to delete dish');
      }
    } catch (error) {
      console.error('Error deleting dish:', error);
    }
  };

  const handleAddCategory = (newCategory) => {
    setCategories((prevCategories) => [...prevCategories, newCategory]);
    setShowCategoryAddPopup(false);
  };

  const handleUpdateCategory = (updatedCategory) => {
    setCategories((prevCategories) =>
      prevCategories.map((category) =>
        category.id === updatedCategory.id ? updatedCategory : category
      )
    );
    setShowCategoryEditPopup(false);
    if (selectedCategory === updatedCategory.id) {
      setSelectedCategory(updatedCategory.title);
    }
  };

  const groupedDishes = dishes.reduce((acc, dish) => {
    if (!acc[dish.dishType]) {
      acc[dish.dishType] = [];
    }
    acc[dish.dishType].push(dish);
    return acc;
  }, {});

//   if (user?.idUserType !== 1) {
//     return <p>Access denied: Only admins can view this page.</p>;
//   }

  return (
    <>
      <HomeHeader />
      <div className="menu-container">
        <div className="menu-sidebar">
          <ul>
            {categories.map((category) => (
              <li
                key={category.id}
                className={selectedCategory === category.title ? 'menu-active' : ''}
                onClick={() => setSelectedCategory(category.title)}
              >
                <span>{category.title}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="menu-content">
          {selectedCategory && (
            <div className="menu-dish-type">
              <h2 className="menu-title-dishType">{selectedCategory}</h2>
              <div className="menu-dishes">
                {groupedDishes[selectedCategory] ?
                  groupedDishes[selectedCategory].map((dish) => (
                    <div key={dish.id} className="menu-dish">
                      <img src={`http://localhost:3000/images/${dish.imageUrl}`} alt={dish.dishName} className="menu-dish-image" />
                      <div className="menu-dish-details">
                        <h3 className="menu-dish-name">{dish.dishName}</h3>
                        <p className="menu-dish-remarks">{dish.remarks}</p>
                        <div className="menu-dish-footer">
                          <p className="menu-dish-price">{dish.price}₪</p>
                          <button
                            className='remove-icon-btn'
                            onClick={() => setDishToDelete(dish.id)}
                          >
                            <img src="../pic/trash-icon.png" className="remove-icon" alt="מחק מנה" />
                          </button>
                          <button onClick={() => setSelectedDish(dish)}>
                            <img src="../pic/edit.png" className="edit-icon" alt="ערוך מנה" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                  : <p>אין מנות בקטגוריה זו</p>
                }
              </div>
            </div>
          )}
        </div>
        <div className="btn-add" style={{ height: '100px' }}>
          <br></br>
          <button onClick={() => setShowAddPopup(true)}>
            <img className='remove-icon' src="../pic/addition-sign.png" alt="הוסף מנה" /> הוסף מנה
          </button>
          <div className="btn-update-catgory" style={{ height: '200px' }}>
            <br></br>
            <button onClick={() => setShowCategoryAddPopup(true)}>
              <img className='remove-icon' src="../pic/addition-sign.png" alt="הוסף קטגוריה" /> הוסף קטגוריה
            </button>
            <br></br><br></br><br></br>
            <button onClick={() => setShowCategoryEditPopup(true)}>
              <img className='remove-icon' src="./pic/edit.png" alt="עריכת קטגוריה" /> עריכת קטגוריה
            </button>
          </div>
        </div>
      </div>

      {selectedDish && (
        <DishPopupEdit
          dish={selectedDish}
          onClose={() => setSelectedDish(null)}
          onSave={handleSave}
        />
      )}
      {showAddPopup && (
        <DishPopupAdd
          dishType={selectedCategory}
          onClose={() => setShowAddPopup(false)}
          onSave={handleAdd}
        />
      )}
      {dishToDelete && (
        <ConfirmationPopup
          message="האם אתה בטוח שברצונך למחוק את המנה?"
          onConfirm={() => handleDelete(dishToDelete)}
          onCancel={() => setDishToDelete(null)}
        />
      )}
      {showCategoryAddPopup && (
        <CategoryPopupAdd
          onClose={() => setShowCategoryAddPopup(false)}
          onSave={handleAddCategory}
        />
      )}
      {showCategoryEditPopup && (
        <CategoryPopupEdit
          categories={categories}
          onClose={() => setShowCategoryEditPopup(false)}
          onSave={handleUpdateCategory}
        />
      )}
    </>
  );
}

export default AdminDishes;