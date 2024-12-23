import React from "react";

function ConfirmModal({ isOpen, onClose, onConfirm, selectedDate, selectedTimeSlot }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50">
      <div className="bg-white rounded-lg shadow-lg w-1/3">
        {/* Tiêu đề Modal */}
        <div className="bg-blue-600 text-white p-4 flex justify-between items-center rounded-t-lg">
          <h2 className="text-lg font-bold">Xác nhận</h2>
          <button
            onClick={onClose}
            className="text-blue-600 bg-white hover:bg-blue-500 hover:text-white rounded-full flex items-center justify-center"
            style={{
              width: "30px",
              height: "30px",
            }}
          >
            X
          </button>
        </div>

        {/* Nội dung Modal */}
        <div className="text-center p-6">
          <p className="text-lg text-gray-700">
            Bạn có chắc chắn muốn chọn khung giờ{" "}
            <span className="font-bold text-blue-500">{selectedTimeSlot.name}</span> vào ngày{" "}
            <span className="font-bold text-blue-500">{selectedDate}</span> không?
          </p>
        </div>

        {/* Nút Hành Động */}
        <div className="flex justify-center gap-4 p-4">
          <button
            onClick={onConfirm}
            className="font-semibold bg-blue-500 text-white py-2 px-8 rounded hover:bg-blue-600 transition duration-200 w-32"
          >
            Có
          </button>
          <button
            onClick={onClose}
            className="font-semibold bg-gray-400 text-white py-2 px-8 rounded hover:bg-gray-500 transition duration-200 w-32"
          >
            Không
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;
