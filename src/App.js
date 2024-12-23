import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import './App.css';
import Home from './page/Home';
import TrangChu from './page/TrangChu';
import HomeDatLichKham from './page/DatLichKham/HomeDatLichKham';
import Login from './page/Login';

export default function App() {
  return (
    <BrowserRouter>
    <Routes>
        <Route path= "/*" element={<Home />}>
        
        </Route>
        <Route path= "/login" element={<Login />}></Route>
    </Routes>
  </BrowserRouter>
  )
}
