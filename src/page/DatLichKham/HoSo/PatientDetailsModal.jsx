import React, { useState, useEffect } from "react";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getToken } from "../../../services/localStorageService";
import { CONFIG } from "../../../configurations/configuration";

function PatientDetailsModal({ isOpen, onClose, patientId }) {
  const [patientDetails, setPatientDetails] = useState(null);

  const fetchPatientDetails = async () => {
    const token = getToken();
    if (!token) {
      toast.error("Vui lòng đăng nhập lại.");
      return;
    }

    try {
      const response = await fetch(
        `${CONFIG.API_GATEWAY}/patient/id/${patientId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        toast.error("Không thể tải thông tin hồ sơ. Vui lòng thử lại.");
        return;
      }

      const data = await response.json();
      setPatientDetails(data);
    } catch (error) {
      console.error("Lỗi khi tải chi tiết hồ sơ:", error);
      toast.error("Đã xảy ra lỗi. Vui lòng thử lại!");
    }
  };

  useEffect(() => {
    if (isOpen && patientId) {
      fetchPatientDetails();
    }
  }, [isOpen, patientId]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
      <div
        className="bg-white rounded-xl shadow-xl overflow-y-auto"
        style={{ maxWidth: "80%", width: "80%", maxHeight: "90vh" }}
      >
        <div
          className="bg-blue-600 text-white px-4 py-2 flex justify-between items-center sticky top-0 z-10"
          style={{ borderBottom: "2px solid #ffffff" }}
        >
          <h2 className="text-lg font-bold">Thông tin chi tiết hồ sơ</h2>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 transition duration-200"
          >
            ✕
          </button>
        </div>

        <div className="p-6">
          {patientDetails ? (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-medium text-sky-800">
                  Họ và tên:
                </label>
                <p className="border p-2 rounded-lg w-full mt-1">
                  {patientDetails.fullName}
                </p>
              </div>
              <div>
                <label className="block font-medium text-sky-800">
                  Ngày sinh:
                </label>
                <p className="border p-2 rounded-lg w-full mt-1">
                  {new Date(patientDetails.dateOfBirth).toLocaleDateString(
                    "vi-VN"
                  )}
                </p>
              </div>
              <div>
                <label className="block font-medium text-sky-800">Giới tính:</label>
                <p className="border p-2 rounded-lg w-full mt-1">
                  {patientDetails.gender}
                </p>
              </div>
              <div>
                <label className="block font-medium text-sky-800">
                  Mã bảo hiểm Y tế:
                </label>
                <p className="border p-2 rounded-lg w-full mt-1">
                  {patientDetails.insuranceId || "Không có"}
                </p>
              </div>
              <div>
                <label className="block font-medium text-sky-800">
                  CMND/CCCD:
                </label>
                <p className="border p-2 rounded-lg w-full mt-1">
                  {patientDetails.identificationCode}
                </p>
              </div>
              <div>
                <label className="block font-medium text-sky-800">
                  Số điện thoại:
                </label>
                <p className="border p-2 rounded-lg w-full mt-1">
                  {patientDetails.phoneNumber}
                </p>
              </div>
              <div>
                <label className="block font-medium text-sky-800">Email:</label>
                <p className="border p-2 rounded-lg w-full mt-1">
                  {patientDetails.email}
                </p>
              </div>
              <div>
                <label className="block font-medium text-sky-800">
                  Địa chỉ:
                </label>
                <p className="border p-2 rounded-lg w-full mt-1">
                  {`${patientDetails.address}, ${patientDetails.ward}, ${patientDetails.district}, ${patientDetails.province}`}
                </p>
              </div>
              <div>
                <label className="block font-medium text-sky-800">
                  Quốc tịch:
                </label>
                <p className="border p-2 rounded-lg w-full mt-1">
                  {patientDetails.nation}
                </p>
              </div>
              <div>
                <label className="block font-medium text-sky-800">
                  Nghề nghiệp:
                </label>
                <p className="border p-2 rounded-lg w-full mt-1">
                  {patientDetails.occupation}
                </p>
              </div>
              <div>
                <label className="block font-medium text-sky-800">
                  Mối quan hệ:
                </label>
                <p className="border p-2 rounded-lg w-full mt-1">
                  {patientDetails.relationship}
                </p>
              </div>
              <div>
                <label className="block font-medium text-sky-800">Ghi chú:</label>
                <p className="border p-2 rounded-lg w-full mt-1">
                  {patientDetails.note || "Không có ghi chú"}
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-500">Đang tải dữ liệu...</div>
          )}
        </div>
        <ToastContainer transition={Bounce} />
      </div>
    </div>
  );
}

export default PatientDetailsModal;
