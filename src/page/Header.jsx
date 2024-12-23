import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getToken, removeToken } from "../../src/services/localStorageService";
import { CONFIG } from "../../src/configurations/configuration";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faAddressBook, faFileLines, faKey, faRightFromBracket } from '@fortawesome/free-solid-svg-icons';

const Header = () => {
    const navigate = useNavigate();
    const [account, setAccount] = useState(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const handleNavigateHome = () => {
        navigate("/");
    };

    const handleLogOut = () => {
        removeToken();
        setAccount(null);
        navigate("/");
    };

    const getMyInfor = async (accessToken) => {
        try {
            const response = await fetch(
                `${CONFIG.API_GATEWAY}/identity/customer/get-info`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );

            if (response.status === 200) {
                const data = await response.json();
                setAccount(data);
                return;
            }
            setAccount(null);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        const accessToken = getToken();
        if (accessToken) {
            getMyInfor(accessToken);
        }
    }, []);

    return (
        <>
            <header className="flex justify-between items-center px-8 py-4 shadow-md z-50 sticky top-0 bg-white">
                {/* Logo */}
                <div
                    onClick={handleNavigateHome}
                    className="flex items-center cursor-pointer select-none"
                >
                    <img
                        src="/images/logo phong kham.PNG"
                        alt="Logo"
                        className="w-10 h-10 object-contain"
                    />
                    <div className="text-2xl font-bold text-gray-800">
                        <span className="text-sky-700">Phòng khám Đa khoa</span>
                        <span className="text-green-700">&nbsp;Gia Định</span>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="hidden md:flex space-x-6">
                    <a href="#" className="text-gray-600 hover:text-gray-800 font-bold">
                        Trang chủ
                    </a>
                    <a href="#" className="text-gray-600 hover:text-gray-800">
                        Giới thiệu
                    </a>
                    <a href="#" className="text-gray-600 hover:text-gray-800">
                        Đặt khám
                    </a>
                    <a href="#" className="text-gray-600 hover:text-gray-800">
                        Tin tức
                    </a>
                    <a href="#" className="text-gray-600 hover:text-gray-800">
                        Tư vấn trực tiếp
                    </a>
                    <a href="#" className="text-gray-600 hover:text-gray-800">
                        Hướng dẫn
                    </a>
                </nav>

                {/* Account Section */}
                {account ? (
                    <div className="relative">
                        {/* Account Button */}
                        <button
                            onClick={() => setIsDropdownOpen((prev) => !prev)}
                            className="flex items-center px-4 py-2 bg-white border border-sky-600 text-sky-600 rounded-lg hover:bg-gray-100 transition font-semibold"
                        >
                            <FontAwesomeIcon icon={faUser} /> &nbsp; {account.fullName}
                        </button>

                        {/* Dropdown Menu */}
                        {isDropdownOpen && (
                            <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-md">
                                <div className="px-4 py-2 border-b text-gray-600">
                                    <p className="text-sm">Xin chào,</p>
                                    <p className="text-base font-bold">{account.fullName}</p>
                                </div>
                                <ul className="py-2">
                                    <li>
                                        <a
                                            href="#"
                                            className="block px-4 py-2  text-sky-800 hover:bg-gray-100"
                                        >
                                            <FontAwesomeIcon icon={faAddressBook} /> &nbsp; Hồ sơ bệnh nhân
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="#"
                                            className="block px-4 py-2 text-sky-800 hover:bg-gray-100"
                                        >
                                            <FontAwesomeIcon icon={faFileLines} /> &nbsp; Phiếu khám bệnh
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="#"
                                            className="block px-4 py-2 text-sky-800 hover:bg-gray-100"
                                        >
                                            <FontAwesomeIcon icon={faKey} /> &nbsp; Thay đổi mật khẩu
                                        </a>
                                    </li>
                                    <li>
                                        <button
                                            onClick={handleLogOut}
                                            className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                                        >
                                            <FontAwesomeIcon icon={faRightFromBracket} /> &nbsp; Đăng xuất
                                        </button>
                                    </li>
                                </ul>
                                <div className="px-4 py-2 border-t text-xs text-gray-500">
                                    Cập nhật mới nhất: {new Date(account.lastUpdated).toLocaleDateString("vi-VN")}
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <button
                        onClick={() => navigate("/login")}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition font-bold"
                    >
                        Đăng nhập
                    </button>
                )}
            </header>
        </>
    );
};

export default Header;
