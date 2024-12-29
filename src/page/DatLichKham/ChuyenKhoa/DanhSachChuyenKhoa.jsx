import React, { useEffect, useState } from "react";
import { Link, Outlet, useNavigate, useParams } from "react-router-dom";
import { CONFIG } from "../../../configurations/configuration";

export default function DanhSachChuyenKhoa() {
  const [specialties, setSpecialties] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);
  const [loading, setLoading] = useState(true);

  const { specialtyId } = useParams();

  // Hàm lấy danh sách chuyên khoa
  const fetchSpecialties = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${CONFIG.API_GATEWAY}/doctor/specialty/public/get-all?page=${currentPage}&size=${pageSize}`
      );
      const data = await response.json();
      setSpecialties(data.data || []);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSpecialties();
  }, [currentPage]);

  // Hàm để tạo số trang hiển thị
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxDisplayPages = 4;

    if (currentPage > 5) {
      pageNumbers.push(1);
      if (currentPage > 6) {
        pageNumbers.push("...");
      }
    }

    for (let i = currentPage - maxDisplayPages; i <= currentPage + maxDisplayPages; i++) {
      if (i > 0 && i <= totalPages) {
        pageNumbers.push(i);
      }
    }

    if (currentPage < totalPages - maxDisplayPages - 1) {
      pageNumbers.push("...");
    }

    if (currentPage < totalPages - maxDisplayPages) {
      pageNumbers.push(totalPages);
    }

    return pageNumbers;
  };

  return (
    <>
      {
        !specialtyId && (
          <div className="">
            {/* Tiêu đề */}
            <div className="text-center pb-2">
              <h1
                className="text-3xl font-bold relative"
                style={{
                  background: "linear-gradient(to right, #0078B7, #00A3E0)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                CHỌN CHUYÊN KHOA
              </h1>
              <div className="mt-2 w-32 mx-auto h-1 bg-gradient-to-r from-cyan-600 to-blue-800 rounded-full"></div>
            </div>

            <br />

            {/* Danh sách chuyên khoa */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {specialties.map((specialty) => (
                <div
                  key={specialty.specialtyId}
                  className="bg-white rounded-lg shadow-md p-4 flex flex-col justify-between relative"
                  style={{ minHeight: "180px" }}
                >
                  {/* Nội dung */}
                  <div className="flex items-center gap-6 mb-6">
                    <img
                      src={`/icons/specialty/${specialty.image}` || "https://cdn-icons-png.flaticon.com/512/1976/1976945.png"}
                      alt="specialty-icon"
                      className="w-16 h-16 object-contain"
                    />
                    <div className="flex-1">
                      <h4
                        className="text-2xl font-bold bg-clip-text text-transparent"
                        style={{
                          backgroundImage: "linear-gradient(to right, #0078B7, #004F8C)",
                        }}
                      >
                        {specialty.specialtyName.toUpperCase()}
                      </h4>
                      <p className="text-sm text-gray-700 mt-1">
                        {specialty.description.length > 100
                          ? `${specialty.description.substring(0, 100)}...`
                          : specialty.description}
                      </p>
                    </div>
                  </div>

                  {/* Nút hành động */}
                  <div className="flex gap-2 justify-end">
                    <button className="w-28 h-10 border-2 border-cyan-700 text-cyan-700 font-semibold rounded-lg bg-white hover:bg-cyan-50 transition duration-300">
                      Chi tiết
                    </button>
                    <Link to={`${specialty.specialtyId}`}>
                      <button className="w-40 h-10 bg-gradient-to-r from-cyan-600 to-sky-700 text-white font-semibold rounded-lg shadow-lg hover:from-cyan-800 hover:to-blue-900 transition duration-300">
                        Chọn chuyên khoa
                      </button>
                    </Link>

                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center mt-6">
              {getPageNumbers().map((pageNumber, index) =>
                typeof pageNumber === "number" ? (
                  <button
                    key={index}
                    onClick={() => setCurrentPage(pageNumber)}
                    className={`mx-1 px-3 py-1 rounded ${currentPage === pageNumber
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 hover:bg-gray-300"
                      }`}
                  >
                    {pageNumber}
                  </button>
                ) : (
                  <span key={index} className="mx-1 px-3 py-1">
                    ...
                  </span>
                )
              )}
            </div>
          </div>)
      }
      <Outlet />
    </>

  );
}
