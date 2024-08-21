import React, { useEffect, useState, useContext } from 'react';
import HomeHeader from '../Components/HomeHeader';
import { userContext } from '../Components/App';
import Modal from 'react-modal';
import { useNavigate } from 'react-router-dom';
import '../css/chefPage.css';

const ChefPage = () => {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const { user } = useContext(userContext);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedOrderDetails, setSelectedOrderDetails] = useState(null);

    useEffect(() => {
        if (user?.idUserType !== 4) {
            console.error('Access denied: Only chef can view this page.');
            navigate('/home');
            return;
        }

        fetchOrders();
    }, [user]);

    const fetchOrders = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('http://localhost:3000/chef/active', { credentials: 'include' });
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            setOrders(data);
        } catch (err) {
            console.error('Error fetching orders:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchOrderDishes = async (orderId) => {
        try {
            const response = await fetch(`http://localhost:3000/dishesInOrder/${orderId}/dishes`, { credentials: 'include' });
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            setSelectedOrderDetails(data);
        } catch (err) {
            console.error('Error fetching order dishes:', err);
        }
    };

    const updateOrderStatus = async (orderId, newStatus) => {
        try {
            const response = await fetch(`http://localhost:3000/chef/${orderId}`, {
                method: 'PUT',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ statusOrder: newStatus })
            });
            if (response.ok) {
                await fetchOrders();
            } else {
                console.error('Failed to update order status');
            }
        } catch (err) {
            console.error('Error updating order status:', err);
        }
    };

    const getOrderBackground = (status) => {
        switch (status) {
            case '1': return '#f8f8f8';
            case '2': return '#ffebd5';
            case '3': return '#d0ebff';
            default: return '#fff';
        }
    };

    const renderOrderButtons = (order) => {
        return (
            <div className="button-container">
                {order.statusOrder === '1' && (
                    <button onClick={() => updateOrderStatus(order.id, '2')} className="order-button">
                        המנה בהכנה
                    </button>
                )}
                {order.statusOrder === '2' && (
                    <button onClick={() => updateOrderStatus(order.id, '3')} className="order-button">
                        המנה מוכנה
                    </button>
                )}
                <button onClick={() => fetchOrderDishes(order.id)} className="second-button">
                    מנות
                </button>
            </div>
        );
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
        return new Date(dateString).toLocaleDateString('he-IL', options);
    };

    const formatTime = (timeString) => {
        return timeString.slice(0, 5); // Assumes time is in HH:MM:SS format
    };

    const renderStatusGraph = (status, orderTime) => {
        const stages = ['נקלטה', 'בהכנה', 'מוכנה'];
        const currentStage = parseInt(status);

        return (
            <div className="status-graph">
                {stages.map((stage, index) => (
                    <React.Fragment key={index}>
                        <div className={`status-point ${index + 1 <= currentStage ? 'active' : ''}`}>
                            <div className="status-label">{stage}</div>
                            {index + 1 === currentStage && (
                                <div className="status-time">{orderTime}</div>
                            )}
                        </div>
                        {index < stages.length - 1 && (
                            <div className={`status-line ${index + 1 < currentStage ? 'active' : ''}`}></div>
                        )}
                    </React.Fragment>
                ))}
            </div>
        );
    };

    return (
        <>
            <HomeHeader />
            <div className="chef-page">
                {isLoading ? (
                    <div className="loading">טוען...</div>
                ) : (
                    <div className="orders-list">
                        {orders.map(order => (
                            <div 
                                key={order.id} 
                                className="order-item" 
                                style={{ backgroundColor: getOrderBackground(order.statusOrder) }}
                            >
                                <img src={'../pic/paperclip.png'} alt="paper clip" className="paper-clip-image" />
                                <h3 className='title-idChef'>הזמנה מספר: {order.id}</h3>
                                <p>תאריך: {formatDate(order.orderDate)}</p>
                                <p>שעה: {formatTime(order.orderTime)}</p>
                                <p>סכום לתשלום: {order.payment} ₪</p>
                                {renderStatusGraph(order.statusOrder, formatTime(order.orderTime))}
                                
                                {renderOrderButtons(order)}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {selectedOrderDetails && (
                <div className="order-details-overlay">
                    <div className="order-details-popup">
                        <div className="order-details-content">
                            <ul className='order-details'>
                                {selectedOrderDetails.map((dish, index) => (
                                    <React.Fragment key={index}>
                                        <li className="dish-item">
                                            <div>{dish.dishName}</div>
                                            <div>מחיר: ₪{dish.price}</div>
                                            <div>כמות: {dish.amount}</div>
                                            <div className="dish-image-table">
                                                <img src={`http://localhost:3000/images/${dish.imageUrl}`} alt={dish.dishName} />
                                            </div>
                                        </li>
                                        {index < selectedOrderDetails.length - 1 && <hr className="divider" />}
                                    </React.Fragment>
                                ))}
                            </ul>
                    
                            <button onClick={() => setSelectedOrderDetails(null)} className="close-btn">סגור</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ChefPage;
