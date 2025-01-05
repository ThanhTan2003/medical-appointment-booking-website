import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle, faTimesCircle, faHome, faUser } from "@fortawesome/free-solid-svg-icons";
import { CONFIG } from "../../../src/configurations/configuration";
import { getToken } from "../../../src/services/localStorageService";

const PaymentStatus = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Lấy `vnp_ResponseCode` và `vnp_TxnRef` từ URL
  const responseCode = searchParams.get("vnp_ResponseCode");
  const transactionId = searchParams.get("vnp_TxnRef");

  // Trạng thái thanh toán
  const isSuccess = responseCode === "00";

  // Trạng thái thông tin lịch hẹn
  const [appointmentDetails, setAppointmentDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAppointmentDetails = async () => {
    const token = getToken();

    if (!token) {
      console.error("Token không hợp lệ, vui lòng đăng nhập lại.");
      return;
    }

    try {
      const response = await fetch(
        `${CONFIG.API_GATEWAY}/appointment/payment-id/${transactionId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setAppointmentDetails(data);
        setLoading(false);
      } else {
        console.error("Không tìm thấy thông tin lịch hẹn.");
      }
    } catch (error) {
      console.error("Lỗi khi lấy thông tin lịch hẹn:", error);
    }
  };

  useEffect(() => {
    if (isSuccess) {
      let retryCount = 0;
      const maxRetries = 5;

      const fetchWithRetry = async () => {
        if (retryCount >= maxRetries) {
          setLoading(false);
          return;
        }
        await fetchAppointmentDetails();
        retryCount++;
        if (!appointmentDetails) {
          setTimeout(fetchWithRetry, 2000);
        }
      };

      fetchWithRetry();
    } else {
      setLoading(false);
    }
  }, [isSuccess]);

  return (
    <div className="bg-gradient-to-br from-blue-100 via-white to-blue-50 flex items-center justify-center py-10">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-2xl">
        {isSuccess ? (
          <>
            <div className="text-center">
              <FontAwesomeIcon icon={faCheckCircle} className="text-green-500 text-5xl mb-4" />
              <h1 className="text-2xl font-extrabold text-green-600">Thanh toán thành công!</h1>
              <br />
              <p className=" mt-2 text-green-800">
                Lịch hẹn của bạn đã được đặt thành công! Thông tin chi tiết sẽ được gửi qua
                email đăng ký. Vui lòng kiểm tra email hoặc theo dõi lịch hẹn qua thông tin hồ sơ của bạn.
              </p>
            </div>

            {loading ? (
              <p className="text-gray-500 italic text-center mt-4">
                Đang tải thông tin lịch hẹn...
              </p>
            ) : appointmentDetails ? (
              <div className="mt-8 border-t border-gray-200 pt-4">
                <h2 className="text-lg font-bold text-sky-800 mb-4 text-center">THÔNG TIN LỊCH HẸN</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="font-semibold text-gray-600">Mã lịch hẹn:</div>
                  <div className="text-gray-800">{appointmentDetails.id}</div>
                  <div className="font-semibold text-gray-600">Dịch vụ đặt khám:</div>
                  <div className="text-gray-800">{appointmentDetails.serviceTimeFrame.serviceName}</div>
                  <div className="font-semibold text-gray-600">Bác sĩ:</div>
                  <div className="text-gray-800">{appointmentDetails.serviceTimeFrame.doctorName}</div>
                  <div className="font-semibold text-gray-600">Phòng khám:</div>
                  <div className="text-gray-800">{appointmentDetails.serviceTimeFrame.roomName}</div>
                  <div className="font-semibold text-gray-600">Số thứ tự:</div>
                  <div className="text-sky-800 font-bold">{appointmentDetails.orderNumber}</div>
                  <div className="font-semibold text-gray-600">Ngày khám:</div>
                  <div className="text-gray-800">{appointmentDetails.dateFullName}</div>
                  <div className="font-semibold text-gray-600">Khung giờ:</div>
                  <div className="text-gray-800">{appointmentDetails.serviceTimeFrame.timeFrameNameFullName}</div>
                  <div className="font-semibold text-gray-600">Trạng thái:</div>
                  <div className="text-yellow-600 font-bold">{appointmentDetails.status}</div>
                </div>
              </div>
            ) : (
              <p className="text-gray-500 italic text-center mt-4">
                Không tìm thấy thông tin lịch hẹn. Vui lòng kiểm tra lại sau.
              </p>
            )}
          </>
        ) : (
          <>
            <div className="text-center">
              <FontAwesomeIcon icon={faTimesCircle} className="text-red-500 text-5xl mb-4" />
              <h1 className="text-2xl font-extrabold text-red-600">Thanh toán thất bại!</h1>
              <p className="text-gray-700 mt-2">
                Rất tiếc, quá trình thanh toán không thành công! Vui lòng kiểm tra và thử lại.
              </p>
            </div>
          </>
        )}

        <div className="mt-8 flex justify-between">
          <button
            onClick={() => navigate("/home")}
            className="px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition font-bold flex items-center justify-center w-1/2 mr-2"
          >
            <FontAwesomeIcon icon={faHome} className="mr-2" />
            Về trang chủ
          </button>
          <button
            onClick={() => navigate("/user/phieu-kham-benh")}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition font-bold flex items-center justify-center w-1/2 ml-2"
          >
            <FontAwesomeIcon icon={faUser} className="mr-2" />
            Truy cập hồ sơ của tôi
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentStatus;
