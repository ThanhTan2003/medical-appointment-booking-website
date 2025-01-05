import React from 'react'
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes, Outlet } from "react-router-dom";
import TrangChu from './TrangChu'
import Header from './Header'
import Footer from './Footer'
import HomeDatLichKham from './DatLichKham/HomeDatLichKham';
import DanhSachBacSi from './DatLichKham/BacSi/DanhSachBacSi';
import DanhSachChuyenKhoa from './DatLichKham/ChuyenKhoa/DanhSachChuyenKhoa';
import DanhSachLoaiDichVu from './DatLichKham/DichVu/DanhSachLoaiDichVu';
import DanhSachTiemChung from './DatLichKham/TiemChung/DanhSachTiemChung';
import NotFound from './NotFound';
import UserPage from './User/UserPage';
import PaymentStatus from './DatLichKham/PaymentStatus';

const MainContent = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<TrangChu />} />
        <Route path="home" element={<TrangChu />} />

        {/* Route Đặt Lịch Khám */}
        <Route path="dat-lich-kham/*" element={<HomeDatLichKham />}>

        </Route>

        {/* Route Not Found */}
        <Route path="*" element={<NotFound />} />

        <Route path="/user/*" element={<UserPage />}>

        </Route>

        {/* Route Thanh Toán */}
        <Route path="payment/:transactionId/status" element={<PaymentStatus />} />
      </Routes>
      <Outlet />
    </div>
  );
};

const Home = () => {
  return (
    <>
      <Header />
      <MainContent />
      <Footer />
    </>
  )
}
export default Home;