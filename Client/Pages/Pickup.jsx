import React, { useState, useEffect, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'; // הוסף useNavigate
import '../css/pickup.css';
import HomeHeader from '../Components/HomeHeader';
import DishPopup from '../Components/DishPopup';
import LoginForm from '../Pages/LoginForm';
import { userContext } from '../Components/App';
import Cart from '../Components/Cart';
import OrderModal from '../Components/OrderModal'; // הוסף יבוא לרכיב החלונית החדש

function Pickup() {
  const location = useLocation();
  const navigate = useNavigate(); // הוסף את useNavigate
  const { orderingTableId, date, time } = location.state || {};
  const [dishes, setDishes] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [cart, setCart] = useState([]);
  const [selectedDish, setSelectedDish] = useState(null);
  const [orderId, setOrderId] = useState(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false); // הוסף מצב לחלונית החדשה
  const { user } = useContext(userContext);

  // useEffect(() => {
  //   fetch('http://localhost:3000/dishes')
  //     .then((res) => res.json())
  //     .then((dishes) => {
  //       setDishes(dishes);
  //       if (dishes.length > 0) {
  //         setSelectedCategory(dishes[0].dishType);
  //       }
  //     })
  //     .catch((error) => console.error('Error fetching dishes:', error));
  // }, []);


  useEffect(() => {
    const fetchData = async () => {

      try {
        // Fetch dishes
        const dishesResponse = await fetch('http://localhost:3000/dishes');
        const dishesData = await dishesResponse.json();
        setDishes(dishesData);
        if (dishesData.length > 0) {
          setSelectedCategory(dishesData[0].dishType);
        }

        // Fetch last open order if user is logged in
        if (user && user.id && user.idUserType == 3) {
          const orderResponse = await fetch(`http://localhost:3000/fullCart/user/${user.id}/last-open`, {
            credentials: 'include'
          });
          const orderData = await orderResponse.json();
          if (orderData) {
            setOrderId(orderData.id);
            setCart(orderData.items.map(item => ({
              dish: { id: item.id, dishName: item.dishName, price: item.price },
              quantity: item.amount
            })));
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {

      }
    };

    fetchData();
  }, [user]);

  const getCurrentDateTime = () => {
    const now = new Date();
    const dateOrder = now.toISOString().split('T')[0];
    const timeOrder = now.toTimeString().split(' ')[0];
    return { dateOrder, timeOrder };
  };

  const createOrder = async () => {
    let { dateOrder, timeOrder } = getCurrentDateTime();
    if (orderingTableId) {
      dateOrder = date;
      timeOrder = time;
    }
    try {
      const response = await fetch('http://localhost:3000/orderingFood', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: '',
          userId: user.id,
          idOrderingTable: orderingTableId || null,
          orderDate: dateOrder,
          orderTime: timeOrder,
          payment: 0,
          statusOrder: 0
        })
      });

      if (!response.ok) {
        console.error('Failed to create order, response status:', response.status);
        throw new Error('Failed to create order');
      }

      const newOrderFood = await response.json();
      console.log('Order saved:', newOrderFood);
      return newOrderFood.id;
    } catch (error) {
      console.error('Error adding order:', error);
      return null;
    }
  };

  const addDishToOrder = async (orderId, dishId) => {
    try {
      const response = await fetch('http://localhost:3000/dishesOrdered', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          idOrderingFood: orderId,
          idDish: dishId,
          amount: 1
        })
      });

      if (!response.ok) {
        console.error('Failed to add dish to order, response status:', response.status);
        throw new Error('Failed to add dish to order');
      }

      const newDishOrdered = await response.json();
      console.log('Dish added to order:', newDishOrdered);
    } catch (error) {
      console.error('Error adding dish to order:', error);
    }
  };

  const updateDishQuantityInOrder = async (orderId, dishId, newQuantity) => {
    try {
      const response = await fetch(`http://localhost:3000/dishesOrdered/${orderId}/${dishId}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: newQuantity
        })
      });

      if (!response.ok) {
        console.error('Failed to update dish quantity, response status:', response.status);
        throw new Error('Failed to update dish quantity');
      }

      console.log('Dish quantity updated');
    } catch (error) {
      console.error('Error updating dish quantity:', error);
    }
  };

  const deleteDishFromOrder = async (orderId, dishId) => {
    try {
      const response = await fetch(`http://localhost:3000/dishesOrdered/${orderId}/${dishId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        console.error('Failed to delete dish from order, response status:', response.status);
        throw new Error('Failed to delete dish from order');
      }

      console.log('Dish deleted from order');
    } catch (error) {
      console.error('Error deleting dish from order:', error);
    }
  };

  const deleteOrder = async (orderId) => {
    try {
      const response = await fetch(`http://localhost:3000/orderingFood/${orderId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        console.error('Failed to delete order, response status:', response.status);
        throw new Error('Failed to delete order');
      }

      console.log('Order deleted');
    } catch (error) {
      console.error('Error deleting order:', error);
    }
  };

  const forPayment = async () => {
    const totalPayment = getTotalPrice();
    if (!orderId) {
      console.error('No order ID, cannot proceed to payment');
      return;
    }
    let { dateOrder, timeOrder } = getCurrentDateTime();
    if (orderingTableId) {
      dateOrder = date;
      timeOrder = time;
    }
    try {
      const response = await fetch(`http://localhost:3000/orderingFood/${orderId}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderDate: dateOrder,
          orderTime: timeOrder,
          payment: totalPayment,
          statusOrder: 1
        })
      });

      if (!response.ok) {
        console.error('Failed to update order for payment, response status:', response.status);
        throw new Error('Failed to update order for payment');
      }

      console.log('Order updated for payment');
      setIsOrderModalOpen(true); // הצגת החלונית לאחר הצלחת התשלום
    } catch (error) {
      console.error('Error updating order for payment:', error);
    }
  };

  const addToCart = async () => {
    if (selectedDish) {
      console.log('Selected dish:', selectedDish);
      let newOrderId = orderId;
      if (!orderId) {
        newOrderId = await createOrder();
        console.log('New order ID:', newOrderId);
        if (newOrderId) {
          setOrderId(newOrderId);
        } else {
          console.error('Failed to create order, cannot add to cart');
          return;
        }
      }

      const existingDish = cart.find(item => item.dish.id === selectedDish.id);
      if (existingDish) {
        const newQuantity = existingDish.quantity + 1;
        setCart((prevCart) =>
          prevCart.map(item =>
            item.dish.id === selectedDish.id ? { ...item, quantity: newQuantity } : item
          )
        );
        await updateDishQuantityInOrder(newOrderId, selectedDish.id, newQuantity);
      } else {
        setCart((prevCart) => [...prevCart, { dish: selectedDish, quantity: 1 }]);
        await addDishToOrder(newOrderId, selectedDish.id);
      }

      setSelectedDish(null);
    }
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

  const groupedDishes = dishes.reduce((acc, dish) => {
    if (!acc[dish.dishType]) {
      acc[dish.dishType] = [];
    }
    acc[dish.dishType].push(dish);
    return acc;
  }, {});

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.dish.price * item.quantity, 0);
  };

  const getDishQuantity = (dishId) => {
    const dishInCart = cart.find(item => item.dish.id === dishId);
    return dishInCart ? dishInCart.quantity : 0;
  };

  const handleOrderModalClose = () => {
    setIsOrderModalOpen(false);
    if (user && user.idUserType === 2) {
      navigate('/openTables');
    }
    if (user && user.idUserType === 3) {
      navigate('/personal-area');
    }
  };

  return (
    <>
      <HomeHeader />
      <div className="menu-container">
        <div className="menu-sidebar">
          <ul>
            {Object.keys(groupedDishes).map((dishType) => (
              <li
                key={dishType}
                className={selectedCategory === dishType ? 'menu-active' : ''}
                onClick={() => setSelectedCategory(dishType)}
              >
                <span>{dishType}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="menu-content">
          {selectedCategory && (
            <div className="menu-dish-type">
              <h2 className="menu-title-dishType">{selectedCategory}</h2>
              <div className="menu-dishes">
                {groupedDishes[selectedCategory].map((dish) => (
                  <div key={dish.id} className="menu-dish">
                    <img src={`http://localhost:3000/images/${dish.imageUrl}`} alt={dish.dishName} className="menu-dish-image" />
                    <div className="menu-dish-details">
                      <h3 className="menu-dish-name">{dish.dishName}</h3>
                      <p className="menu-dish-remarks">{dish.remarks}</p>
                      <div className="menu-dish-footer">
                        <p className="menu-dish-price">{dish.price}₪</p>
                        <div className="quantity-indicator">
                          {getDishQuantity(dish.id) > 0 && <span className="quantity-circle">X{getDishQuantity(dish.id)}</span>}
                        </div>
                        <button
                          className="menu-add-to-cart"
                          onClick={() => {
                            if (!user) {
                              setIsLoginModalOpen(true);
                              return;
                            }
                            console.log('Dish selected:', dish);
                            setSelectedDish(dish);
                          }}
                        >
                          הוספה לסל
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <Cart
          cart={cart}
          setCart={setCart}
          orderId={orderId}
          setOrderId={setOrderId}
          deleteOrder={deleteOrder}
          createOrder={createOrder}
          updateDishQuantityInOrder={updateDishQuantityInOrder}
          addDishToOrder={addDishToOrder}
          deleteDishFromOrder={deleteDishFromOrder}
          getTotalPrice={getTotalPrice}
          forPayment={forPayment}
          resetCart={resetCart} // הוסף את הפונקציה כפרופס נוסף
        />
      </div>
      {selectedDish && (
        <DishPopup
          dish={selectedDish}
          onClose={() => setSelectedDish(null)}
          onAddToCart={addToCart}
        />
      )}

      {isLoginModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <img src="../pic/x-mark.png" alt="" className="close-modal" onClick={() => setIsLoginModalOpen(false)} />
            <LoginForm />
          </div>
        </div>
      )}

      {isOrderModalOpen && (
        <OrderModal onClose={handleOrderModalClose} />
      )}
    </>
  );
}

export default Pickup;
