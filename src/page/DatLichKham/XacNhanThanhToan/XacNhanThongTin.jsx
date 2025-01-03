import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getToken } from "../../../services/localStorageService";
import { CONFIG } from "../../../configurations/configuration";
import { toast } from "react-toastify";
import NotificationModal from "./CustomModal";

const formatDate = (date) => {
  const [year, month, day] = date.split("-");
  return `${day}/${month}/${year}`;
};

const ThongTinLichHen = ({ serviceTimeFrameId, date }) => {
  const [appointment, setAppointment] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAppointmentDetails = async () => {
      const token = getToken();
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const response = await fetch(
          `${CONFIG.API_GATEWAY}/medical/service-time-frame/public/id/${serviceTimeFrameId}`,
          {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch appointment details");
        }

        const data = await response.json();
        setAppointment(data);
      } catch (error) {
        toast.error("Không thể tải thông tin lịch hẹn.");
        console.error(error);
      }
    };

    fetchAppointmentDetails();
  }, [serviceTimeFrameId, navigate]);

  if (!appointment) {
    return <div>Đang tải thông tin lịch hẹn...</div>;
  }

  return (
    <div className="border border-blue-600 rounded-lg shadow-md relative p-4 bg-white">
      <div className="absolute -top-4 left-4 bg-white px-2 text-blue-900 font-bold text-2xl">
        THÔNG TIN LỊCH HẸN
      </div>
      <div className="md:col-span-2 pr-6 text-justify pt-2">
        <div className="grid grid-cols-1 md:grid-cols-[3fr,7fr] gap-4">
          <p className="text-lg mb-2"><strong>Tên bác sĩ: </strong></p>
          <p className="text-lg mb-2">{appointment.doctorResponse?.fullName || "Không có thông tin!"}</p>
          <p className="text-lg mb-2"><strong>Tên dịch vụ: </strong></p>
          <p className="text-lg mb-2">{appointment.doctorServiceResponse?.service?.name || "Không có thông tin!"}</p>
          <p className="text-lg mb-2"><strong>Ngày đặt khám: </strong></p>
          <p className="text-lg mb-2">{formatDate(date) || "Không có thông tin!"}</p>
          <p className="text-lg mb-2"><strong>Khung giờ đặt: </strong></p>
          <p className="text-lg mb-2">{appointment.timeFrameResponse?.fullName || "Không có thông tin!"}</p>
          <p className="text-lg mb-2"><strong>Phí dịch vụ: </strong></p>
          <p className="text-lg mb-2">{appointment.doctorServiceResponse?.unitPrice?.toLocaleString() || "Không có thông tin!"} VND</p>
        </div>
      </div>
    </div>
  );
};

const ThongTinHoSo = ({ patientsId }) => {
  const [patients, setPatients] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPatientDetails = async () => {
      const token = getToken();
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const response = await fetch(`${CONFIG.API_GATEWAY}/patient/id/${patientsId}`, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch patient details");
        }

        const data = await response.json();
        setPatients(data);
      } catch (error) {
        toast.error("Không thể tải thông tin hồ sơ.");
        console.error(error);
      }
    };

    fetchPatientDetails();
  }, [patientsId, navigate]);

  if (!patients) {
    return <div>Đang tải thông tin hồ sơ...</div>;
  }

  return (
    <div className="border border-blue-600 rounded-lg shadow-md relative p-4 mt-4 bg-white">
      <div className="absolute -top-4 left-4 bg-white px-2 text-blue-900 font-bold text-2xl">
        THÔNG TIN HỒ SƠ ĐĂNG KÝ
      </div>
      <div className="md:col-span-2 pr-6 text-justify pt-2">
        <div className="grid grid-cols-1 md:grid-cols-[3fr,7fr] gap-4">
          <p className="text-lg mb-2"><strong>Mã hồ sơ: </strong></p>
          <p className="text-lg mb-2">{patients.id || "Không có thông tin!"}</p>
          <p className="text-lg mb-2"><strong>Họ tên: </strong></p>
          <p className="text-lg mb-2">{patients.fullName || "Không có thông tin!"}</p>
          <p className="text-lg mb-2"><strong>Ngày sinh: </strong></p>
          <p className="text-lg mb-2">{formatDate(patients.dateOfBirth) || "Không có thông tin!"}</p>
          <p className="text-lg mb-2"><strong>Giới tính: </strong></p>
          <p className="text-lg mb-2">{patients.gender || "Không có thông tin!"}</p>
          <p className="text-lg mb-2"><strong>Email: </strong></p>
          <p className="text-lg mb-2">{patients.email || "Không có thông tin!"}</p>
          <p className="text-lg mb-2"><strong>Địa chỉ: </strong></p>
          <p className="text-lg mb-2">
            {`${patients.address}, ${patients.ward}, ${patients.district}, ${patients.province}` || "Không có thông tin!"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default function XacNhanThongTin() {
  const { serviceTimeFrameId, date, patientsId } = useParams();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(true);

  const handleConfirmAndPay = async () => {
    const token = getToken();
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const formattedDate = date.split("/").reverse().join("-");
      const response = await fetch(`${CONFIG.API_GATEWAY}/appointment/register`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          date: formattedDate,
          serviceTimeFrameId,
          patientsId,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        window.location.href = data.vnpayURL;
      } else {
        const error = await response.json();
        toast.error(error.message || "Đã xảy ra lỗi khi tạo lịch hẹn.");
      }
    } catch (error) {
      toast.error("Đã xảy ra lỗi trong quá trình thanh toán.");
      console.error(error);
    }
  };

  return (
    <div className="p-4">
      <NotificationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        message="Sau khi đặt lịch hẹn thành công, thông tin lịch hẹn sẽ được gửi qua email của hồ sơ đăng ký. Bạn vui lòng kiểm tra lại thông tin cho chính xác. Trân trọng!"
        onConfirm={() => setIsModalOpen(false)}
      />
      <ThongTinLichHen serviceTimeFrameId={serviceTimeFrameId} date={date} />
      <br />
      <ThongTinHoSo patientsId={patientsId} />
      <div className="flex justify-end mt-6 gap-4">
        <button
          onClick={() => navigate(-1)}
          className="px-6 py-2 bg-white border border-sky-600 text-sky-600 font-bold rounded-lg hover:bg-gray-100"
        >
          Hủy
        </button>
        <button
          onClick={handleConfirmAndPay}
          className="px-6 py-2 bg-sky-600 text-white font-bold rounded-lg hover:bg-sky-800"
        >
          Xác nhận và thanh toán
        </button>
      </div>
    </div>
  );
}

