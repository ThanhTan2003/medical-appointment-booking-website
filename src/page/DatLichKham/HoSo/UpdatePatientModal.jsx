import React, { useState, useEffect } from "react";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getToken } from "../../../services/localStorageService";
import { CONFIG } from "../../../configurations/configuration";

const NATIONS = [
    "Kinh", "Tày", "Thái", "Hoa", "Khmer", "Mường", "Nùng", "H'Mông", "Dao", "Gia Rai",
    "Ê Đê", "Ba Na", "Xơ Đăng", "Sán Chay", "Cơ Ho", "Chăm", "Sán Dìu", "Hrê", "Mnông", "Ra Glai",
    "Xtiêng", "Bru-Vân Kiều", "Thổ", "Giáy", "Cơ Tu", "Giẻ-Triêng", "Mạ", "Khơ Mú", "Co", "Tà Ôi",
    "Chơ Ro", "Kháng", "Xinh Mun", "Hà Nhì", "Chu Ru", "Lào", "La Chí", "La Ha", "Phù Lá", "La Hủ",
    "Lự", "Lô Lô", "Chứt", "Mảng", "Pà Thẻn", "Co Lao", "Cống", "Bố Y", "Si La", "Pu Péo", "Brâu",
    "Rơ Măm", "Ơ Đu"
];

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
        nation: "",
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

    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);
    const [selectedProvinceCode, setSelectedProvinceCode] = useState("");
    const [selectedDistrictCode, setSelectedDistrictCode] = useState("");
    const [loading, setLoading] = useState(false);
    const [dropdownLoading, setDropdownLoading] = useState(false);

    const fetchProvinces = async () => {
        const token = getToken();
        try {
            const response = await fetch(`${CONFIG.API_GATEWAY}/patient/vietnam-units/province`, {
                method: "GET",
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await response.json();
            setProvinces(data || []); // Cập nhật trạng thái
            return data; // Trả về danh sách tỉnh để sử dụng ngay lập tức
        } catch (error) {
            console.error("Error fetching provinces:", error);
            return [];
        }
    };

    const fetchDistricts = async (provinceCode) => {
        const token = getToken();
        setDropdownLoading(true);
        try {
            const response = await fetch(
                `${CONFIG.API_GATEWAY}/patient/vietnam-units/district/province-code/${provinceCode}`,
                {
                    method: "GET",
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            const data = await response.json();
            setDistricts(data || []);
            return data; // Trả về danh sách huyện
        } catch (error) {
            console.error("Error fetching districts:", error);
            return [];
        } finally {
            setDropdownLoading(false);
        }
    };

    const fetchWards = async (districtCode) => {
        const token = getToken();
        setDropdownLoading(true);
        try {
            const response = await fetch(
                `${CONFIG.API_GATEWAY}/patient/vietnam-units/ward/district-code/${districtCode}`,
                {
                    method: "GET",
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            const data = await response.json();
            setWards(data || []);
            return data; // Trả về danh sách xã
        } catch (error) {
            console.error("Error fetching wards:", error);
            return [];
        } finally {
            setDropdownLoading(false);
        }
    };


    const fetchPatientDetails = async (provincesData) => {
        const token = getToken();
        if (!token) {
            toast.error("Vui lòng đăng nhập lại.");
            return;
        }

        try {
            const response = await fetch(`${CONFIG.API_GATEWAY}/patient/id/${patientId}`, {
                method: "GET",
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!response.ok) {
                toast.error("Không thể tải thông tin hồ sơ. Vui lòng thử lại.");
                return;
            }
            const data = await response.json();
            setFormData(data);

            console.log("Hồ sơ: ", data);

            // Xử lý tỉnh
            const province = provincesData.find((item) => item.fullName === data.province);
            if (province) {
                setSelectedProvinceCode(province.code);
                const districtsData = await fetchDistricts(province.code); // Tải danh sách huyện

                // Xử lý huyện
                const district = districtsData.find((item) => item.fullName === data.district);
                if (district) {
                    setSelectedDistrictCode(district.code);
                    const wardsData = await fetchWards(district.code); // Tải danh sách xã

                    // Xử lý xã
                    const ward = wardsData.find((item) => item.fullName === data.ward);
                    if (ward) {
                        setFormData((prevData) => ({ ...prevData, ward: ward.fullName }));
                    }
                }
            }
        } catch (error) {
            console.error("Lỗi khi tải thông tin hồ sơ:", error);
            toast.error("Đã xảy ra lỗi. Vui lòng thử lại!");
        }
    };


    const handleProvinceChange = async (e) => {
        const provinceCode = e.target.value;
        setSelectedProvinceCode(provinceCode);
        const selectedProvince = provinces.find((item) => item.code === provinceCode);
        setFormData({ ...formData, province: selectedProvince?.fullName || "", district: "", ward: "" });
        setDistricts([]);
        setWards([]);
        await fetchDistricts(provinceCode);
    };

    const handleDistrictChange = async (e) => {
        const districtCode = e.target.value;
        setSelectedDistrictCode(districtCode);
        const selectedDistrict = districts.find((item) => item.code === districtCode);
        setFormData({ ...formData, district: selectedDistrict?.fullName || "", ward: "" });
        setWards([]);
        await fetchWards(districtCode);
    };

    const handleWardChange = (e) => {
        const wardName = e.target.value;
        setFormData({ ...formData, ward: wardName });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleNationChange = (e) => {
        console.log(e.target.value)
        setFormData({ ...formData, nation: e.target.value });
    };


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
            "nation"
        ];

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
        console.log("dữ liệu gửi đi:")
        console.log(formData)
        console.log("..............................")
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
        const initializeData = async () => {
            if (isOpen) {
                console.log("Lấy danh sách tỉnh...");
                const provincesData = await fetchProvinces(); // Chờ fetchProvinces hoàn tất
                console.log("Danh sách tỉnh: ", provincesData);

                if (patientId) {
                    console.log("Lấy thông tin hồ sơ...");
                    await fetchPatientDetails(provincesData); // Truyền danh sách tỉnh vào
                }
            }
        };

        initializeData();
    }, [isOpen, patientId]);


    if (!isOpen) return null;


    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
            <div
                className="bg-white rounded-xl shadow-xl overflow-y-auto"
                style={{ maxWidth: "80%", width: "80%", maxHeight: "90vh" }}
            >
                <div className="bg-yellow-600 text-white px-4 py-2 flex justify-between items-center sticky top-0 z-10">
                    <h2 className="text-lg font-bold">Cập nhật thông tin hồ sơ</h2>
                    <button
                        onClick={onClose}
                        className="text-white hover:text-gray-200 transition duration-200"
                    >
                        ✕
                    </button>
                </div>

                <div className="p-6">
                    <div className="grid grid-cols-2 gap-4">
                        {/* Thông tin cá nhân */}
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
                            <label htmlFor="nation" className="block font-medium text-yellow-800">
                                Dân tộc
                            </label>
                            <select
                                id="nation"
                                name="nation"
                                value={formData.nation}
                                onChange={handleNationChange}
                                className="border p-2 rounded-lg w-full mt-1"
                            >
                                <option value="">Chọn dân tộc</option>
                                {NATIONS.map((nation, index) => (
                                    <option key={index} value={nation}>
                                        {nation}
                                    </option>
                                ))}
                            </select>
                        </div>
                        {/* <div>
              <label htmlFor="nation" className="block font-medium text-yellow-800">
                Quốc tịch
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
            </div> */}
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

                        {/* Địa chỉ */}
                        <div>
                            <label htmlFor="province" className="block font-medium text-yellow-800">
                                Tỉnh/Thành
                            </label>
                            <select
                                id="province"
                                name="province"
                                value={selectedProvinceCode}
                                onChange={handleProvinceChange}
                                className="border p-2 rounded-lg w-full mt-1"
                            >
                                <option value="">Chọn Tỉnh/Thành</option>
                                {provinces.map((province) => (
                                    <option key={province.code} value={province.code}>
                                        {province.fullName}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="district" className="block font-medium text-yellow-800">
                                Quận/Huyện
                            </label>
                            <select
                                id="district"
                                name="district"
                                value={selectedDistrictCode}
                                onChange={handleDistrictChange}
                                className="border p-2 rounded-lg w-full mt-1"
                            >
                                <option value="">Chọn Quận/Huyện</option>
                                {districts.map((district) => (
                                    <option key={district.code} value={district.code}>
                                        {district.fullName}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="ward" className="block font-medium text-yellow-800">
                                Xã/Phường
                            </label>
                            <select
                                id="ward"
                                name="ward"
                                value={formData.ward}
                                onChange={handleWardChange}
                                className="border p-2 rounded-lg w-full mt-1"
                            >
                                <option value="">Chọn Xã/Phường</option>
                                {wards.map((ward) => (
                                    <option key={ward.code} value={ward.fullName}>
                                        {ward.fullName}
                                    </option>
                                ))}
                            </select>
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
