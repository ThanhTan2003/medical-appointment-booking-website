import React, { useState } from "react";

const specialties = [
  { name: "Mắt", hospital: "Bệnh viện Nhi Đồng 1", icon: "👁️" },
  { name: "Răng Hàm Mặt - Phẫu Thuật Hàm Mặt 1", hospital: "Bệnh viện Nhi Đồng 1", icon: "🦷" },
  { name: "KHOA MẮT", hospital: "Bệnh viện Nhi Đồng Thành phố Cần Thơ", icon: "👁️" },
  { name: "Ngoại tiêu hóa - Gan mật Ngoại tiêu hóa - Gan mật", hospital: "Bệnh viện Nhi Đồng 1", icon: "🩺" },
  { name: "KHOA RĂNG HÀM MẶT", hospital: "Bệnh viện Nhi Đồng Thành phố Cần Thơ", icon: "🦷" },
  { name: "Ngoại Khoa Gan Mật Tụy", hospital: "Bệnh viện đa khoa Singapore", icon: "🩺" },
  { name: "Mắt", hospital: "Bệnh viện Quốc tế City - CIH", icon: "👁️" },
  { name: "Khám Mắt", hospital: "Bệnh viện đa khoa Hồng Hà", icon: "👁️" },
];
const Pagination = ({ currentPage, totalPages, onPageChange }) => (
  <div className="flex justify-center items-center mt-6">
    <button
      onClick={() => onPageChange(currentPage - 1)}
      disabled={currentPage === 1}
      className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
    >
      &lt;
    </button>
    {[...Array(totalPages)].map((_, index) => (
      <button
        key={index}
        onClick={() => onPageChange(index + 1)}
        className={`mx-1 px-3 py-1 rounded ${currentPage === index + 1
          ? "bg-blue-500 text-white"
          : "bg-gray-200 hover:bg-gray-300"
          }`}
      >
        {index + 1}
      </button>
    ))}
    <button
      onClick={() => onPageChange(currentPage + 1)}
      disabled={currentPage === totalPages}
      className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
    >
      &gt;
    </button>
  </div>
);
const MainContent = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;
  const totalPages = Math.ceil(specialties.length / itemsPerPage);

  const displayedItems = specialties.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {displayedItems.map((item, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-md p-4 flex flex-col justify-between relative"
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
                  className="text-2xl font-bold bg-clip-text text-transparent"
                  style={{
                    backgroundImage: "linear-gradient(to right, #0078B7, #004F8C)",
                  }}
                >
                  {item.name.toUpperCase()}
                </h4>
                <p className="text-lg text-gray-700 font-medium mt-1">
                  <span className="italic">Giá:</span>{" "}
                  <span className="font-semibold">{item.price || "Liên hệ"}</span>
                </p>
              </div>
            </div>

            {/* Nút hành động */}
            <div className="flex gap-2 justify-end">
              <button className="w-28 h-10 border-2 border-cyan-700 text-cyan-700 font-semibold rounded-lg bg-white hover:bg-cyan-50 transition duration-300">
                Chi tiết
              </button>
              <button className="w-32 h-10 bg-gradient-to-r from-cyan-600 to-sky-700 text-white font-semibold rounded-lg shadow-lg hover:from-cyan-800 hover:to-blue-900 transition duration-300">
                Đặt khám ngay
              </button>
            </div>
          </div>
        ))}
      </div>
      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </>
  )
}
export default function DanhSachTiemChung() {
  return (
    <MainContent />
  )
}
