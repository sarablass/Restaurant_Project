import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import React, { useState, createContext } from 'react';
import TableOrdering from '../Pages/TableOrdering';
import TableDetails from '../Pages/TableDetails';
import Pickup from '../Pages/Pickup';
import Menu from '../Pages/Menu';
import ContactUs from '../Pages/ContactUs';
import HomeLayout from './HomeLayout';
import AdminDishes from "../Pages/AdminDishes";
import OpenTables from "../Pages/OpenTables";
import About from "../Pages/About";
import HomeHeader from './HomeHeader';
import PersonalArea from '../Pages/PersonalArea';
import PersonalTableOrders from '../Pages/PersonalTableOrders';
import PersonalFoodOrders from '../Pages/PersonalFoodOrders';
import Waiters from "../Pages/Waiters";
import ChefPage from "../Pages/ChefPage";
import Logout from "../Components/Logout"

export const userContext = createContext();

function App() {
  const [user, setUser] = useState();

  return (
    <BrowserRouter>
      <userContext.Provider value={{ user, setUser }}>
        <Routes>
          <Route path="/" element={<HomeLayout />}>
            <Route path="/" element={<Navigate to="/home" />} />
            <Route path="home" element={<HomeHeader />} />
          </Route>
          <Route path="/table-reservation" element={<TableOrdering />} />
          <Route path="/pickup" element={<Pickup />} />
          <Route path="/menus" element={<Menu />} />
          <Route path="/contact-us" element={<ContactUs />} />
          <Route path="/about" element={<About />} />
          <Route path="/openTables" element={<OpenTables />} />
          <Route path="/table-details" element={<TableDetails />} />
          <Route path="/admin-dishes" element={<AdminDishes />} />
          <Route path="/FoodOrders" element={<ChefPage />} />
          <Route path="logout" element={<Logout />} />
          <Route path="/personal-area" element={<PersonalArea />}>
            <Route index element={<PersonalTableOrders />} />
            <Route path="table-reservations" element={<PersonalTableOrders />} />
            <Route path="food-orders" element={<PersonalFoodOrders />} />
          </Route>
          <Route path="/waiters" element={<Waiters />} />
        </Routes>
      </userContext.Provider>
    </BrowserRouter>
  );
}

export default App;