import React, { useState, useEffect } from "react";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getToken } from "../../../services/localStorageService";
import { CONFIG } from "../../../configurations/configuration";

const RELATIONSHIPS = ["Cha", "Mẹ", "Anh", "Chị", "Em", "Bản thân", "Khác"];
const OCCUPATIONS = [
    "Khác",
    "Học sinh",
    "Sinh viên",
    "Giáo viên",
    "Nhân viên văn phòng",
    "Nông dân",
    "Công nhân",
    "Lao động tự do",
];

function UpdatePatientModal({ isOpen, onClose, patientId }) {
    const [formData, setFormData] = useState({
        fullName: "",
        dateOfBirth: "",
        gender: "Nam",
        insuranceId: "",
        identificationCode: "",
        nation: "Việt Nam",
        occupation: OCCUPATIONS[0],
        phoneNumber: "",
        email: "",
        country: "Việt Nam",
        province: "",
        district: "",
        ward: "",
        address: "",
        relationship: RELATIONSHIPS[5],
        note: "",
    });

    const [loading, setLoading] = useState(false);

    // Fetch patient details to populate form
    const fetchPatientDetails = async () => {
        const token = getToken();
        if (!token) {
            toast.error("Vui lòng đăng nhập lại.");
            return;
        }

        try {
            const response = await fetch(
                `${CONFIG.API_GATEWAY}/patient/id/${patientId}`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!response.ok) {
                toast.error("Không thể tải thông tin hồ sơ. Vui lòng thử lại.");
                return;
            }

            const data = await response.json();
            setFormData(data);
        } catch (error) {
            console.error("Lỗi khi tải thông tin hồ sơ:", error);
            toast.error("Đã xảy ra lỗi. Vui lòng thử lại!");
        }
    };

    // Update form state on input change
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    // Handle form submission
    const handleSubmit = async () => {
        const requiredFields = [
            "fullName",
            "dateOfBirth",
            "identificationCode",
            "phoneNumber",
            "email",
            "address",
            "province",
            "district",
            "ward",
        ];

        // Validate required fields
        for (const field of requiredFields) {
            if (!formData[field]) {
                toast.error("Vui lòng nhập đầy đủ thông tin bắt buộc.");
                return;
            }
        }

        const token = getToken();
        if (!token) {
            toast.error("Vui lòng đăng nhập lại.");
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(
                `${CONFIG.API_GATEWAY}/patient/update-patient/${patientId}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(formData),
                }
            );

            if (response.ok) {
                toast.success("Cập nhật hồ sơ thành công!");
                onClose();
            } else {
                const data = await response.json();
                toast.error(data.message || "Có lỗi xảy ra, vui lòng thử lại.");
            }
        } catch (error) {
            console.error("Lỗi khi cập nhật hồ sơ:", error);
            toast.error("Đã xảy ra lỗi. Vui lòng thử lại!");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isOpen && patientId) {
            fetchPatientDetails();
        }
    }, [isOpen, patientId]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
            <div
                className="bg-white rounded-xl shadow-xl overflow-y-auto"
                style={{ maxWidth: "80%", width: "80%", maxHeight: "90vh" }}
            >
                <div
                    className="bg-yellow-600 text-white px-4 py-2 flex justify-between items-center sticky top-0 z-10"
                    style={{ borderBottom: "2px solid #ffffff" }}
                >
                    <h2 className="text-lg font-bold">Cập nhật thông tin hồ sơ</h2>
                    <button
                        onClick={onClose}
                        className="text-white hover:text-gray-200 transition duration-200"
                    >
                        ✕
                    </button>
                </div>

                <div className="p-6">

                    {/* Nội dung */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="fullName" className="block font-medium text-yellow-800">
                                Họ và tên
                            </label>
                            <input
                                id="fullName"
                                type="text"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleInputChange}
                                className="border p-2 rounded-lg w-full mt-1"
                            />
                        </div>
                        <div>
                            <label htmlFor="dateOfBirth" className="block font-medium text-yellow-800">
                                Ngày sinh
                            </label>
                            <input
                                id="dateOfBirth"
                                type="date"
                                name="dateOfBirth"
                                value={formData.dateOfBirth}
                                onChange={handleInputChange}
                                className="border p-2 rounded-lg w-full mt-1"
                            />
                        </div>
                        <div>
                            <label htmlFor="gender" className="block font-medium text-yellow-800">
                                Giới tính
                            </label>
                            <select
                                id="gender"
                                name="gender"
                                value={formData.gender}
                                onChange={handleInputChange}
                                className="border p-2 rounded-lg w-full mt-1"
                            >
                                <option value="Nam">Nam</option>
                                <option value="Nữ">Nữ</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="insuranceId" className="block font-medium text-yellow-800">
                                Mã bảo hiểm Y tế
                            </label>
                            <input
                                id="insuranceId"
                                type="text"
                                name="insuranceId"
                                value={formData.insuranceId || ""}
                                onChange={handleInputChange}
                                className="border p-2 rounded-lg w-full mt-1"
                            />
                        </div>
                        <div>
                            <label htmlFor="identificationCode" className="block font-medium text-yellow-800">
                                Số CMND/CCCD/Căn cước
                            </label>
                            <input
                                id="identificationCode"
                                type="text"
                                name="identificationCode"
                                value={formData.identificationCode || ""}
                                onChange={handleInputChange}
                                className="border p-2 rounded-lg w-full mt-1"
                            />
                        </div>
                        <div>
                            <label htmlFor="phoneNumber" className="block font-medium text-yellow-800">
                                Số điện thoại
                            </label>
                            <input
                                id="phoneNumber"
                                type="text"
                                name="phoneNumber"
                                value={formData.phoneNumber || ""}
                                onChange={handleInputChange}
                                className="border p-2 rounded-lg w-full mt-1"
                            />
                        </div>
                        <div>
                            <label htmlFor="email" className="block font-medium text-yellow-800">
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                name="email"
                                value={formData.email || ""}
                                onChange={handleInputChange}
                                className="border p-2 rounded-lg w-full mt-1"
                            />
                        </div>
                        <div>
                            <label htmlFor="occupation" className="block font-medium text-yellow-800">
                                Nghề nghiệp
                            </label>
                            <select
                                id="occupation"
                                name="occupation"
                                value={formData.occupation}
                                onChange={handleInputChange}
                                className="border p-2 rounded-lg w-full mt-1"
                            >
                                {OCCUPATIONS.map((occupation, index) => (
                                    <option key={index} value={occupation}>
                                        {occupation}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="province" className="block font-medium text-yellow-800">
                                Tỉnh/Thành
                            </label>
                            <input
                                id="province"
                                type="text"
                                name="province"
                                value={formData.province || ""}
                                onChange={handleInputChange}
                                className="border p-2 rounded-lg w-full mt-1"
                            />
                        </div>
                        <div>
                            <label htmlFor="district" className="block font-medium text-yellow-800">
                                Quận/Huyện
                            </label>
                            <input
                                id="district"
                                type="text"
                                name="district"
                                value={formData.district || ""}
                                onChange={handleInputChange}
                                className="border p-2 rounded-lg w-full mt-1"
                            />
                        </div>
                        <div>
                            <label htmlFor="ward" className="block font-medium text-yellow-800">
                                Xã/Phường
                            </label>
                            <input
                                id="ward"
                                type="text"
                                name="ward"
                                value={formData.ward || ""}
                                onChange={handleInputChange}
                                className="border p-2 rounded-lg w-full mt-1"
                            />
                        </div>
                        <div>
                            <label htmlFor="address" className="block font-medium text-yellow-800">
                                Địa chỉ
                            </label>
                            <input
                                id="address"
                                type="text"
                                name="address"
                                value={formData.address || ""}
                                onChange={handleInputChange}
                                className="border p-2 rounded-lg w-full mt-1"
                            />
                        </div>
                        <div>
                            <label htmlFor="relationship" className="block font-medium text-yellow-800">
                                Mối quan hệ
                            </label>
                            <select
                                id="relationship"
                                name="relationship"
                                value={formData.relationship}
                                onChange={handleInputChange}
                                className="border p-2 rounded-lg w-full mt-1"
                            >
                                {RELATIONSHIPS.map((relationship, index) => (
                                    <option key={index} value={relationship}>
                                        {relationship}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="col-span-2">
                            <label htmlFor="note" className="block font-medium text-yellow-800">
                                Ghi chú
                            </label>
                            <textarea
                                id="note"
                                name="note"
                                value={formData.note || ""}
                                onChange={handleInputChange}
                                className="border p-2 rounded-lg w-full mt-1"
                                rows={4}
                            ></textarea>
                        </div>
                    </div>


                    <div className="mt-6 flex justify-end gap-4">
                        <button
                            onClick={onClose}
                            className="bg-white border border-yellow-600 text-yellow-600 px-4 py-2 rounded-lg font-bold"
                        >
                            Hủy
                        </button>
                        <button
                            onClick={handleSubmit}
                            className="bg-yellow-600 text-white px-4 py-2 rounded-lg font-bold"
                        >
                            {loading ? "Đang cập nhật..." : "Cập nhật"}
                        </button>
                    </div>
                </div>
                <ToastContainer transition={Bounce} />
            </div>
        </div>
    );
}

export default UpdatePatientModal;
