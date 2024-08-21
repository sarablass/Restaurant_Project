import React from 'react';
import '../css/footer.css';

const Footer = () => {
    return (
        <div className="footer">
            <div className="footer-section">
                <h2>צור קשר</h2>
                <p>שירות לקוחות 1700704407</p>
                <p>דברו איתנו</p>
                <div className="social-icons">
                    <i className="fab fa-whatsapp"></i>
                    <i className="fab fa-tiktok"></i>
                    <i className="fab fa-facebook"></i>
                    <i className="fab fa-instagram"></i>
                </div>
            </div>
            <div className="footer-section">
                <ul>
                    <li>כתבו עלינו</li>
                    <li>אירועים</li>
                    <li>זכיינים</li>
                    <li>מפת אתר</li>
                    <li>הסדרי נגישות לסניפים</li>
                    <li>הסדרי נגישות לסניפי מאמא וקרטישן</li>
                    <li>הצהרת נגישות</li>
                </ul>
            </div>
            <div className="footer-section">
                <ul>
                    <li>תפריטים</li>
                    <li>סניפים</li>
                    <li>משלוחים</li>
                    <li>מועדון הלקוחות</li>
                    <li>גיפט כארד</li>
                    <li>המפעלים שלנו</li>
                </ul>
            </div>
            
        </div>
    );
};

export default Footer;
