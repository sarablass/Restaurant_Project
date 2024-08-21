import React from 'react';
import { NavLink } from 'react-router-dom';
import '../css/personalAreaHeader.css';

const PersonalAreaHeader = () => {
    return (
        <nav className="personal-area-navbar">
            <NavLink className="nav-item" to="/personal-area/table-reservations">הזמנות שולחן</NavLink>
            <NavLink className="nav-item" to="/personal-area/food-orders">הזמנות מנות</NavLink>
        </nav>
    );
}

export default PersonalAreaHeader;