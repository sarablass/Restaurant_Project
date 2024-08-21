
import React, { useContext, useEffect, useState } from 'react';
import { userContext } from '../Components/App';
import '../css/personalTableOrders.css';

const PersonalTableOrders = () => {
    const { user } = useContext(userContext);
    const [reservations, setReservations] = useState([]);
    const [selectedOrderDetails, setSelectedOrderDetails] = useState(null);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [reservationToDelete, setReservationToDelete] = useState(null);

    useEffect(() => {
        if (user) {
            fetchReservations();
        }
    }, [user]);

    const fetchReservations = () => {
        fetch(`http://localhost:3000/user-reservations/${user.id}`, {
            credentials: 'include'
        })
            .then(res => res.json())
            .then(data => {
                console.log('Fetched reservations:', data);
                setReservations(data);
            })
            .catch(err => console.error('Error fetching reservations:', err));
    };

    const fetchOrderDetails = (orderId) => {
        fetch(`http://localhost:3000/order-details/${orderId}`, {
            credentials: 'include'
        })
            .then(res => res.json())
            .then(data => setSelectedOrderDetails(data))
            .catch(err => console.error('Error fetching order details:', err));
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
        return new Date(dateString).toLocaleDateString('en-GB', options);
    };

    const canDeleteReservation = (reservation) => {
        const now = new Date();

        // פיצול התאריך והשעה
        const [date, time] = reservation.orderDate.split('T');

        // יצירת אובייקט Date מהתאריך והשעה של ההזמנה
        const reservationDate = new Date(`${date}T${reservation.orderTime}`);

        // חישוב ההפרש בזמן
        const timeDiff = reservationDate.getTime() - now.getTime();
        const thirtyMinutesInMs = 30 * 60 * 1000;

        console.log(`
            Reservation: ${reservationDate}
            Now: ${now}
            Time Difference (minutes): ${timeDiff / (60 * 1000)}
            Can Delete: ${timeDiff > thirtyMinutesInMs}
        `);

        return timeDiff > thirtyMinutesInMs;
    };

    const handleDeleteClick = (reservation) => {
        setReservationToDelete(reservation);
        setShowDeleteConfirmation(true);
    };

    const confirmDelete = () => {
        console.log('Confirming delete for reservation:', reservationToDelete);
        if (reservationToDelete) {
            fetch(`http://localhost:3000/user-reservations/${reservationToDelete.orderId}`, {
                method: 'DELETE',
                credentials: 'include'
            })
                .then(res => {
                    console.log('Delete response:', res);
                    if (res.ok) {
                        console.log('Deletion successful, fetching new reservations');
                        fetchReservations();
                        setShowDeleteConfirmation(false);
                    } else {
                        throw new Error('Failed to delete reservation');
                    }
                })
                .catch(err => {
                    console.error('Error deleting reservation:', err);
                    alert('Failed to delete reservation. Please try again.');
                });
        } else {
            console.error('No reservation to delete');
        }
    };

    return (
        <div className="personal-table-orders">
            <ul className="reservation-list">
                {reservations.map(reservation => (
                    <li key={reservation.orderId} className="reservation-item">
                        <div>תאריך: {formatDate(reservation.orderDate)}</div>
                        <div>שעה: {reservation.orderTime}</div>
                        <div>מיקום השולחן: {reservation.tableInside ? 'בפנים' : 'בחוץ'}</div>
                        <div>כמות מושבים בהזמנה: {reservation.orderNumSeats}</div>
                        <br />
                        {reservation.hasFoodOrders && (
                            <div>
                                <button className='btn-pic' onClick={() => fetchOrderDetails(reservation.orderId)}>
                                    <img src="../pic/dining-table.png" className='table-icon' alt="Table icon" />
                                </button>
                            </div>
                        )}
                        {canDeleteReservation(reservation) && (
                            <button onClick={() => handleDeleteClick(reservation)} className="delete-btn">מחק הזמנה</button>
                        )}
                    </li>
                ))}
            </ul>
            {selectedOrderDetails && (
                <div className="order-details-overlay">
                    <div className="order-details-popup">
                        <div className="order-details-content">
                            <div className='bold'>תאריך ההזמנה: {formatDate(selectedOrderDetails[0].orderDate)}</div>
                            <div className='bold'>שעה: {selectedOrderDetails[0].orderTime}</div>
                            <ul className='order-details'>
                                {selectedOrderDetails.map((dish, index) => (
                                    <React.Fragment key={index}>
                                        <li className="dish-item">
                                            <div>שם המנה: {dish.dishName}</div>
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
                            <div className='bold'>סכום כולל: ₪{selectedOrderDetails[0].totalPayment}</div>
                            <button onClick={() => setSelectedOrderDetails(null)} className="close-btn">סגור</button>
                        </div>
                    </div>
                </div>
            )}
            {showDeleteConfirmation && (
                <div className="delete-confirmation-overlay">
                    <div className="delete-confirmation-popup">
                        <p>האם אתה בטוח שברצונך למחוק את ההזמנה?</p>
                        <button onClick={confirmDelete}>כן</button>
                        <button onClick={() => setShowDeleteConfirmation(false)}>לא</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default PersonalTableOrders;