import React, { useState, useEffect } from 'react';
import '../css/dishes.css';
import HomeHeader from '../Components/HomeHeader';
import Footer from '../Components/Footer';

function Menu() {
  const [dishes, setDishes] = useState([]);
  // const [originalDishes, setOriginalDishes] = useState([]);


  useEffect(() => {
    fetch('http://localhost:3000/dishes')
      .then((res) => res.json())
      .then((dishes) => {
        setDishes(dishes);
        // setOriginalDishes(dishes);
      })
      .catch((error) => console.error('Error fetching dishes:', error));
  }, []);

  const groupedDishes = dishes.reduce((acc, dish) => {
    if (!acc[dish.dishType]) {
      acc[dish.dishType] = [];
    }
    acc[dish.dishType].push(dish);
    return acc;
  }, {});

  return (
    <>
      <HomeHeader />
      <div className="menu">
        {Object.keys(groupedDishes).map(dishType => (
          <div key={dishType} className="dish-type">
            <h2 className='title-dishType'>{dishType}</h2>
            <div className="dishes">
              {groupedDishes[dishType].map(dish => (
                <div key={dish.id} className="dish">
                  <img src={`http://localhost:3000/images/${dish.imageUrl}`} alt={dish.dishName} className="dish-image" />
                  <div className="dish-details">
                    <div className="dish-header">
                      <h3>{dish.dishName}</h3>
                      <p className="dish-price">{dish.price}₪</p>
                    </div>
                    <p>{dish.remarks}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <Footer/>
    </>

  );
}

export default Menu;
