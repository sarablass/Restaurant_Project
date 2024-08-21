
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { userContext } from '../Components/App';
import Modal from 'react-modal';
import '../css/loginForm.css';

Modal.setAppElement('#root');

function SignUpForm({ toggleModal, switchToLogin }) {
    const navigate = useNavigate();
    const { user, setUser } = useContext(userContext);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        phone: '',
        password: '',
        idUserType: 3,
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (formData.username === '') {
            alert('שם משתמש חייב להיות מלא');
            return;
        }
        if (formData.email === '') {
            alert('דוא"ל חייב להיות מלא');
            return;
        }
        if (formData.phone === '') {
            alert('מספר טלפון חייב להיות מלא');
            return;
        }
        if (formData.password === '') {
            alert('סיסמא חייבת להיות מלאה');
            return;
        }

        fetch('http://localhost:3000/signUp', {
            method: 'POST',
            credentials: 'include',
            body: JSON.stringify(formData),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        })
            .then(res => {
                if (res.status !== 201) {
                    alert('שם משתמש לא תקין')
                    throw new Error('Registration failed');
                }
                return res.json();
            })
            .then((data) => {
                setUser(data);
                localStorage.setItem('currentUser', JSON.stringify(data));
                alert('ההרשמה הצליחה');
                navigate('/home');
            })
            .catch((error) => {
                console.error('Error:', error);
                alert('אירעה שגיאה בהרשמה. אנא נסה שנית.');
            })
            .finally(() => {
                toggleModal(); // סגירת המודל לאחר ניסיון ההרשמה
            });
    };

    return (
        <div className="registration-form-container">
            <h2 className="title-contactUs">הרשמה</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>שם משתמש</label>
                    <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>דוא"ל</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>מספר נייד</label>
                    <input
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>סיסמא</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit" className="submit-button">
                    הרשמה
                </button>
            </form>
            <div className="toggle-link" onClick={switchToLogin}>
                יש לך חשבון? <span>התחברות</span>
            </div>
        </div>
    );
}

export default SignUpForm;