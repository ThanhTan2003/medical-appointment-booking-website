import React, { useState, useEffect } from "react";
import { Link, Outlet, useNavigate, useParams } from "react-router-dom";
import { getToken } from "../../../services/localStorageService";
import { CONFIG } from "../../../configurations/configuration";
import AddPatientModal from "../../DatLichKham/HoSo/AddPatientModal";
import PatientDetailsModal from "../../DatLichKham/HoSo/PatientDetailsModal";
import UpdatePatientModal from "../../DatLichKham/HoSo/UpdatePatientModal";

const ChonHoSo = () => {
  const [patientProfiles, setPatientProfiles] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(4);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [selectedPatientId, setSelectedPatientId] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

  const { patientsId } = useParams();
  
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
        `${CONFIG.API_GATEWAY}/patient/customer/patient-details?page=${currentPage}&size=${pageSize}`,
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
  }, [currentPage]);

  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxDisplayPages = 3;

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

          {/* Nút thêm hồ sơ mới */}
          <div className="flex justify-end mt-6">
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-sky-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-sky-700 transition duration-300 font-bold"
            >
              Thêm hồ sơ mới +
            </button>
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
                  </div>
                </div>
                <div className="flex justify-end gap-2 mt-4">
                  {/* <button
                    className="w-24 h-10 border-2 border-red-400 text-red-400 bg-white font-semibold rounded-lg hover:bg-red-50 transition duration-300"
                    onClick={() => console.log("Xóa hồ sơ:", profile.id)}
                  >
                    Xóa
                  </button> */}
                  <button
                    className="w-24 h-10 border-2 border-yellow-500 text-yellow-500 bg-white font-semibold rounded-lg hover:bg-yellow-50 transition duration-300"
                    onClick={() => {
                      setSelectedPatientId(profile.id);
                      setIsUpdateModalOpen(true);
                    }}
                  >
                    Cập nhật
                  </button>
                  <button
                    className="w-24 h-10 border-2 border-sky-500 text-sky-500 bg-white font-semibold rounded-lg hover:bg-blue-50 transition duration-300"
                    onClick={() => {
                      setSelectedPatientId(profile.id);
                      setIsDetailsModalOpen(true);
                    }}
                  >
                    Chi tiết
                  </button>

                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center mt-6 space-x-2">
            {getPageNumbers().map((pageNumber, index) => (
              <button
                key={index}
                onClick={() => setCurrentPage(pageNumber)}
                className={`p-2 border border-gray-300 rounded-md transition duration-200 ${currentPage === pageNumber
                  ? "bg-sky-600 text-white"
                  : "bg-gray-100 hover:bg-gray-200"
                  }`}
              >
                {pageNumber}
              </button>
            ))}
          </div>
        </div>
      )}
      <Outlet />

      <AddPatientModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          fetchPatientProfiles();
        }}
      />
      <PatientDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        patientId={selectedPatientId}
      />
      <UpdatePatientModal
        isOpen={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
        patientId={selectedPatientId}
      />
    </>
  );
};

export default ChonHoSo;
