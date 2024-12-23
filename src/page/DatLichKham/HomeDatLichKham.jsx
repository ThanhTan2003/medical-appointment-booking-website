import React, { useEffect } from "react";
import { Link, Routes, Route, useLocation, Outlet } from "react-router-dom";
import DanhSachChuyenKhoa from "./ChuyenKhoa/DanhSachChuyenKhoa";
import DanhSachBacSi from "./BacSi/DanhSachBacSi";
import DanhSachLoaiDichVu from "./DichVu/DanhSachLoaiDichVu";
import DanhSachTiemChung from "./TiemChung/DanhSachTiemChung";
import ChonDichVu from "./BacSi/ChonDichVu";
import ChonHoSo from "./HoSo/ChonHoSo";
import NotFound from "../NotFound";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserNurse, faHandHoldingMedical, faPills, faSyringe } from '@fortawesome/free-solid-svg-icons';
import ChonNgayKham from "./ChonNgayKham/ChonNgayKham";
import XacNhanThongTin from "./XacNhanThanhToan/XacNhanThongTin";

const HomeDatLichKham = () => {
  const location = useLocation(); // Lấy route hiện tại

  // Danh sách nút và đường dẫn tương ứng
  const buttons = [
    { label: "Đặt khám theo bác sĩ", path: "bac-si", icon: faUserNurse },
    { label: "Đặt khám theo chuyên khoa", path: "chuyen-khoa", icon: faHandHoldingMedical },
    { label: "Đặt lịch khám theo dịch vụ", path: "dich-vu", icon: faPills },
    { label: "Đặt lịch tiêm chủng", path: "tiem-chung", icon: faSyringe },
  ];

  useEffect(() => {
    window.scrollTo(0, 0); // Cuộn về đầu trang
  }, [location]);

  return (
    <div className="bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white py-4 shadow-md">
          <div className="flex justify-center gap-4 flex-wrap">
            {buttons.map((button) => (
              <Link
                key={button.path}
                to={`/dat-lich-kham/${button.path}`} // Đường dẫn tuyệt đối
                className={`px-4 py-2 rounded-full font-semibold border-2 transition duration-300 ${
                  location.pathname.includes(`/dat-lich-kham/${button.path}`)
                    ? "text-white bg-cyan-600 border-cyan-600 hover:bg-cyan-700"
                    : "text-cyan-700 bg-white border-transparent hover:border-cyan-500 hover:bg-cyan-50"
                }`}
              >
                <FontAwesomeIcon icon={button.icon} /> &nbsp;&nbsp;
                {button.label}
              </Link>
            ))}
          </div>
        </div>
        <br />
        <MainContent />
      </div>
    </div>
  );
};

const MainContent = () => {
  return (
    <div>
      <Routes>
        <Route index element={<DanhSachBacSi />} />
        <Route path="bac-si" element={<DanhSachBacSi />}>
          <Route path=":doctorId" element={<ChonDichVu />} >
            <Route path=":doctorServiceId" element={<ChonNgayKham />} >
                <Route path=":serviceTimeFrameId/:date" element={<ChonHoSo />}> 
                  <Route path=":patientsId" element={<XacNhanThongTin />}> 

                  </Route>
                </Route>
            </Route>
          </Route>
        </Route>
        <Route path="chuyen-khoa" element={<DanhSachChuyenKhoa />} />
        <Route path="dich-vu" element={<DanhSachLoaiDichVu />} />
        <Route path="tiem-chung" element={<DanhSachTiemChung />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
};

export default HomeDatLichKham;
