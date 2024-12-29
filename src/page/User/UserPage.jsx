import React, { useEffect } from "react";
import { Link, Routes, Route, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAddressBook, faFileLines, faKey, faBell } from "@fortawesome/free-solid-svg-icons";
import DanhSachHoSo from "./HoSo/DanhSachHoSo";
import PhieuKhamBenh from "./PhieuKhamBenh/PhieuKhamBenh";
import ThongBao from "./ThongBao/ThongBao";
import ThayDoiMatKhau from "./ThayDoiMatKhau/ThayDoiMatKhau";
import DanhSachLichHen from "./PhieuKhamBenh/DanhSachLichHen";
import ThongTinLichHen from "./PhieuKhamBenh/ThongTinLichHen";
import NotFound from "../NotFound";

const UserPage = () => {
    const location = useLocation();

    // Menu bên trái
    const menuItems = [
        { label: "Hồ sơ bệnh nhân", path: "ho-so", icon: faAddressBook },
        { label: "Phiếu khám bệnh", path: "phieu-kham-benh", icon: faFileLines },
        { label: "Thông báo", path: "thong-bao", icon: faBell },
        { label: "Thay đổi mật khẩu", path: "thay-doi-mat-khau", icon: faKey },
    ];

    return (
        <div className="flex bg-gray-100">
            {/* Sidebar */}
            <div className="w-1/4 bg-white text-gray-700 shadow-lg flex flex-col min-h-[500px]">
                <div className="p-6 text-center text-2xl font-bold border-b border-gray-200">
                    Thông tin cá nhân
                </div>
                <ul className="flex-grow mt-6">
                    {menuItems.map((item, index) => (
                        <li key={index} className="relative text-sky-700 font-bold">
                            <Link
                                to={`/user/${item.path}`}
                                className={`flex items-center gap-4 px-6 py-4 rounded-lg transition-all duration-300 ${
                                    location.pathname.includes(`/user/${item.path}`)
                                        ? "bg-sky-100 text-sky-600 shadow-md"
                                        : "hover:bg-gray-100 hover:text-sky-600"
                                }`}
                            >
                                <FontAwesomeIcon icon={item.icon} className="text-xl" />
                                <span className="">{item.label}</span>
                                {location.pathname.includes(`/user/${item.path}`) && (
                                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-sky-600 rounded-tr-lg rounded-br-lg"></div>
                                )}
                            </Link>
                        </li>
                    ))}
                </ul>
                <div className="p-4 text-center text-sm text-gray-500">
                    © 2024 Phòng khám Đa khoa Gia Định
                </div>
            </div>

            {/* Chi tiết */}
            <div className="w-3/4 bg-gray-50 shadow-inner flex-grow p-4">
                <MainContent />
            </div>
        </div>
    );
};

const MainContent = () => {
    const location = useLocation();

    // Scroll lên đầu trang khi đường dẫn thay đổi
    useEffect(() => {
        window.scrollTo(0, 0); // Đưa thanh trượt lên đầu trang
    }, [location.pathname]);

    return (
        <div className="bg-white p-4">
            <Routes>
                <Route index element={<DanhSachHoSo />} />
                <Route path="ho-so" element={<DanhSachHoSo />} />
                <Route path="phieu-kham-benh" element={<PhieuKhamBenh />} >
                    <Route path=":patientsId" element={<DanhSachLichHen />}> 
                        <Route path=":appointmentId" element={<ThongTinLichHen />} /> 
                    </Route>
                </Route>
                <Route path="thong-bao" element={<ThongBao />} />
                <Route path="thay-doi-mat-khau" element={<ThayDoiMatKhau />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </div>
    );
};

export default UserPage;
