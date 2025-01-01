import React, { useState, useEffect } from "react";
import { Link, Outlet, useNavigate, useParams } from "react-router-dom";
import { getToken } from "../../../services/localStorageService";
import { CONFIG } from "../../../configurations/configuration";
import AddPatientModal from "./AddPatientModal";

const ChonHoSo = () => {
    const [patientProfiles, setPatientProfiles] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(6);
    const [totalElements, setTotalElements] = useState(0);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { patientsId } = useParams();

    const { serviceTimeFrameId } = useParams();
      const { date } = useParams();

    const navigate = useNavigate();

    const fetchPatientProfiles = async () => {
        const token = getToken();
        if (!token) {
            navigate("/login");
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(
                `${CONFIG.API_GATEWAY}/patient/customer/unbooked-patient-details?page=${currentPage}&size=${pageSize}&serviceTimeFrameId=${serviceTimeFrameId}&date=${date}`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await response.json();
            setPatientProfiles(data.data || []);
            setTotalPages(data.totalPages || 1);
            setTotalElements(data.totalElements || 0);
        } catch (error) {
            console.error("Error fetching patient profiles:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPatientProfiles();
    }, [currentPage, pageSize]);

    const getPageNumbers = () => {
        const pageNumbers = [];
        const maxDisplayPages = 4;

        for (let i = currentPage - maxDisplayPages; i <= currentPage + maxDisplayPages; i++) {
            if (i > 0 && i <= totalPages) {
                pageNumbers.push(i);
            }
        }

        return pageNumbers;
    };

    return (
        <>
            {!patientsId && (
                <div>
                    <div className="text-center">
                        <h1
                            className="text-3xl font-bold"
                            style={{
                                background: "linear-gradient(to right, #0078B7, #00A3E0)",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                            }}
                        >
                            CHỌN HỒ SƠ
                        </h1>
                        <div className="mt-2 w-32 mx-auto h-1 bg-gradient-to-r from-cyan-600 to-blue-800 rounded-full"></div>
                    </div>

                    {/* Danh sách hồ sơ */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                        {patientProfiles.map((profile, index) => (
                            <div
                                key={index}
                                className="bg-white rounded-lg shadow-md p-4 flex flex-col justify-between relative border border-slate-50 hover:border hover:border-sky-900"
                                style={{ minHeight: "200px" }}
                            >
                                <div>
                                    <h4 className="text-xl font-bold text-blue-900 pb-2">{profile.fullName}</h4>
                                    <hr />
                                    <div className="grid grid-cols-[auto,1fr] gap-y-1 gap-x-1 pt-2">
                                        <div className="text-sm font-semibold text-gray-600 pr-4">Mã hồ sơ:</div>
                                        <div className="text-sm text-gray-800">{profile.id}</div>
                                        <div className="text-sm font-semibold text-gray-600 pr-4">Ngày sinh:</div>
                                        <div className="text-sm text-gray-800">
                                            {new Date(profile.dateOfBirth).toLocaleDateString("vi-VN", {
                                                day: "2-digit",
                                                month: "2-digit",
                                                year: "numeric",
                                            })}
                                        </div>
                                        <div className="text-sm font-semibold text-gray-600 pr-4">Giới tính:</div>
                                        <div className="text-sm text-gray-800">{profile.gender}</div>
                                        <div className="text-sm font-semibold text-gray-600 pr-4">Số căn cước:</div>
                                        <div className="text-sm text-gray-800">
                                            {profile.identificationCode.replace(/(\d{3})\d{6}(\d{3})/, "$1****$2")}
                                        </div>
                                        <div className="text-sm font-semibold text-gray-600 pr-4">Số điện thoại:</div>
                                        <div className="text-sm text-gray-800">
                                            {profile.phoneNumber.replace(/(\d{3})\d{4}(\d{3})/, "$1****$2")}
                                        </div>
                                        <div className="text-sm font-semibold text-gray-600 pr-4">Địa chỉ:</div>
                                        <div className="text-sm text-gray-800">
                                            {profile.address}, {profile.ward}, {profile.district}, {profile.province}
                                        </div>
                                        <div className="text-sm font-semibold text-gray-600 pr-4">Dân tộc:</div>
                                        <div className="text-sm text-gray-800">{profile.nation}</div>
                                    </div>
                                </div>
                                <div className="flex justify-end gap-2 mt-4">
                                    <button
                                        className="w-24 h-10 border-2 border-blue-600 text-blue-600 font-semibold rounded-lg bg-white hover:bg-blue-50 transition duration-300"
                                        onClick={() => console.log("Chi tiết hồ sơ:", profile.id)}
                                    >
                                        Chi tiết
                                    </button>
                                    <Link to={`${profile.id}`}>
                                    <button
                                        className="w-32 h-10 bg-gradient-to-r from-cyan-600 to-sky-700 text-white font-semibold rounded-lg shadow-lg hover:from-cyan-800 hover:to-blue-900 transition duration-300"
                                        onClick={() => console.log("Chọn hồ sơ:", profile.id)}
                                    >
                                        Chọn hồ sơ
                                    </button>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Nút thêm mới */}
                    <div className="flex justify-end mt-6">
                        <button
                            className="w-36 h-12 bg-gradient-to-r from-sky-500 to-sky-600 text-white font-semibold rounded-lg shadow-lg hover:from-sky-600 hover:to-sky-800 transition duration-300"
                            onClick={() => setIsModalOpen(true)}
                        >
                            + Thêm mới hồ sơ
                        </button>
                    </div>

                    {/* Pagination */}
                    <div className="flex justify-center mt-6 space-x-2">
                        {getPageNumbers().map((pageNumber, index) =>
                            typeof pageNumber === "number" ? (
                                <button
                                    key={index}
                                    onClick={() => setCurrentPage(pageNumber)}
                                    style={currentPage === pageNumber ? { color: "#fff", backgroundColor: "#0066CC" } : {}}
                                    className="p-2 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 transition duration-200"
                                >
                                    {pageNumber}
                                </button>
                            ) : (
                                <span key={index} style={{ margin: "0 5px" }}>
                                    ...
                                </span>
                            )
                        )}
                    </div>

                    {/* Modal thêm mới hồ sơ */}
                    <AddPatientModal
                        isOpen={isModalOpen}
                        onClose={() => {
                            setIsModalOpen(false);
                            fetchPatientProfiles();
                        }}
                    />
                </div>
            )}
            <Outlet />

        </>
    );
};

export default ChonHoSo;
