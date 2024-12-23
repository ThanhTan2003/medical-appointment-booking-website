import React from 'react'

export default function TiemChung() {
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
