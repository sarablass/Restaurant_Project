import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { userContext } from '../Components/App';
import LoginForm from '../Pages/LoginForm';
import '../css/tableOrdering.css';
import HomeHeader from '../Components/HomeHeader';

function TableOrdering() {
  const { user } = useContext(userContext);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [numSeats, setNumSeats] = useState(2);
  const [availableTables, setAvailableTables] = useState([]);
  const [searchClicked, setSearchClicked] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const navigate = useNavigate();

  // useEffect(() => {
  //   const currentHour = new Date().getHours();
  //   const initialTime = currentHour < 11 ? '11:00' : `${String(currentHour).padStart(2, '0')}:00`;
  //   setTime(initialTime);
  //   setDate(new Date().toISOString().split('T')[0]);
  // }, []);

  useEffect(() => {
    const currentDate = new Date();
    const currentHour = currentDate.getHours();
    const currentMinute = currentDate.getMinutes();
    
    let initialTime;
    if (currentHour < 11) {
      initialTime = '11:00';
    } else {
      // מעגל לרבע השעה הקרוב
      const roundedMinute = Math.round(currentMinute / 15) * 15;
      const adjustedHour = roundedMinute === 60 ? currentHour + 1 : currentHour;
      const adjustedMinute = roundedMinute === 60 ? 0 : roundedMinute;
      
      initialTime = `${String(adjustedHour).padStart(2, '0')}:${String(adjustedMinute).padStart(2, '0')}`;
    }
    
    setTime(initialTime);
    setDate(currentDate.toISOString().split('T')[0]);
  }, []);


  const fetchAvailableTables = async () => {
    try {
      const response = await fetch(`http://localhost:3000/orderingTables/available?date=${date}&time=${time}&numSeats=${numSeats}`);
      const data = await response.json();
      setAvailableTables(data);
      setSearchClicked(true);
    } catch (error) {
      console.error('Error fetching available tables:', error);
    }
  };

  const getNext14Days = () => {
    const days = [];
    const options = { weekday: 'short', day: 'numeric', month: 'numeric' };

    for (let i = 0; i < 14; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      const formattedDate = date.toLocaleDateString('he-IL', options).replace('יום ', '');
      const valueDate = date.toISOString().split('T')[0];
      const weekday = date.getDay();

      if (weekday !== 6) {
        days.push({ formattedDate, valueDate });
      }
    }
    return days;
  };

  const getTimeIntervals = (selectedDate) => {
    const intervals = [];
    const now = new Date();
    const isToday = now.toDateString() === selectedDate.toDateString();
    const isFriday = selectedDate.getDay() === 5;
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    let start = 11 * 4;
    let end = 22 * 4;

    if (isFriday) {
      end = 13 * 4;
    }

    if (isToday) {
      start = currentHour < 11 ? 11 * 4 : currentHour * 4 + Math.floor(currentMinute / 15) + 1;
    }

    for (let i = start; i <= end; i++) {
      const hours = String(Math.floor(i / 4)).padStart(2, '0');
      const minutes = String((i % 4) * 15).padStart(2, '0');
      intervals.push(`${hours}:${minutes}`);
    }
    return intervals;
  };

  const handleDateChange = (e) => {
    const selectedDate = new Date(e.target.value);
    setDate(e.target.value);

    const now = new Date();
    const isToday = now.toDateString() === selectedDate.toDateString();

    if (!isToday) {
      setTime('11:00');
    } else {
      const currentHour = now.getHours();
      const initialTime = currentHour < 11 ? '11:00' : `${String(currentHour).padStart(2, '0')}:00`;
      setTime(initialTime);
    }
  };

  const handleTableSelect = (table) => {
    if (!user) {
      setShowLoginModal(true);
      return;
    }
    navigate('/table-details', {
      state: { date, time, numSeats, table }
    });
  };

  const insideTables = availableTables.filter(table => table.inside);
  const outsideTables = availableTables.filter(table => !table.inside);
  return (
    <>
      <HomeHeader />
      <div className="logo-container">
        <img src="../pic/kafe_dania_logo.png" className="logo" alt="קפה דניה" />
      </div>
      <img src="../pic/ארוחת בוקר.png" className="pic-wine" alt="" />
      <div className="table-ordering-container">
        <h2 className='table-ordering-title'>Super Coffee</h2>
        <div className="table-ordering-form">
          <div className="form-group">
            <label>
              <span className="option-icon">📅</span>
              <select value={date} onChange={handleDateChange}>
                {getNext14Days().map(day => (
                  <option key={day.valueDate} value={day.valueDate}>{day.formattedDate}</option>
                ))}
              </select>
            </label>
          </div>
          <div className="form-group">
            <label>
              <span className="option-icon">🕒</span>
              <select value={time} onChange={(e) => setTime(e.target.value)}>
                {getTimeIntervals(new Date(date)).map(interval => (
                  <option key={interval} value={interval}>{interval}</option>
                ))}
              </select>
            </label>
          </div>
          <div className="form-group">
            <label>
              <span className="option-icon">👥</span>
              <select value={numSeats} onChange={(e) => setNumSeats(e.target.value)}>
                {[...Array(10)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>{i + 1} אורחים</option>
                ))}
              </select>
            </label>
          </div>
        </div>
        <button className='checking-button' onClick={fetchAvailableTables}>חפש</button>
        {searchClicked && (
          <div className="available-tables">
            <div className="tables-section">
              <div className="section-title">
                <img src="../pic/window.png" className="icon" alt="" />
                <span>בפנים</span>
              </div>
              <div className="tables-row">
                {insideTables.map(table => (
                  <div key={table.id} className="table-card" onClick={() => handleTableSelect(table)}>
                    <p>שולחן #{table.id}</p>
                    <p>מספר מקומות: {table.numSeats}</p>
                    <p>בתוך המסעדה</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="tables-section">
              <div className="section-title">
                <img src="../pic/terrace.png" className="icon" alt="" />
                <span>בחוץ</span>
              </div>
              <div className="tables-row">
                {outsideTables.map(table => (
                  <div key={table.id} className="table-card" onClick={() => handleTableSelect(table)}>
                    <p>שולחן #{table.id}</p>
                    <p>מספר מקומות: {table.numSeats}</p>
                    <p>בחוץ</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
      {showLoginModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <img src="../pic/x-mark.png" alt="" className="close-modal" onClick={() => setShowLoginModal(false)} />
            <LoginForm />
          </div>
        </div>
      )}
    </>
  );
}

export default TableOrdering;
