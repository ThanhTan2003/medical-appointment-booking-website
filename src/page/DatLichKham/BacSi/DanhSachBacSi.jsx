import React, { useEffect, useState } from "react";
import { Link, Outlet, useNavigate, useParams } from "react-router-dom";

import { CONFIG } from "../../../configurations/configuration";

const MainContent = () => {
  const [doctors, setDoctors] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(true);

  // Hàm lấy thông tin danh sách bác sĩ
  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${CONFIG.API_GATEWAY}/doctor/public/get-all?page=${currentPage}&size=${pageSize}`);
      const data = await response.json();
      setDoctors(data.data || []);
      setTotalPages(data.totalPages || 1);
      setTotalElements(data.totalElements || 0);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, [currentPage, pageSize]);

  // Hàm để tạo số trang hiển thị
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxDisplayPages = 4;

    if (currentPage > 5) {
      pageNumbers.push(1);
      if (currentPage > 6) {
        pageNumbers.push('...');
      }
    }

    for (let i = currentPage - maxDisplayPages; i <= currentPage + maxDisplayPages; i++) {
      if (i > 0 && i <= totalPages) {
        pageNumbers.push(i);
      }
    }

    if (currentPage < totalPages - maxDisplayPages - 1) {
      pageNumbers.push('...');
    }

    if (currentPage < totalPages - maxDisplayPages) {
      pageNumbers.push(totalPages);
    }

    return pageNumbers;
  };

  const { doctorId } = useParams();

  return (
    <>
      {
        !doctorId && (
          <div>
            <div className="text-center">
              <h1
                className="text-3xl font-bold relative"
                style={{
                  background: "linear-gradient(to right, #0078B7, #00A3E0)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Chọn bác sĩ
              </h1>
              <div className="mt-2 w-32 mx-auto h-1 bg-gradient-to-r from-cyan-600 to-blue-800 rounded-full"></div>
              {/* <p className="text-gray-600 mt-4 text-lg">
                Hãy chọn bác sĩ phù hợp với nhu cầu và lịch trình của bạn
              </p> */}
            </div>

            {/* Danh sách bác sĩ */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {doctors.map((doctor) => (
                <div key={doctor.id} className="bg-white rounded-lg shadow-md flex items-center m-1">
                  {/* Hình ảnh */}
                  <div className="w-40 h-full flex-shrink-0 overflow-hidden rounded-l-lg">
                    <img
                      src={doctor.image || (doctor.gender === "Nam"
                        ? "/images/default-male-doctor.jpg"
                        : "/images/default-female-doctor.jpg")}
                      alt="Ảnh bác sĩ"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = doctor.gender === "Nam"
                          ? "/images/default-male-doctor.jpg"
                          : "/images/default-female-doctor.jpg";
                      }}
                    />
                  </div>

                  {/* Nội dung */}
                  <div className="flex-1 p-4">
                    <h4 className="text-xl font-bold text-sky-800">
                      {doctor.qualificationName}. {doctor.fullName.toUpperCase()}
                    </h4>
                    <br />
                    <p className="text-lg text-gray-600">
                      <span className="font-semibold">Giới tính:</span> {doctor.gender || "Chưa cập nhật"}
                    </p>
                    <p className="text-lg text-gray-600">
                      <span className="font-semibold">Chuyên khoa:</span>{" "}
                      {doctor.specialties?.map((s) => s.specialtyName).join(", ") || "Chưa cập nhật"}
                    </p>
                    <br />
                    <div className="mt-4 flex justify-end">
                      <button className="w-28 h-10 border-2 border-cyan-700 text-cyan-700 font-semibold rounded-lg bg-white hover:bg-cyan-50 transition duration-300">
                        Chi tiết
                      </button>
                      <Link to={`${doctor.id}`}>
                        <button className="ml-2 w-32 h-10 bg-gradient-to-r from-cyan-600 to-sky-700 text-white font-semibold rounded-lg shadow-lg hover:from-cyan-800 hover:to-blue-900 transition duration-300">
                          Chọn bác sĩ
                        </button>
                      </Link>

                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Tổng số bác sĩ */}
            <div className="flex justify-between items-center mt-4">
              <div className="text-gray-600">
                Tổng số bác sĩ: <b>{totalElements}</b>
              </div>
              <div className="text-gray-600">
                Trang {currentPage} / {totalPages}
              </div>
            </div>

            {/* Pagination */}
            <div className="flex justify-center mt-4 space-x-2">
              {getPageNumbers().map((pageNumber, index) =>
                typeof pageNumber === 'number' ? (
                  <button
                    key={index}
                    onClick={() => setCurrentPage(pageNumber)}
                    style={currentPage === pageNumber ? { color: '#fff', backgroundColor: '#0066CC' } : {}}
                    className="p-2 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 transition duration-200"
                  >
                    {pageNumber}
                  </button>
                ) : (
                  <span key={index} style={{ margin: '0 5px' }}>...</span>
                )
              )}
            </div>
          </div>
        )
      }
      <Outlet />
    </>
  );
};

export default function DanhSachBacSi() {
  return <MainContent />;
}
