import React from 'react';
import HomeHeader from './HomeHeader';
import Footer from './Footer';
import '../css/homeHeader.css';


const HomeLayout = () => {
    return (
        <>
            <HomeHeader />
            
            <video
                src="/pic/vid-home.mp4"
                type="video/mp4"
                autoPlay
                muted
                loop
                className="video-full-width"
            />
            <div className="text-container">
                <div className="invitation-text">
                    מזמינים אתכם לחוויה מפנקת של טעמים איכותיים מכל העולם
                </div>
                <div className="breakfast-section">
                    <img src="/pic/home1.png" alt="ארוחות הבוקר שלנו" className="breakfast-image" />
                    <div className="breakfast-text">
                        <h2> ארוחות<br></br> הבוקר שלנו  </h2>
                        <p>
                            תפריט ארוחות הבוקר שלנו הוא עשיר ומגוון ומציע שפע של טעמים, מטבחים ושילובים שונים.
                        <br></br>    תפריט ארוחת הבוקר שלנו משלב מנות מהעולם האיטלקי, אסייתי, אמריקאי, בלקני, שוויצרי, מקסיקני, ספרדי וכמובן ישראלי.
                            <br></br>רשת גרג דואגת תמיד לספק ללקוחותיה חוויה קולינארית מפנקת שמתאימה לכל לקוח ולקוח.<br></br>
                            ארוחות הבוקר מוגשות לאורך כל היום, האני מאמין שלנו הוא שאין שעה לארוחת בוקר טובה ועשירה.
                        </p>
                    </div>
                </div>
                <div className="coffee-section">
                    <div className="coffee-text">
                        <h2>הקפה שלנו</h2>
                        <p>
                            עם מעל ל - 20 תערובות אספרסו ייחודית ובלעדיות לרשת, רשת גרג בידלה את עצמה עם תערובות המובססות על זן ערביקה מקולומביה,
                            ברזיל ואתיופיה האיכותיים, הטובות והמיוחדות בעולם.
                        </p>
                    </div>
                    <img src="/pic/home3.png"  alt="הקפה שלנו" className="coffee-image" />
        
                </div>
            </div>
            <Footer />
        </>
    );
};

export default HomeLayout;
