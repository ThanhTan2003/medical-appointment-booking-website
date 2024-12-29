import React, { useState, useEffect } from "react";
import { Link, Outlet, useNavigate, useParams } from "react-router-dom";
import { getToken } from "../../../services/localStorageService";
import { CONFIG } from "../../../configurations/configuration";

const DanhSachLichHen = () => {
  const [appointments, setAppointments] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(4); // Số lượng hiển thị mỗi trang cố định là 4
  const [loading, setLoading] = useState(true);

  const { patientsId, appointmentId } = useParams();
  const navigate = useNavigate();

  const fetchAppointments = async () => {
    const token = getToken();
    if (!token) {
      navigate("/login");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `${CONFIG.API_GATEWAY}/appointment/patients-id/${patientsId}?page=${currentPage}&size=${pageSize}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch appointments");
      }

      const data = await response.json();
      setAppointments(data.data || []);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [currentPage]);

  const getStatusStyle = (status) => {
    switch (status) {
      case "Chờ phê duyệt":
        return "text-yellow-600 font-semibold";
      case "Đã xác nhận":
        return "text-green-600 font-semibold";
        case "Đã khám":
          return "text-sky-600 font-semibold";
      default:
        return "text-gray-600 font-semibold";
    }
  };

  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxDisplayPages = 3;

    for (let i = currentPage - maxDisplayPages; i <= currentPage + maxDisplayPages; i++) {
      if (i > 0 && i <= totalPages) {
        pageNumbers.push(i);
      }
    }

    return pageNumbers;
  };

  return (
    <div>
      {!appointmentId && (
        <div>
          {/* Nút quay lại */}
          <div className="flex justify-start mb-4">
            <button
              onClick={() => navigate(-1)}
              className="px-6 py-2 bg-white border border-sky-600 text-sky-600 font-bold rounded-lg hover:bg-gray-100"
            >
              {"<<"}
            </button>
          </div>

          {/* Tiêu đề */}
          <div className="text-center">
            <h1
              className="text-2xl font-bold"
              style={{
                background: "linear-gradient(to right, #0078B7, #00A3E0)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              DANH SÁCH LỊCH HẸN
            </h1>
            <div className="mt-2 w-32 mx-auto h-1 bg-gradient-to-r from-cyan-600 to-blue-800 rounded-full"></div>
          </div>

          {
            <>
              {/* Danh sách lịch hẹn */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                {appointments.map((appointment, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-lg shadow-md p-4 flex flex-col justify-between relative border border-slate-50 hover:border hover:border-sky-900"
                    style={{ minHeight: "220px" }}
                  >
                    <div>
                      <h4 className="text-xl font-bold text-blue-900 pb-2">
                        {appointment.id}
                      </h4>
                      <hr />
                      <div className="grid grid-cols-[auto,1fr] gap-y-1 gap-x-1 pt-2">
                        <div className="text-sm font-semibold text-gray-600 pr-4">Tên dịch vụ:</div>
                        <div className="text-sm text-gray-800">{appointment.serviceTimeFrame.serviceName}</div>
                        <div className="text-sm font-semibold text-gray-600 pr-4">Ngày khám:</div>
                        <div className="text-sm text-gray-800">{appointment.dateFullName}</div>
                        <div className="text-sm font-semibold text-gray-600 pr-4">Bác sĩ:</div>
                        <div className="text-sm text-gray-800">
                          {appointment.serviceTimeFrame.doctorQualificationName}{" "}
                          {appointment.serviceTimeFrame.doctorName}
                        </div>
                        <div className="text-sm font-semibold text-gray-600 pr-4">Khung giờ:</div>
                        <div className="text-sm text-gray-800">
                          {appointment.serviceTimeFrame.timeFrameNameFullName}
                        </div>
                        <div className="text-sm font-semibold text-gray-600 pr-4">Trạng thái:</div>
                        <div className={getStatusStyle(appointment.status)}>{appointment.status}</div>
                      </div>
                    </div>
                    <div className="flex justify-end mt-4">
                      <Link to={`${appointment.id}`}>
                        <button className="w-32 h-10 bg-gradient-to-r from-cyan-600 to-sky-700 text-white font-semibold rounded-lg shadow-lg hover:from-cyan-800 hover:to-blue-900 transition duration-300">
                          Chi tiết
                        </button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              <div className="flex justify-center mt-6 space-x-2">
                {getPageNumbers().map((pageNumber, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentPage(pageNumber)}
                    className={`p-2 border border-gray-300 rounded-md transition duration-200 ${
                      currentPage === pageNumber
                        ? "bg-sky-600 text-white"
                        : "bg-gray-100 hover:bg-gray-200"
                    }`}
                  >
                    {pageNumber}
                  </button>
                ))}
              </div>
            </>
          }
        </div>
      )}
      <Outlet />
    </div>
  );
};

export default DanhSachLichHen;
