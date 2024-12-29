import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { CONFIG, API } from "../configurations/configuration";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    dateOfBirth: "",
    gender: "Nam",
    email: "",
    password: "",
    phoneNumber: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastSubmittedData, setLastSubmittedData] = useState(null); // Lưu thông tin lần gửi trước

  const showError = (message) => {
    toast.error(message, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  const showSuccess = (message) => {
    toast.success(message, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (isSubmitting) {
      showError("Đang xử lý, vui lòng đợi...");
      return;
    }

    // Kiểm tra nếu dữ liệu lần gửi hiện tại giống hệt dữ liệu trước
    if (JSON.stringify(formData) === JSON.stringify(lastSubmittedData)) {
      showError("Thông tin đã được gửi, vui lòng không gửi lại!");
      return;
    }

    setIsSubmitting(true); // Bắt đầu quá trình gửi yêu cầu

    try {
      const response = await fetch(`${CONFIG.API_GATEWAY}/identity/customer/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMessage = data.message || "Đăng ký không thành công!";
        showError(errorMessage);
        return;
      }

      // Đăng ký thành công
      showSuccess("Đăng ký thành công!");
      setLastSubmittedData(formData); // Lưu dữ liệu đã gửi thành công
      setTimeout(() => navigate("/login"), 1500);
    } catch (error) {
      showError("Đã xảy ra lỗi trong quá trình đăng ký!");
    } finally {
      setIsSubmitting(false); // Kết thúc quá trình gửi yêu cầu
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <ToastContainer transition={Bounce} />
      <div className="flex flex-col md:flex-row bg-white shadow-lg rounded-lg overflow-hidden max-w-6xl w-full">
        {/* Nội dung bên trái */}
        <div className="w-full md:w-1/2 p-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-sky-800">ĐĂNG KÝ TÀI KHOẢN</h2>
            <p className="text-gray-600 text-sm mt-2">Vui lòng điền thông tin để tạo tài khoản</p>
          </div>

          <form onSubmit={handleSubmit} className="mt-6">
            <div className="mb-4">
              <label htmlFor="fullName" className="block text-gray-700 pb-2 font-semibold">
                Họ và tên
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                placeholder="Nhập họ và tên"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="dateOfBirth" className="block text-gray-700 pb-2 font-semibold">
                Ngày sinh
              </label>
              <input
                type="date"
                id="dateOfBirth"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="gender" className="block text-gray-700 pb-2 font-semibold">
                Giới tính
              </label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
              </select>
            </div>

            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-700 pb-2 font-semibold">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Nhập email"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="phoneNumber" className="block text-gray-700 pb-2 font-semibold">
                Số điện thoại
              </label>
              <input
                type="text"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                placeholder="Nhập số điện thoại"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="password" className="block text-gray-700 pb-2 font-semibold">
                Mật khẩu
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Nhập mật khẩu"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="flex justify-between gap-4">
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="w-full bg-white border border-sky-600 text-sky-600 py-2 rounded-lg hover:bg-gray-100 transition duration-300 font-bold"
              >
                Hủy
              </button>
              <button
                type="submit"
                className={`w-full py-2 rounded-lg font-bold ${
                  isSubmitting ? "bg-gray-500 text-white cursor-not-allowed" : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Đang xử lý..." : "Đăng ký"}
              </button>
            </div>
          </form>
        </div>

        {/* Hình ảnh bên phải */}
        <div className="hidden md:flex md:w-1/2 bg-blue-50 justify-center items-center">
          <img
            src="https://benhvienbacha.vn/wp-content/uploads/2023/01/chuyen-gia-giai-dap-kham-suc-khoe-tong-quat-gom-nhung-gi.jpg"
            alt="Medical Service"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default Register;
