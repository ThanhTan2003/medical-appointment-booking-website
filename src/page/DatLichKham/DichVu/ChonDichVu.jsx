import React, { useEffect, useState } from "react";
import { Link, Outlet, useNavigate, useParams } from "react-router-dom";

import { CONFIG } from "../../../configurations/configuration";

const MainContent = () => {
  const [services, setServices] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(true);

  const { serviceTypeId } = useParams();
  const { serviceId } = useParams();

  const fetchServices = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${CONFIG.API_GATEWAY}/medical/service/public/service-type/${serviceTypeId}?page=${currentPage}&size=${pageSize}`);
      const data = await response.json();
      setServices(data.data || []);
      setTotalPages(data.totalPages || 1);
      setTotalElements(data.totalElements || 0);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
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

  return (
    <>
      {
        !serviceId && (
          <div>
            {
              // !doctorId && (
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
                    CHỌN DỊCH VỤ
                  </h1>
                  <div className="mt-2 w-32 mx-auto h-1 bg-gradient-to-r from-cyan-600 to-blue-800 rounded-full"></div>
                </div>

                {/* Danh sách bác sĩ */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {services.map((item, index) => (
                    <div
                      key={index}
                      className="bg-white rounded-lg shadow-md p-4 flex flex-col justify-between relative mt-4"
                      style={{ minHeight: "180px" }} // Chiều cao cố định
                    >
                      {/* Nội dung thẻ */}
                      <div className="flex items-center gap-6 mb-6">
                        {/* Icon lớn bên trái */}
                        <img
                          src="https://cdn-icons-png.flaticon.com/512/1976/1976945.png"
                          alt="service-icon"
                          className="w-16 h-16 object-contain" // Tăng kích thước icon
                        />
                        {/* Tên dịch vụ và giá */}
                        <div className="flex-1">
                          <h4
                            className="text-xl font-bold bg-clip-text text-transparent"
                            style={{
                              backgroundImage: "linear-gradient(to right, #0078B7, #004F8C)",
                            }}
                          >
                            {item.name.toUpperCase()}
                          </h4>
                          <p className="text-sm text-gray-700 mt-1">
                            {item.description.length > 100
                              ? `${item.description.substring(0, 100)}...`
                              : item.description}
                          </p>
                        </div>
                      </div>

                      {/* Nút hành động */}
                      <div className="flex gap-2 justify-end">
                        <button className="w-28 h-10 border-2 border-cyan-700 text-cyan-700 font-semibold rounded-lg bg-white hover:bg-cyan-50 transition duration-300">
                          Chi tiết
                        </button>
                        <Link to={`${item.id}`}>
                          <button className="w-32 h-10 bg-gradient-to-r from-cyan-600 to-sky-700 text-white font-semibold rounded-lg shadow-lg hover:from-cyan-800 hover:to-blue-900 transition duration-300">
                            Chọn dịch vụ
                          </button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Tổng số bác sĩ */}
                <div className="flex justify-between items-center mt-4">
                  <div className="text-gray-600">
                    Tổng số dịch vụ: <b>{totalElements}</b>
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
              // )
            }
          </div>
        )
      }
      <Outlet />
    </>
  );
};

export default function ChonDichVu() {
  return <MainContent />;
}
