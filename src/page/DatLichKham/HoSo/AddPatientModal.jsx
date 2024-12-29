import React, { useState, useEffect } from "react";
import { Link, Outlet, useNavigate, useParams } from "react-router-dom";
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

function AddPatientModal({ isOpen, onClose }) {
    const navigate = useNavigate();
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

    // State lưu code của tỉnh/thành và quận/huyện
    const [selectedProvinceCode, setSelectedProvinceCode] = useState("");
    const [selectedDistrictCode, setSelectedDistrictCode] = useState("");

    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);
    const [acceptTerms, setAcceptTerms] = useState(false);

    useEffect(() => {
        const token = getToken();
        if (!token) {
            toast.error("Không tìm thấy token! Vui lòng đăng nhập lại.");
            navigate("/login");
            return;
        }

        const fetchProvinces = async () => {
            try {
                const response = await fetch(`${CONFIG.API_GATEWAY}/patient/vietnam-units/province`, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.status === 401) {
                    toast.error("Phiên làm việc đã hết hạn. Vui lòng đăng nhập lại.");
                    navigate("/login");
                    return;
                }

                const data = await response.json();
                if (Array.isArray(data)) {
                    setProvinces(data);
                } else {
                    toast.error("Dữ liệu tỉnh/thành không hợp lệ.");
                }
            } catch (error) {
                console.error("Error fetching province data:", error);
                toast.error("Đã xảy ra lỗi khi tải dữ liệu tỉnh/thành.");
            }
        };

        const fetchCustomerInfo = async () => {
            try {
                const response = await fetch(`${CONFIG.API_GATEWAY}/identity/customer/get-info`, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.status === 401) {
                    toast.error("Phiên làm việc đã hết hạn. Vui lòng đăng nhập lại.");
                    navigate("/login");
                    return;
                }

                const data = await response.json();
                setFormData((prev) => ({
                    ...prev,
                    phoneNumber: data.phoneNumber || "",
                    email: data.email || "",
                }));
            } catch (error) {
                console.error("Error fetching customer info:", error);
                toast.error("Đã xảy ra lỗi khi tải thông tin khách hàng.");
            }
        };

        fetchProvinces();
        fetchCustomerInfo();
    }, []);

    useEffect(() => {
        if (selectedProvinceCode) {
            const token = getToken();
            const fetchDistricts = async () => {
                try {
                    const response = await fetch(
                        `${CONFIG.API_GATEWAY}/patient/vietnam-units/district/province-code/${selectedProvinceCode}`,
                        {
                            method: "GET",
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        }
                    );

                    if (response.status === 401) {
                        toast.error("Phiên làm việc đã hết hạn. Vui lòng đăng nhập lại.");
                        navigate("/login");
                        return;
                    }

                    const data = await response.json();
                    if (Array.isArray(data)) {
                        setDistricts(data);
                    } else {
                        toast.error("Dữ liệu quận/huyện không hợp lệ.");
                    }
                } catch (error) {
                    console.error("Error fetching district data:", error);
                    toast.error("Đã xảy ra lỗi khi tải dữ liệu quận/huyện.");
                }
            };

            fetchDistricts();
        } else {
            setDistricts([]);
        }
    }, [selectedProvinceCode]);

    useEffect(() => {
        if (selectedDistrictCode) {
            const token = getToken();
            const fetchWards = async () => {
                try {
                    const response = await fetch(
                        `${CONFIG.API_GATEWAY}/patient/vietnam-units/ward/district-code/${selectedDistrictCode}`,
                        {
                            method: "GET",
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        }
                    );

                    if (response.status === 401) {
                        toast.error("Phiên làm việc đã hết hạn. Vui lòng đăng nhập lại.");
                        navigate("/login");
                        return;
                    }

                    const data = await response.json();
                    if (Array.isArray(data)) {
                        setWards(data);
                    } else {
                        toast.error("Dữ liệu xã/phường không hợp lệ.");
                    }
                } catch (error) {
                    console.error("Error fetching ward data:", error);
                    toast.error("Đã xảy ra lỗi khi tải dữ liệu xã/phường.");
                }
            };

            fetchWards();
        } else {
            setWards([]);
        }
    }, [selectedDistrictCode]);


    const handleProvinceChange = (e) => {
        const selectedCode = e.target.value; // Lấy mã tỉnh từ dropdown
        const selectedProvince = provinces.find((item) => item.code === selectedCode);

        console.log("Selected Province Code:", selectedCode); // Debug: kiểm tra mã tỉnh được chọn
        console.log("Selected Province Name:", selectedProvince?.fullName); // Debug: kiểm tra tên tỉnh

        setSelectedProvinceCode(selectedCode); // Lưu mã tỉnh
        setFormData({
            ...formData,
            province: selectedProvince?.fullName || "", // Lưu tên tỉnh vào formData
            district: "", // Reset quận/huyện
            ward: "", // Reset xã/phường
        });
        setDistricts([]); // Reset danh sách quận/huyện
        setWards([]); // Reset danh sách xã/phường
    };


    const handleDistrictChange = (e) => {
        const selectedCode = e.target.value; // Lấy mã huyện từ dropdown
        const selectedDistrict = districts.find((item) => item.code === selectedCode);

        console.log("Selected District Code:", selectedCode); // Debug: kiểm tra mã huyện được chọn
        console.log("Selected District Name:", selectedDistrict?.fullName); // Debug: kiểm tra tên huyện

        setSelectedDistrictCode(selectedCode); // Lưu mã huyện
        setFormData({
            ...formData,
            district: selectedDistrict?.fullName || "", // Lưu tên huyện vào formData
            ward: "", // Reset xã/phường
        });
        setWards([]); // Reset danh sách xã/phường
    };

    const handleWardChange = (e) => {
        const selectedWard = wards.find((item) => item.fullName === e.target.value);
        console.log("Selected Ward:", selectedWard?.fullName); // Debug: kiểm tra tên xã/phường

        setFormData({
            ...formData,
            ward: selectedWard?.fullName || "", // Lưu tên xã/phường vào formData
        });
    };


    const handleSubmit = async () => {
        const requiredFields = [
            "fullName",
            "dateOfBirth",
            "identificationCode",
            "phoneNumber",
            "email",
            "address",
        ];
    
        // Kiểm tra các trường bắt buộc (khác tỉnh/thành, huyện, xã)
        for (const field of requiredFields) {
            if (!formData[field]) {
                toast.error(`Vui lòng nhập đầy đủ thông tin!`);
                return;
            }
        }
    
        // Kiểm tra Tỉnh/Thành
        if (!selectedProvinceCode || !formData.province) {
            toast.error("Vui lòng chọn Tỉnh/Thành.");
            return;
        }
    
        // Kiểm tra Huyện
        if (!selectedDistrictCode || !formData.district) {
            toast.error("Vui lòng chọn Quận/Huyện.");
            return;
        }
    
        // Kiểm tra Xã/Phường
        if (!formData.ward) {
            toast.error("Vui lòng chọn Xã/Phường.");
            return;
        }
    
        // Kiểm tra điều khoản
        if (!acceptTerms) {
            toast.error("Bạn cần chấp nhận điều khoản trước khi tạo hồ sơ mới.");
            return;
        }
    
        const token = getToken();
        if (!token) {
            toast.error("Không tìm thấy token! Vui lòng đăng nhập lại.");
            return;
        }
    
        try {
            const response = await fetch(`${CONFIG.API_GATEWAY}/patient/create-patient`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(formData),
            });
    
            const data = await response.json();
            if (response.ok) {
                toast.success("Tạo hồ sơ mới thành công!");
                onClose();
                return;
            } else {
                toast.error(data.message || "Có lỗi xảy ra, vui lòng thử lại.");
            }
        } catch (error) {
            console.error("Lỗi khi tạo hồ sơ mới:", error);
            toast.error("Đã xảy ra lỗi. Vui lòng thử lại!");
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value // Ghi đè giá trị của field đang thay đổi
        });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
            <div
                className="bg-white rounded-xl shadow-xl overflow-y-auto"
                style={{ maxWidth: "80%", width: "80%", maxHeight: "90vh" }}
            >
                <div
                    className="bg-blue-600 text-white px-4 py-2 flex justify-between items-center sticky top-0 z-10"
                    style={{ borderBottom: "2px solid #ffffff" }}
                >
                    <h2 className="text-lg font-bold">Thêm Hồ Sơ Mới</h2>
                    <button
                        onClick={onClose}
                        className="text-white hover:text-gray-200 transition duration-200"
                    >
                        ✕
                    </button>
                </div>

                <div className="p-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="fullName" className="block font-medium text-sky-800">
                                Họ và tên <span className="text-red-800">(*)</span>
                            </label>
                            <input
                                id="fullName"
                                type="text"
                                name="fullName"
                                placeholder="Họ và tên"
                                value={formData.fullName}
                                onChange={handleInputChange}
                                className="border p-2 rounded-lg w-full mt-1"
                            />
                        </div>
                        <div>
                            <label htmlFor="dateOfBirth" className="block font-medium text-sky-800">
                                Ngày sinh <span className="text-red-800">(*)</span>
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
                            <label htmlFor="gender" className="block font-medium text-sky-800">
                                Giới tính <span className="text-red-800">(*)</span>
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
                            <label htmlFor="insuranceId" className="block font-medium text-sky-800">
                                Mã bảo hiểm Y tế
                            </label>
                            <input
                                id="insuranceId"
                                type="text"
                                name="insuranceId"
                                placeholder="Mã bảo hiểm"
                                value={formData.insuranceId}
                                onChange={handleInputChange}
                                className="border p-2 rounded-lg w-full mt-1"
                            />
                        </div>
                        <div>
                            <label htmlFor="identificationCode" className="block font-medium text-sky-800">
                                Số CMND/CCCD/Căn cước <span className="text-red-800">(*)</span>
                            </label>
                            <input
                                id="identificationCode"
                                type="text"
                                name="identificationCode"
                                placeholder="CMND/CCCD"
                                value={formData.identificationCode}
                                onChange={handleInputChange}
                                className="border p-2 rounded-lg w-full mt-1"
                            />
                        </div>
                        <div>
                            <label htmlFor="phoneNumber" className="block font-medium text-sky-800">
                                Số điện thoại <span className="text-red-800">(*)</span>
                            </label>
                            <input
                                id="phoneNumber"
                                type="text"
                                name="phoneNumber"
                                placeholder="Số điện thoại"
                                value={formData.phoneNumber}
                                onChange={handleInputChange}
                                className="border p-2 rounded-lg w-full mt-1"
                            />
                        </div>
                        <div>
                            <label htmlFor="email" className="block font-medium text-sky-800">
                                Email <span className="text-red-800">(*)</span> (địa chỉ email nhận thông tin lịch hẹn đặt khám)
                            </label>
                            <input
                                id="email"
                                type="email"
                                name="email"
                                placeholder="Email"
                                value={formData.email}
                                onChange={handleInputChange}
                                className="border p-2 rounded-lg w-full mt-1"
                            />
                        </div>
                        <div>
                            <label htmlFor="nation" className="block font-medium text-sky-800">
                                Quốc tịch <span className="text-red-800">(*)</span>
                            </label>
                            <select
                                id="nation"
                                name="nation"
                                value={formData.nation}
                                onChange={handleInputChange}
                                className="border p-2 rounded-lg w-full mt-1"
                            >
                                <option value="Việt Nam">Việt Nam</option>
                                <option value="Nước ngoài">Nước ngoài</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="occupation" className="block font-medium text-sky-800">
                                Nghề nghiệp <span className="text-red-800">(*)</span>
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
                            <label htmlFor="province" className="block font-medium text-sky-800">
                                Tỉnh/Thành <span className="text-red-800">(*)</span>
                            </label>
                            <select
                                id="province"
                                name="province"
                                value={selectedProvinceCode} // Sử dụng `selectedProvinceCode` thay vì `formData.province`
                                onChange={handleProvinceChange}
                                className="border p-2 rounded-lg w-full mt-1"
                            >
                                <option value="">Chọn Tỉnh/Thành</option>
                                {provinces.map((item) => (
                                    <option key={item.code} value={item.code}>
                                        {item.fullName}
                                    </option>
                                ))}
                            </select>

                        </div>

                        <div>
                            <label htmlFor="district" className="block font-medium text-sky-800">
                                Quận/Huyện <span className="text-red-800">(*)</span>
                            </label>
                            <select
                                id="district"
                                name="district"
                                value={selectedDistrictCode} // Sử dụng `selectedDistrictCode` thay vì `formData.district`
                                onChange={handleDistrictChange}
                                className="border p-2 rounded-lg w-full mt-1"
                            >
                                <option value="">Chọn Quận/Huyện</option>
                                {districts.map((item) => (
                                    <option key={item.code} value={item.code}>
                                        {item.fullName}
                                    </option>
                                ))}
                            </select>
                        </div>


                        <div>
                            <label htmlFor="ward" className="block font-medium text-sky-800">
                                Xã/Phường <span className="text-red-800">(*)</span>
                            </label>
                            <select
                                id="ward"
                                name="ward"
                                value={formData.ward} // Giá trị hiển thị phải khớp với `formData.ward`
                                onChange={handleWardChange}
                                className="border p-2 rounded-lg w-full mt-1"
                            >
                                <option value="">Chọn Xã/Phường</option>
                                {wards.map((item) => (
                                    <option key={item.code} value={item.fullName}>
                                        {item.fullName}
                                    </option>
                                ))}
                            </select>
                        </div>


                        <div>
                            <label htmlFor="address" className="block font-medium text-sky-800">
                                Địa chỉ <span className="text-red-800">(*)</span>
                            </label>
                            <input
                                id="address"
                                type="text"
                                name="address"
                                placeholder="Địa chỉ"
                                value={formData.address}
                                onChange={handleInputChange}
                                className="border p-2 rounded-lg w-full mt-1"
                            />
                        </div>
                        <div>
                            <label htmlFor="relationship" className="block font-medium text-sky-800">
                                Mối quan hệ <span className="text-red-800">(*)</span>
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
                            <label htmlFor="note" className="block font-medium text-sky-800">
                                Ghi chú (tiền sử bệnh án, các thông tin bổ sung)
                            </label>
                            <textarea
                                id="note"
                                name="note"
                                placeholder="Thêm ghi chú (nếu có)"
                                value={formData.note}
                                onChange={handleInputChange}
                                className="border p-2 rounded-lg w-full mt-1"
                                rows={4} // Đặt số hàng để khung textarea hiển thị rõ
                            />
                        </div>
                    </div>

                    <div className="mt-4">
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                checked={acceptTerms}
                                onChange={() => setAcceptTerms(!acceptTerms)}
                                className="mr-2"
                            />
                            Tôi cam đoan những thông tin trên là sự thật và chịu trách nhiệm hoàn toàn về các thông tin đã cung cấp.
                        </label>
                    </div>

                    <div className="mt-6 flex justify-end gap-4">
                        <button
                            onClick={onClose}
                            className="bg-white border border-sky-600 text-sky-600 hover:bg-slate-50 px-4 py-2 rounded-lg pl-8 pr-8 font-bold"
                        >
                            Hủy
                        </button>
                        <button
                            onClick={handleSubmit}
                            className="bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-lg font-bold"
                        >
                            Tạo hồ sơ mới
                        </button>
                    </div>
                </div>
                <ToastContainer transition={Bounce} />
            </div>
        </div>


    );
}

export default AddPatientModal;
