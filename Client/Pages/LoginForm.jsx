import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { userContext } from '../Components/App';
import Modal from 'react-modal';
import '../css/loginForm.css';

Modal.setAppElement('#root');

function LoginForm({ toggleModal, switchToSignUp }) {
  const navigate = useNavigate();
  const { setUser } = useContext(userContext);
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });

  useEffect(() => {
    localStorage.setItem('currentUser', null);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginData({
      ...loginData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Login Data:', loginData);
    fetch('http://localhost:3000/login', {
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify(loginData),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    })
      .then((res) => {
        if (res.status !== 201) {
          alert('The username or password is not correct');
          throw new Error('Invalid credentials');
        } else {
          return res.json();
        }
      })
      .then((data) => {
        setUser(data);
        localStorage.setItem('currentUser', JSON.stringify(data));
        toggleModal();
        if (data.idUserType === 1 ||data.idUserType === 2 || data.idUserType === 4   ) {
          navigate('/home'); // Navigate to admin or waiter home page
        }
      })
      .catch((error) => {
        console.error('Login error:', error);
      });
  };

  return (
    <div className="login-form-container">
      <h2 className="title-contactUs">התחברות</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>כתובת דוא"ל</label>
          <input
            type="email"
            name="email"
            value={loginData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>סיסמא</label>
          <input
            type="password"
            name="password"
            value={loginData.password}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="submit-button">
          המשך
        </button>
      </form>
      <div className="toggle-link" onClick={switchToSignUp}>
        אין לך חשבון? <span>הרשמה</span>
      </div>
    </div>
  );
}

export default LoginForm;