import React, { useState } from 'react';
import '../css/contactUs.css';
import HomeHeader from '../Components/HomeHeader';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhone, faEnvelope, faCamera, faBook } from '@fortawesome/free-solid-svg-icons';


const ContactUs = () => {
  const [contactInfo, setContactInfo] = useState({
    name: '',
    phone: '',
    email: '',
    reason: '',
    message: ''
  });

  const handleContactEmail = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/send-contact-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(contactInfo)
      });

      if (response.ok) {
        alert('הפניה נשלחה בהצלחה למייל של המסעדה');
        setContactInfo({
          name: '',
          phone: '',
          email: '',
          reason: '',
          message: ''
        });
      } else {
        throw new Error('נכשל בשליחת הפניה');
      }
    } catch (error) {
      console.error('שגיאה בשליחת הפניה:', error);
      alert('נכשל בשליחת הפניה');
    }
  };

  const handleNewsletterSignup = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/send-email-newSletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: contactInfo.email })
      });

      if (response.ok) {
        alert('נרשמת בהצלחה לניוזלייטר!');
        setContactInfo({ ...contactInfo, email: '' });
      } else {
        throw new Error('נכשל בהרשמה לניוזלייטר');
      }
    } catch (error) {
      console.error('שגיאה בהרשמה לניוזלייטר:', error);
      alert('נכשל בהרשמה לניוזלייטר');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setContactInfo({ ...contactInfo, [name]: value });
  };

  return (
    <>
      <HomeHeader />
      <div className="cu-page">
        <div className="cu-right-side">
          <h2 className="cu-title">בואו נדבר</h2>
          <div className="cu-contact-info">
            <div className="cu-contact-item">
              <span className="cu-icon">📞</span>
              <p className="cu-phone">03-7311311</p>
            </div>
            <div className="cu-contact-item">
              <span className="cu-icon">✉️</span>
              <p className="cu-email">office@landwercafe.co.il</p>
            </div>
            <div className="cu-contact-item">
              <span className="cu-social-icon">📷</span>
              <p className="cu-social-link">Instagram</p>
            </div>
            <div className="cu-contact-item">
              <span className="cu-social-icon">📘</span>
              <p className="cu-social-link">Facebook</p>
            </div>
            <br />
            <div className="cu-address">
              <h3>משרדי דניה</h3>
              <p>רח' יפו 2, ירושלים 1700704407</p>
            </div>
            <br />
            <div className="cu-newsletter">
              <h4>הרשמה לניוזלטר</h4>
              <br />
              <input
                type="email"
                placeholder="* אימייל"
                className="cu-input-line"
                value={contactInfo.email}
                onChange={handleInputChange}
                name="email"
              />
              <button onClick={handleNewsletterSignup} className="cu-submit-button-mail">הרשמה</button>
            </div>
          </div>
        </div>
        <div className="cu-form-container">
          <h2 className="cu-title">איך נוכל לעזור</h2>
          <form className="cu-form">
            <div className="cu-form-group">
              <label htmlFor="name" className="cu-label">* שם מלא</label>
              <input
                type="text"
                id="name"
                className="cu-input-line"
                value={contactInfo.name}
                onChange={handleInputChange}
                name="name"
                required
              />
            </div>
            <div className="cu-form-group">
              <label htmlFor="phone" className="cu-label">* טלפון</label>
              <input
                type="tel"
                id="phone"
                className="cu-input-line"
                value={contactInfo.phone}
                onChange={handleInputChange}
                name="phone"
                required
              />
            </div>
            <div className="cu-form-group">
              <label htmlFor="email" className="cu-label">* אימייל</label>
              <input
                type="email"
                id="email"
                className="cu-input-line"
                value={contactInfo.email}
                onChange={handleInputChange}
                name="email"
                required
              />
            </div>
            <div className="cu-form-group">
              <label htmlFor="reason" className="cu-label">* סיבת ההתקשרות</label>
              <select
                id="reason"
                className="cu-input-line cu-select"
                value={contactInfo.reason}
                onChange={handleInputChange}
                name="reason"
                required
              >
                <option value="">בחר סיבה</option>
                <option value="פרגון">פרגון</option>
                <option value="דרושים">דרושים</option>
                <option value="זכיינות">זכיינות</option>
                <option value="אירועים">אירועים</option>
                <option value="שירות ומסעדה">שירות ומסעדה</option>
                <option value="אחר">אחר</option>
              </select>
            </div>
            <div className="cu-form-group">
              <label htmlFor="message" className="cu-label">הודעה</label>
              <textarea
                id="message"
                className="cu-input-line cu-textarea"
                value={contactInfo.message}
                onChange={handleInputChange}
                name="message"
              ></textarea>
            </div>
            <div className="cu-file-upload">
              <label className="cu-file-label" htmlFor="file-upload">הוספת קובץ</label>
              <input type="file" id="file-upload" className="cu-file-input" />
            </div>
            <button type="submit" onClick={handleContactEmail} className="cu-submit-button">שלח</button>
          </form>
        </div>
      </div>
    </>
  );
}

export default ContactUs;
