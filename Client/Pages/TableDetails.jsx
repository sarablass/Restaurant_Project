import React, { useContext, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { userContext } from '../Components/App';
import '../css/tableDetails.css';
import HomeHeader from '../Components/HomeHeader';

const TableDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { date, time, numSeats, table } = location.state || {};
  const { user } = useContext(userContext);

  const [formData, setFormData] = useState({
    numTable: table?.id || '',
    username: user?.username || '',
    email: user?.email || '',
    phone: user?.phone || '',
    orderDate: date || '',
    orderTime: time || '',
    numSeats: numSeats || ''
  });

  const [showPopup, setShowPopup] = useState(false);
  const [showConfirmationPopup, setShowConfirmationPopup] = useState(false);
  const [orderingTableId, setOrderingTableId] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSaveOrderingTable = () => {
    fetch('http://localhost:3000/orderingTables', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: '',
        ...formData,
        userId: user.id,
      }),
    })
      .then(response => response.json())
      .then(newOrder => {
        console.log(newOrder.id);
        setOrderingTableId(newOrder.id);
        setShowPopup(true);
      })
      .catch(error => console.error('Error adding order:', error));
  };

  const handleYesClick = () => {
    setShowPopup(false);
    navigate('/Pickup', { state: { orderingTableId , date , time} });
  };

  const handleNoClick = () => {
    setShowPopup(false);
    setShowConfirmationPopup(true);
  };

  const handleCloseConfirmationPopup = () => {
    setShowConfirmationPopup(false);
    navigate('/');
  };

  return (
    <>
      <HomeHeader/>
      <div className="table-details-container">
        <h2 className="table-details-title">Super Coffee</h2>
        <div className="table-details-form">
          <div className="form-group">
            <label>מספר שולחן:</label>
            <input
              type="text"
              name="numTable"
              value={formData.numTable}
              onChange={handleInputChange}
              readOnly
            />
          </div>
          <div className="form-group">
            <label>תאריך:</label>
            <input
              type="date"
              name="orderDate"
              value={formData.orderDate}
              onChange={handleInputChange}
              readOnly
            />
          </div>
          <div className="form-group">
            <label>שעה:</label>
            <input
              type="time"
              name="orderTime"
              value={formData.orderTime}
              onChange={handleInputChange}
              readOnly
            />
          </div>
          <div className="form-group">
            <label>שם משתמש:</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              readOnly
            />
          </div>
          <div className="form-group">
            <label>אימייל:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label>טלפון:</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label>כמות אורחים:</label>
            <input
              type="text"
              name="numSeats"
              value={formData.numSeats}
              readOnly
            />
          </div>
          <div className="form-group">
            <label>אזור ישיבה:</label>
            <input type="text" value={table?.inside ? 'בפנים' : 'בחוץ'} readOnly />
          </div>
          <button className="submit-button" onClick={handleSaveOrderingTable}>
            שליחת הזמנה
          </button>
        </div>

        {showPopup && (
          <div>
            <div className="popup-background"></div>
            <div className="popup">
              <h3 className='popup-h3'>שלום {formData.username}!</h3>
              <br/>
              <p className='popup-p'>הזמנתך לתאריך {formData.orderDate} בשעה {formData.orderTime} <br/>בוצעה בהצלחה.</p>
              <br/>
              <p className='popup-p'>האם תרצה שהאוכל יחכה לך מוכן על השולחן?</p>
              <button className='btnTable' onClick={handleYesClick}>כן</button>
              <button className='btnTable' onClick={handleNoClick}>לא תודה, סיים הזמנה</button>
            </div>
          </div>
        )}

        {showConfirmationPopup && (
          <div>
            <div className="popup-background"></div>
            <div className="popup">
              <h3 className='popup-h3'>הזמנתך התקבלה בהצלחה!</h3>
              <button className='btnTable' onClick={handleCloseConfirmationPopup}>סגור</button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default TableDetails;
