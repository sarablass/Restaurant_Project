import React, { useEffect, useState, useContext } from 'react';
import HomeHeader from '../Components/HomeHeader';
import { useNavigate } from 'react-router-dom';
import { userContext } from '../Components/App';
import '../css/openTables.css';

const OpenTables = () => {
    const [tables, setTables] = useState([]);
    const [selectedTable, setSelectedTable] = useState(null);
    const [lastOrder, setLastOrder] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const { user } = useContext(userContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (user?.idUserType !== 2) {
            console.error('Access denied: Only waiter can view this page.');
            navigate('/home');
            return;
        }

        fetchTables();
    }, [user]);

    const fetchTables = async () => {
        try {
            const response = await fetch('http://localhost:3000/orderingTablesCurrent/availableCurrent', { credentials: 'include' });
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            console.log(data);
            setTables([...data]);
        } catch (err) {
            console.error('Error fetching tables:', err);
        }
    };

    const fetchLastOrder = async (tableId) => {
        setIsLoading(true);
        try {
            const response = await fetch(`http://localhost:3000/orderingFood/${tableId}`, { credentials: 'include' });
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            console.log('Fetched last order:', data);
            setLastOrder(data || null);
        } catch (err) {
            console.error(`Error fetching order for table ${tableId}:`, err);
            setLastOrder(null);
        } finally {
            setIsLoading(false);
        }
    };

    const handleClick = async (table) => {
        setSelectedTable(table);
        if (table.isOccupied) {
            await fetchLastOrder(table.id);
        } else {
            setLastOrder(null);
        }
    };

    const handleReservationSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const reservationDetails = Object.fromEntries(formData.entries());

        const currentDate = new Date();
        reservationDetails.orderDate = currentDate.toISOString().split('T')[0];
        reservationDetails.orderTime = currentDate.toTimeString().split(' ')[0];
        reservationDetails.userId = user.id;
        if (user?.idUserType !== 2) {
            console.error('Access denied: Only admins can view this page.');
            return;
        }
        try {
            const response = await fetch('http://localhost:3000/orderingTables', {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(reservationDetails)
            });

            if (response.ok) {
                await fetchTables();
                setSelectedTable(null);
            } else {
                console.error('Failed to make reservation');
            }
        } catch (err) {
            console.error('Error submitting reservation:', err);
        }
    };

    const handleFreeTable = async () => {
        try {
            const response = await fetch(`http://localhost:3000/orderingTables/${selectedTable.orderingTableId}`, {
                method: 'PUT',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ statusTable: '1' })
            });
            if (response.ok) {
                await fetchTables();
                setSelectedTable(null);
                setLastOrder(null);
            } else {
                console.error('Failed to free table');
            }
        } catch (err) {
            console.error('Error freeing table:', err);
        }
    };

    const handleOrderClick = () => {
        navigate('/pickup', { state: { orderingTableId: selectedTable.orderingTableId } });
    };

    const getOrderStatus = (status) => {
        switch (status) {
            case '1':
                return 'הזמנתך בטיפול';
            case '2':
                return 'הזמנתך בהכנה';
            case '3':
                return 'הזמנתך מוכנה';
            default:
                return 'סטטוס לא ידוע';
        }
    };

    const handlePayOrder = async () => {
        try {
            const response = await fetch(`http://localhost:3000/updateOrderingFood/${lastOrder.id}`, {
                method: 'PUT',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ payUp: true })
            });
            if (response.ok) {
                // Update the payUp status locally to reflect the change
                setLastOrder(prevOrder => ({ ...prevOrder, payUp: true }));
            } else {
                console.error('Failed to mark order as paid');
            }
        } catch (err) {
            console.error('Error marking order as paid:', err);
        }
    };

    return (
        <>
            <HomeHeader />
            <div className="table-map">
                {tables.map(table => (
                    <div key={table.id} className="table-item">
                        <p className="table-id">{table.id}</p>
                        <img src="../pic/people.png" alt="Table" className='round-table-pic' />
                        <div onClick={() => handleClick(table)} className={`table-details ${table.isOccupied ? 'occupied' : 'available'}`}>
                            <p>Seats: {table.numSeats}</p>
                            <p>{table.inside ? 'Inside' : 'Outside'}</p>
                        </div>
                    </div>
                ))}
            </div>
            {isLoading && <div className="loading">טוען...</div>}
            {selectedTable && (
                <div className="category-popup-overlay">
                    <div className="category-popup-content">
                        {selectedTable.isOccupied ? (
                            <div>
                                <button className="category-popup-close" onClick={() => setSelectedTable(null)}>
                                    <img src="../pic/x-mark.png" alt="" className="close-modal" />
                                </button>
                                {lastOrder !== null ? (
                                    <div className="last-order-details">
                                        <h3>פרטי הזמנה:</h3>
                                        <p>תשלום: {lastOrder.payment} ₪</p>
                                        <button
                                            className="payment-button"
                                            onClick={handlePayOrder}
                                            disabled={lastOrder.payUp}
                                            style={{ backgroundColor: lastOrder.payUp ? 'gray' : '#4f937e' }}
                                        >
                                            שולם
                                        </button>
                                        {lastOrder.payUp ? (
                                            <span className="payment-confirmation">✔️</span>
                                        ) : (
                                            <span className="payment-failure">❌</span>
                                        )}
                                        <p>סטטוס הזמנה: {getOrderStatus(lastOrder.statusOrder)}</p>
                                    </div>
                                ) : (
                                    <p className="title-empty-order">אין הזמנות!</p>
                                )}
                                <button
                                    className="category-popup-free"
                                    onClick={handleFreeTable}
                                    disabled={lastOrder && !lastOrder.payUp}
                                    style={{
                                        backgroundColor: lastOrder && !lastOrder.payUp ? 'gray' : 'rgba(244, 13, 132, 0.2)',
                                        cursor: lastOrder && !lastOrder.payUp ? 'not-allowed' : 'pointer'
                                    }}
                                >
                                    פנוי
                                </button>

                                <button className="category-popup-order" onClick={handleOrderClick}>
                                    הזמנת מנות
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleReservationSubmit}>
                                <h2 className='title-orderTable'>הזמנת שולחן</h2>
                                <input type="hidden" name="numTable" value={selectedTable.id} />
                                <label>מספר אורחים:</label>
                                <input type="number" name="numSeats" required className="category-popup-input" min="1" max={selectedTable.numSeats} />
                                <div className="category-popup-buttons">
                                    <button type="submit" className="category-popup-save">
                                        אישור
                                    </button>
                                    <button type="button" onClick={() => setSelectedTable(null)} className="category-popupC ">
                                        סגור
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            )}

        </>
    );
}

export default OpenTables;
