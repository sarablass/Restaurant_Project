import React, { useState, useContext } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { userContext } from '../Components/App';
import '../css/homeHeader.css';
import LoginForm from '../Pages/LoginForm';
import SignUpForm from '../Pages/SignUpForm'

function HomeHeader() {
    const [modalVisible, setModalVisible] = useState(false);
    const [showLogin, setShowLogin] = useState(true);
    const { user } = useContext(userContext);

    const toggleModal = () => {
        setModalVisible(!modalVisible);
    };

    const switchToLogin = () => {
        setShowLogin(true);
    };

    const switchToSignUp = () => {
        setShowLogin(false);
    };

    const renderCostumertNav = () => (
        <>
            <NavLink className="nav-item" to="/about">
                אודות
            </NavLink>
            <NavLink className="nav-item" to="/table-reservation">
                הזמן שולחן
            </NavLink>
            <NavLink className="nav-item" to="/pickup">
                הזמנות אונליין
            </NavLink>
            <NavLink className="nav-item" to="/menus">
                תפריטים
            </NavLink>
            <NavLink className="nav-item" to="/contact-us">
                צור קשר
            </NavLink>

            <NavLink className="nav-item" to="/giftcard">
                <i className="fas fa-gift"></i> Giftcard
            </NavLink>

            {user?.idUserType == 3 && (
                <NavLink className="personal-area-link" to="/personal-area">
                    אזור אישי
                </NavLink>
            )}
        </>
    );

    const renderWaiterNav = () => (
        <>
            <NavLink className="nav-item" to="/openTables">
                פתיחת שולחן
            </NavLink>
        </>
    );

    const renderChefNav = () => (
        <>
            <NavLink className="nav-item" to="/FoodOrders">
                הזמנות לקוחות
            </NavLink>
        </>
    );
    const renderAdminNav = () => (
        <>
            <NavLink className="nav-item-admin" to="/admin-dishes">
                מנות
            </NavLink>
            <NavLink className="nav-item-admin" to="/waiters">
                מלצרים
            </NavLink>
            <NavLink className="nav-item-admin" to="/waiters">
                הזמנות
            </NavLink>
        </>
    );

    const renderNavLinks = () => {
        if (user?.idUserType === 1) {
            return renderAdminNav();
        } else if (user?.idUserType === 2) {
            return renderWaiterNav();
        } else if (user?.idUserType === 4) {
            return renderChefNav();
        } else {
            return renderCostumertNav(); 
        }
    };

    return (
        <header className="navbar">
            <Link className="navbar-logo" to="/"> <span>Super</span> <span>Coffee</span></Link>
            <nav className="navbar-right">
                {renderNavLinks()}
            </nav>
            <div className="navbar-left">
            {user && (  <NavLink className="nav-item" to="/logout">
                Logout
            </NavLink>)}
                <div className="icon-group">
                    <NavLink className="nav-item" onClick={toggleModal}>
                        <img src="../pic/person.png" className='pic-person' alt="" />
                        {user && <span className={`user-name ${user ? 'user-name-logged-in' : ''}`}>
                            {user.username}
                        </span>}
                    </NavLink>
                </div>
                
            </div>
            {modalVisible && (
                <div className="modal-overlay" onClick={toggleModal}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <img src="../pic/x-mark.png" alt="" className="close-modal" onClick={toggleModal} />
                        {showLogin ? (
                            <LoginForm toggleModal={toggleModal} switchToSignUp={switchToSignUp} />
                        ) : (
                            <SignUpForm toggleModal={toggleModal} switchToLogin={switchToLogin} />
                        )}
                    </div>
                </div>
            )}
        </header>
    );
}

export default HomeHeader;