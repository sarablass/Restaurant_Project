import React from 'react';
import { Outlet } from 'react-router-dom';
import PersonalAreaHeader from '../Components/PersonalAreaHeader';
import HomeHeader from '../Components/HomeHeader';
import '../css/personalArea.css';


const PersonalArea = () => {
    return (
        <div>
            <HomeHeader />
            <div className="personal-area-nav-container">
                <PersonalAreaHeader />
            </div>
            <div className="personal-area-content">
                <Outlet />
            </div>
        </div>
    );
}

export default PersonalArea;