import React from "react";

function NotificationModal({ isOpen, onClose, message, onConfirm }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
      <div className="bg-white rounded-xl shadow-xl w-1/3">
        {/* Header */}
        <div className="bg-sky-600 text-white p-2 rounded-t-xl flex justify-between items-center">
          <h2 className="text-lg font-bold">Thông Báo</h2>
          <button
            onClick={onClose}
            className="text-white bg-transparent hover:bg-red-500 rounded-full p-1 flex items-center justify-center"
            style={{
              width: "30px",
              height: "30px",
            }}
          >
            ✕
          </button>
        </div>

        {/* Nội dung */}
        <div className="text-left px-6 py-8">
          <p className="text-gray-800 text-lg">{message}</p>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-4 pb-6 pr-6">
          <button
            onClick={onConfirm}
            className="bg-sky-600 text-white font-semibold py-2 px-8 rounded-lg hover:bg-blue-600 transition duration-200"
          >
            Đăng Nhập
          </button>
          <button
  onClick={onClose}
  className="bg-white text-sky-600 border border-sky-600 font-semibold py-2 px-8 rounded-lg hover:bg-gray-100 transition duration-200"
>
  Hủy
</button>

        </div>
      </div>
    </div>
  );
}

export default NotificationModal;
