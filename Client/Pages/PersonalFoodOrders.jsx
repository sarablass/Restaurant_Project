import React, { useContext, useEffect, useState } from 'react';
import { userContext } from '../Components/App';
import moment from 'moment';
import 'moment/locale/he';
import '../css/personalFoodOrders.css';

const PersonalFoodOrders = () => {
  const { user } = useContext(userContext);
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    moment.locale('he');
    if (user) {
      fetchOrders();
    }
  }, [user]);

  const fetchOrders = () => {
    fetch(`http://localhost:3000/user-orders/${user.id}`, { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        console.log('Received orders:', data);
        setOrders(data);
      })
      .catch(err => console.error('Error fetching orders:', err));
  };

  const handleOrderClick = (order) => {
    setSelectedOrder(order);
  };

  const handleCloseModal = () => {
    setSelectedOrder(null);
  };

  return (
    <div className="personal-food-orders">
      <div className="orders-list-food">
        {orders.map(order => (
          <div key={order.orderId} className="order-item-food" onClick={() => handleOrderClick(order)}>
            <div className="order-details">
              <div className="order-info">תאריך: {moment(order.orderDate).format('DD/MM/YYYY')}</div>
              <div className="order-info">שעה: {moment(order.orderTime, 'HH:mm:ss').format('HH:mm')}</div>
              <div className="order-info">{order.payment} ₪</div>
              <img  src="../pic/serving-dish.png" className='serving-icon' />
            </div>
          </div>
        ))}
      </div>

      {selectedOrder && (
        <div className="modal-food">
          <div className="modal-content-food">
            <h2>פרטי ההזמנה</h2>
            <div className="order-datetime">
              <span>תאריך ההזמנה: {moment(selectedOrder.orderDate).format('DD/MM/YYYY')}</span>
              <span className='span-food'>שעה: {moment(selectedOrder.orderTime, 'HH:mm:ss').format('HH:mm')}</span>
            </div>
            <ul className="order-dishes">
              {selectedOrder.dishes.map(dish => (
                <li key={dish.dishId} className="dish-item-food">
                  <div className="dish-details">
                    <span className="dish-name">{dish.dishName}</span>
                    <span className="dish-price">מחיר: {dish.price} ₪</span>
                    <span className="dish-amount">כמות: {dish.amount}</span>
                  </div>
                  <div className="dish-image-food">
                    <img src={`http://localhost:3000/images/${dish.imageUrl}`} alt={dish.dishName} />
                  </div>
                </li>
              ))}
            </ul>
            <p className="total-payment">סכום כולל: {selectedOrder.payment} ₪</p>
            <button onClick={handleCloseModal} className="close-button">סגור</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PersonalFoodOrders;