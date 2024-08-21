import React from 'react';
import HomeHeader from '../Components/HomeHeader';
import '../css/about.css';
import Footer from '../Components/Footer';

function About() {
  return (
    <>
      <HomeHeader />
      <div className="about-container">
        <div className="about-content">
          
          <div className="about-text">
            <p>
              הרשת לא קופאת על שמריה וממשיכה לגעת, להתחדש ולהרגיש
              את הלקוחות בכל רגע מחדש. ע"י הקפדה מתמדת על השף
              והקונדיטור שלה, על איכות חומרי הגלם ועל ערכים משפחתיים
              ונשיאותיים רבת, העסקים, האופים והטבחים מבשלים
              מאכלים מכל העולם.
            </p>
            <p>
              היא על כן מהווה את אחת מתקת גורמה המתמחה בנתחי איכות
              מובחרים ומקפידה על האיכות תוצרת השף עידן אלירן. השף עידן
              מתמחה ביצירת אסקלין, אסייתי, אמריקאי, צרפתי ושוויצרי, בסגנון,
              מספרי ובסגנון ישראלי.
            </p>
          </div>
          <div className="about-image">
            <img src={"../pic/About1.jpg"} alt="About1" />
          </div>
        </div>
        <div className="about-content">
        <div className="about-image">
            <img src={"../pic/About2.jpg"} alt="About2" />
          </div>
          <div className="about-text">
            <p>
              בנוסף, העסקים השונים של הרשת המקומית והבינלאומית, כול
              נושאת האחריות הגדולה של האחים המופקים למנהלים
              שלווה, אנו משתמשים בתוכניות החומרים והחברים ובין
              אשר מיוצרים במפעלים שלנו באזור. כמו כן, הכניסו
              פעילים ומרוצים והינם משתמשים מבחינת המזון המובחר ביותר בעולם
              מחלפים חלק מהתוכניות הגליליות.
            </p>
          </div>
         
        </div>
      </div>
      <Footer/>
    </>
  );
}

export default About;