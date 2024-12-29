import React, { useEffect, useState } from "react";
import { Link, Outlet, useNavigate, useParams } from "react-router-dom";
import SchedulePicker from "../ChonNgayKham/SchedulePicker";
import ConfirmModal from "../ConfirmModal";
import NotificationModal from "../NotificationModal";

import { getToken } from "../../../services/localStorageService";
import { introspect } from "../../../services/authenticationService";
import { CONFIG } from "../../../configurations/configuration";

const MainContent = () => {
  const { doctorServiceId } = useParams();
  const navigate = useNavigate();

  const [availableDays, setAvailableDays] = useState([]);
  const [loading, setLoading] = useState(true);

  const holidayMatrix = [[1, 1], [30, 4], [2, 9]];
  const specificHolidays = ["2024/12/30", "2025/09/03"];

  const [serviceTimeFrameId, setServiceTimeFrameId] = useState(null);

  // Các trạng thái quản lý
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal xác nhận ngày/khung giờ
  const [isNotificationOpen, setIsNotificationOpen] = useState(false); // Modal thông báo đăng nhập
  const [notificationMessage, setNotificationMessage] = useState(""); // Thông báo trong modal thông báo

  const [selectedDate, setSelectedDate] = useState(null);

  // Hàm gọi API để lấy availableDays
  const fetchAvailableDays = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${CONFIG.API_GATEWAY}/medical/service-time-frame/public/available-days?doctorServiceId=${doctorServiceId}`
      );
      const data = await response.json();
      setAvailableDays(data);
    } catch (error) {
      console.error("Lỗi khi gọi API:", error);
    } finally {
      setLoading(false);
    }
  };

  // Hàm xử lý khi người dùng chọn ngày và TimeSlot
  const handleDateTimeSelection = async (date, timeSlot) => {
    const token = getToken(); // Lấy token từ localStorage

    if (!token) {
      // Nếu không có token, hiển thị modal thông báo yêu cầu đăng nhập
      setNotificationMessage("Bạn cần phải đăng nhập để tiếp tục đăng ký.");
      setIsNotificationOpen(true); // Mở modal thông báo
      return;
    }

    const isValid = await introspect(); // Kiểm tra token hợp lệ

    if (!isValid) {
      // Nếu token không hợp lệ, yêu cầu đăng nhập lại
      setNotificationMessage("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
      setIsNotificationOpen(true); // Mở modal thông báo
      return;
    }

    // Nếu token hợp lệ, điều hướng đến ChonHoSo
    setSelectedDate(date);
    setSelectedTimeSlot(timeSlot);
    setServiceTimeFrameId(timeSlot.id); // Thiết lập serviceTimeFrameId
    console.log(date)
    navigate(`${timeSlot.id}/${date}`); // Điều hướng đến ChonHoSo với serviceTimeFrameId
  };

  // Hàm xử lý khi xác nhận từ Modal xác nhận
  const handleConfirm = () => {
    console.log("Xác nhận chọn ngày:", selectedDate);
    console.log("Xác nhận chọn TimeSlot:", selectedTimeSlot);
    setIsModalOpen(false); // Đóng Modal
  };

  // Hàm xử lý khi đóng Modal xác nhận
  const handleCloseModal = () => {
    setSelectedDate(null);
    setSelectedTimeSlot(null);
    setIsModalOpen(false);
  };

  // Hàm xử lý khi đồng ý đăng nhập từ Modal thông báo
  const handleLoginRedirect = () => {
    navigate("/login");
  };

  // Hàm xử lý khi đóng Modal thông báo
  const handleCloseNotification = () => {
    setIsNotificationOpen(false);
  };

  // Gọi API khi component mount hoặc khi doctorServiceId thay đổi
  useEffect(() => {
    if (doctorServiceId) {
      fetchAvailableDays();
    }
  }, [doctorServiceId]);

  if (loading) {
    return <div>Đang tải dữ liệu...</div>;
  }

  return (
    <>
      {
        !serviceTimeFrameId && (
          <div>
            <SchedulePicker
              doctorServiceId={doctorServiceId}
              availableDays={availableDays}
              holidayMatrix={holidayMatrix}
              specificHolidays={specificHolidays}
              onDateTimeSelection={handleDateTimeSelection}
              setSelectedDate = {setSelectedDate}
            />
            {/* Modal xác nhận ngày và khung giờ */}
            <ConfirmModal
              isOpen={isModalOpen}
              onClose={handleCloseModal}
              onConfirm={handleConfirm}
              selectedDate={selectedDate}
              selectedTimeSlot={selectedTimeSlot}
            />
            {/* Modal thông báo yêu cầu đăng nhập */}
            <NotificationModal
              isOpen={isNotificationOpen}
              onClose={handleCloseNotification}
              onConfirm={handleLoginRedirect}
              message={notificationMessage}
            />
          </div>
        )
      }
      <Outlet />
    </>
  );
};

export default MainContent;
