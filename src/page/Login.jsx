import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { getToken, setToken } from '../services/localStorageService';
import { CONFIG, API } from '../configurations/configuration';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faG } from '@fortawesome/free-solid-svg-icons';

const Login = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const showError = (error) => {
        toast.error(error, {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!username || !password) {
            showError('Vui lòng điền đầy đủ thông tin đăng nhập!');
            return;
        }

        try {
            const response = await fetch(`${CONFIG.API_GATEWAY}${API.LOGIN}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userName: username,
                    password: password,
                }),
            });

            const data = await response.json();
            if (!response.ok) {
                showError('Thông tin đăng nhập không đúng!');
                return;
            }

            // Xác thực thành công, lưu token và điều hướng đến trang chính
            setToken(data.token);

            navigate('/');
        } catch (error) {
            showError('Đã xảy ra lỗi trong quá trình đăng nhập!');
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <ToastContainer transition={Bounce} />
            <div className="flex flex-col md:flex-row bg-white shadow-lg rounded-lg overflow-hidden max-w-4xl w-full">
                {/* Hình ảnh bên trái */}
                <div className="hidden md:flex md:w-1/2 bg-blue-50 justify-center items-center">
                    <img
                        src="https://benhvienbacha.vn/wp-content/uploads/2023/01/chuyen-gia-giai-dap-kham-suc-khoe-tong-quat-gom-nhung-gi.jpg"
                        alt="Medical Service"
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* Nội dung bên phải */}
                <div className="w-full md:w-1/2 p-8">
                    <div className="text-center">
                        <img
                            src="/images/logo phong kham.PNG"
                            alt="Logo"
                            className="w-20 mx-auto mb-4"
                        />
                        <h2 className="text-xl font-bold text-sky-700">PHÒNG KHÁM ĐA KHOA GIA ĐỊNH</h2>
                        <p className="text-emerald-700 text-xl font-bold">Đặt lịch khám bệnh trực tuyến</p>
                    </div>

                    <form onSubmit={handleSubmit} className="mt-6">
                        <div className="mb-4">
                            <label htmlFor="username" className="block text-base text-gray-700 pb-2 font-semibold">Tài khoản</label>
                            <input
                                type="text"
                                id="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Nhập tài khoản"
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="password" className="block text-base text-gray-700 pb-2 font-semibold">Mật khẩu</label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Nhập mật khẩu"
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition duration-300 font-bold mb-4"
                        >
                            Đăng nhập
                        </button>

                        <button
                            type="button"
                            className="w-full bg-red-500 text-white py-3 rounded-lg hover:bg-red-600 transition duration-300 font-bold mb-4"
                        >
                            Đăng nhập bằng Google &nbsp;<FontAwesomeIcon icon={faG} />
                        </button>

                        <button
                            type="button"
                            onClick={() => navigate('/register')}
                            className="w-full border border-sky-600 text-sky-600 py-3 rounded-lg hover:bg-sky-50 transition duration-300 font-bold"
                        >
                            Tạo tài khoản
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
