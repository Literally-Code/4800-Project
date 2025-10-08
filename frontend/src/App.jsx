import { BrowserRouter, Routes, Route } from 'react-router-dom';
import React, { useState } from 'react';
import DataPopup from './components/DataPopup';
import Login from './components/Login';
import AboutUs from './components/AboutUs';
import './App.css';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<AboutUs />} />
                <Route path="/login" element={<Login />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;