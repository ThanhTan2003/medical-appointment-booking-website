import React from "react";

const CustomModal = ({ isOpen, title, message, onClose, onConfirm, confirmText, cancelText }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-65 z-50">
      <div className="bg-white rounded-lg shadow-lg w-1/3">
        {/* Header */}
        <div className="bg-sky-600 text-white py-3 px-4 rounded-t-lg flex justify-between items-center">
          <h2 className="text-lg font-bold">{title || "Thông Báo"}</h2>
          <button
            onClick={onClose}
            className="text-white hover:bg-red-500 rounded-full p-1 flex items-center justify-center"
            style={{
              width: "30px",
              height: "30px",
            }}
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="p-6 text-gray-800 text-justify">
          <p>{message || "Nội dung thông báo"}</p>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-4 px-6 py-4">
          {onConfirm && (
            <button
              onClick={onConfirm}
              className="bg-sky-600 text-white px-4 py-2 rounded-lg hover:bg-sky-700 font-semibold"
            >
              {confirmText || "Xác nhận"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomModal;
