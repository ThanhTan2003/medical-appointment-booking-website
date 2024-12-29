import React, { useEffect, useState } from 'react'
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { getToken } from "../../../services/localStorageService";
import { CONFIG } from "../../../configurations/configuration";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAnglesLeft } from '@fortawesome/free-solid-svg-icons';

import { ToastContainer, toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function ThongTinDangKy({ appointment }) {
    return (
        <div>
            {appointment ? (
                <>
                    {/* Khung thông tin bác sĩ với tiêu đề trên cạnh trên */}
                    <div className="border border-blue-600 rounded-lg shadow-md relative p-4">
                        {/* Tiêu đề trên cạnh trên */}
                        <div className="absolute -top-4 left-4 bg-white px-2 text-blue-900 font-bold text-2xl">
                            THÔNG TIN LỊCH HẸN
                        </div>
                        <br></br>
                        {/* Nội dung khung */}
                        {/* <div className="md:col-span-2 pr-6 text-justify pt-2">
                            <div className="grid grid-cols-1 md:grid-cols-[3fr,7fr,3fr,7fr,3fr,7fr] gap-4"> */}
                        <div className="md:col-span-2 pr-6 text-justify">
                            <div className="grid grid-cols-1 md:grid-cols-[3fr,7fr,3fr,7fr] gap-4">
                                <p className="text-lg">
                                    <strong>Mã lịch hẹn: </strong>
                                </p>

                                <p className="text-lg">
                                    {appointment?.id || "Không có thông tin!"}
                                </p>

                                <p className="text-lg">
                                    <strong>Thời gian đặt: </strong>
                                </p>

                                <p className="text-lg">
                                    {appointment?.dateTimeFullName || "Không có thông tin!"}
                                </p>

                                <p className="text-lg">
                                    <strong>Dịch vụ: </strong>
                                </p>

                                <p className="text-lg">
                                    {appointment?.serviceTimeFrame?.serviceName || "Không có thông tin!"}
                                </p>

                                <p className="text-lg">
                                    <strong>Bác sĩ: </strong>
                                </p>

                                <p className="text-lg">
                                    {appointment?.serviceTimeFrame?.doctorQualificationName + " " + appointment?.serviceTimeFrame?.doctorName || "Không có thông tin!"}
                                </p>

                                <p className="text-lg">
                                    <strong>Số thứ tự: </strong>
                                </p>

                                <p className="text-lg">
                                    {appointment?.orderNumber || "Không có thông tin!"}
                                </p>

                                <p className="text-lg">
                                    <strong>Phòng: </strong>
                                </p>

                                <p className="text-lg">
                                    {appointment?.serviceTimeFrame?.roomName || "Không có thông tin!"}
                                </p>

                                <p className="text-lg">
                                    <strong>Ngày khám: </strong>
                                </p>

                                <p className="text-lg">
                                    {appointment?.dateFullName || "Không có thông tin!"}
                                </p>

                                <p className="text-lg">
                                    <strong>Khung giờ: </strong>
                                </p>

                                <p className="text-lg">
                                    {appointment?.serviceTimeFrame?.timeFrameNameFullName || "Không có thông tin!"}
                                </p>

                                <p className="text-lg">
                                    <strong>Trạng thái: </strong>
                                </p>

                                <p className="text-lg">
                                    {appointment?.status || "Không có thông tin!"}
                                </p>

                                <img
                                    src={`https://barcode.tec-it.com/barcode.ashx?data=${appointment.id}&code=Code128&dpi=96`}
                                    alt="Mã vạch lịch hẹn"
                                    className="object-cover col-span-2"
                                />
                            </div>
                        </div>

                    </div>
                </>
            ) : (
                <div className="text-center text-xl text-gray-500">
                    {/* Không tìm thấy thông tin bác sĩ. */}
                </div>
            )}
        </div>
    );

}

function ThongTinHoSo({ patientsId }) {
    const [patients, setPatients] = useState(null);

    const navigate = useNavigate();

    const getPatients = async (accessToken) => {
        try {
            const response = await fetch(
                `${CONFIG.API_GATEWAY}/patient/id/${patientsId}`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );

            if (response.status === 401) {
                console.error("Unauthorized: Token invalid or expired");
                navigate("/login");
                return;
            }

            const data = await response.json();
            console.log("patientsId: " + patientsId)
            console.log("patients: " + data)
            setPatients(data || []);

        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {

        }
    }

    useEffect(() => {
        const accessToken = getToken();
        if (!accessToken) {
            navigate('/login');
        } else {
            getPatients(accessToken);
        }
    }, [navigate, patientsId]);

    return (
        <div>
            {patients ? (
                <>
                    {/* Khung thông tin bác sĩ với tiêu đề trên cạnh trên */}
                    <div className="border border-blue-600 rounded-lg shadow-md relative p-4">
                        {/* Tiêu đề trên cạnh trên */}
                        <div className="absolute -top-4 left-4 bg-white px-2 text-blue-900 font-bold text-2xl">
                            THÔNG TIN HỒ SƠ ĐĂNG KÝ
                        </div>
                        <br></br>
                        {/* Nội dung khung */}
                        {/* <div className="md:col-span-2 pr-6 text-justify pt-2">
                            <div className="grid grid-cols-1 md:grid-cols-[3fr,7fr,3fr,7fr,3fr,7fr] gap-4"> */}
                        <div className="md:col-span-2 pr-6 text-justify pt-2">
                            <div className="grid grid-cols-1 md:grid-cols-[3fr,7fr,3fr,7fr] gap-4">
                                <p className="text-lg">
                                    <strong>Mã hồ sơ: </strong>
                                </p>

                                <p className="text-lg">
                                    {patients?.id || "Không có thông tin!"}
                                </p>

                                <p className="text-lg">
                                    <strong>Họ tên: </strong>
                                </p>

                                <p className="text-lg">
                                    {patients?.fullName || "Không có thông tin!"}
                                </p>

                                <p className="text-lg">
                                    <strong>Ngày sinh: </strong>
                                </p>

                                <p className="text-lg">
                                    {patients?.dateOfBirth || "Không có thông tin!"}
                                </p>

                                <p className="text-lg">
                                    <strong>Giới tính: </strong>
                                </p>

                                <p className="text-lg">
                                    {patients?.gender || "Không có thông tin!"}
                                </p>

                                <p className="text-lg">
                                    <strong>Quốc gia: </strong>
                                </p>

                                <p className="text-lg">
                                    {patients?.nation || "Không có thông tin!"}
                                </p>

                                <p className="text-lg">
                                    <strong>Số CCCD: </strong>
                                </p>

                                <p className="text-lg">
                                    {patients?.identificationCode || "Không có thông tin!"}
                                </p>

                                <p className="text-lg">
                                    <strong>Số điện thoại: </strong>
                                </p>

                                <p className="text-lg">
                                    {patients?.phoneNumber || "Không có thông tin!"}
                                </p>

                                <p className="text-lg">
                                    <strong>Email: </strong>
                                </p>

                                <p className="text-lg">
                                    {patients?.email || "Không có thông tin!"}
                                </p>

                                <p className="text-lg">
                                    <strong>Nghề nghiệp: </strong>
                                </p>

                                <p className="text-lg">
                                    {patients?.occupation || "Không có thông tin!"}
                                </p>

                                <p className="text-lg">
                                    <strong>Số BHYT: </strong>
                                </p>

                                <p className="text-lg">
                                    {patients?.insuranceId || "Không có thông tin!"}
                                </p>

                                <p className="text-lg">
                                    <strong>Địa chỉ: </strong>
                                </p>

                                <p className="text-lg">
                                    {patients.address + ", " + patients.ward + ", " + patients.district + ", " + patients.province || "Không có thông tin!"}
                                </p>


                                <img
                                    src={`https://barcode.tec-it.com/barcode.ashx?data=${patients.id}&code=Code128&dpi=96`}
                                    alt="Mã vạch lịch hẹn"
                                    className="object-cover col-span-2"
                                />

                            </div>
                        </div>

                    </div>
                </>
            ) : (
                <div className="text-center text-xl text-gray-500">
                    <p>Không có dữ liệu</p>
                </div>
            )}
        </div>
    );

}



function ThongTinKetQua({ healthCheckResults, appointmentId, onAddResult }) {
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // Trạng thái hiển thị ConfirmModal
    const [isAddModalOpen, setIsAddModalOpen] = useState(false); // Trạng thái hiển thị AddResultModal
    const [selectedResult, setSelectedResult] = useState(null);

    // Hàm xóa kết quả
    const deleteResult = async (resultId) => {
        try {
            const response = await fetch(
                `${CONFIG.API_GATEWAY}/his/health-check-result/delete/${resultId}`,
                {
                    method: "DELETE",
                }
            );

            if (response.ok) {
                //alert("Xóa thành công!");
                if (onAddResult) onAddResult();
            } else {
                alert("Có lỗi xảy ra khi xóa!");
            }
        } catch (error) {
            console.error("Lỗi khi gọi API xóa:", error);
        }
    };

    // Hàm xử lý khi nhấn nút Xóa
    const handleDelete = (result) => {
        setSelectedResult(result);
        setIsDeleteModalOpen(true); // Mở ConfirmModal
    };

    return (
        <div>
            {healthCheckResults ? (
                <>
                    <div className="border border-blue-600 rounded-lg shadow-md relative p-4 bg-white">
                        <div className="absolute -top-4 left-4 bg-white px-2 text-blue-900 font-bold text-2xl">
                            THÔNG TIN KẾT QUẢ KHÁM BỆNH
                        </div>
                        <br />
                        <div className="md:col-span-2 pr-6 text-justify">
                            <table className="w-full border-collapse border border-gray-200 shadow-lg rounded-md">
                                <thead>
                                    <tr className="bg-sky-600 text-white">
                                        <th className="border border-gray-200 p-3 text-center">STT</th>
                                        <th className="border border-gray-200 p-3 text-left">Tên kết quả</th>
                                        <th className="border border-gray-200 p-3 text-center"></th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white">
                                    {healthCheckResults.length > 0 ? (
                                        healthCheckResults.map((result, index) => (
                                            <tr
                                                key={result.id}
                                                className="hover:bg-gray-100 transition duration-200 ease-in-out"
                                            >
                                                <td className="border border-gray-200 p-2 text-center">
                                                    {index + 1}
                                                </td>
                                                <td className="border border-gray-200 p-2 text-zinc-700">
                                                    {result.name}
                                                </td>
                                                <td className="border border-gray-200 p-2 text-center w-[200px]">
                                                    <button
                                                        onClick={() =>
                                                            window.open(result.url, "_blank")
                                                        }
                                                        className="bg-white text-cyan-600 border border-cyan-600 px-4 py-2 rounded-md hover:bg-cyan-100 transition duration-75 w-4/5"
                                                    >
                                                        Xem chi tiết
                                                    </button>
                                                </td>
                                                
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="4" className="text-center p-4">
                                                Không có dữ liệu
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            ) : (
                <div className="text-center text-xl text-gray-500">
                    Không có kết quả kiểm tra sức khỏe
                </div>
            )}

        </div>
    );
}

function ChiTietLichKham() {

    const navigate = useNavigate();

    const [patientsId, setPatientsId] = useState()

    const [paymentId, setPaymentId] = useState()

    const [appointment, setAppointment] = useState(null);

    const { appointmentId } = useParams();

    const [healthCheckResults, setHealthCheckResults] = useState([]);

    const getAppointment = async (accessToken) => {
        try {
            console.log(appointmentId)
            const response = await fetch(
                `${CONFIG.API_GATEWAY}/appointment/id/${appointmentId}`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );

            if (response.status === 401) {
                console.error("Unauthorized: Token invalid or expired");
                navigate("/login");
                return;
            }
            console.log(`${CONFIG.API_GATEWAY}/appointment/id/${appointmentId}`)
            const data = await response.json();
            setAppointment(data || []);
            console.log(data.patientsId)
            setPatientsId(data.patientsId)
            setPaymentId(data.paymentId)
            setHealthCheckResults(data.checkResultResponseList)

        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {

        }
    }

    useEffect(() => {
        const accessToken = getToken();
        if (!accessToken) {
            navigate('/login');
        } else {
            getAppointment(accessToken);
        }
    }, [navigate, appointmentId]);


    return (
        <div className='p-2'>
          
            {/* Nút quay lại danh sách */}
            <div className="flex justify-start mb-4">
            <button
              onClick={() => navigate(-1)}
              className="px-6 py-2 bg-white border border-sky-600 text-sky-600 font-bold rounded-lg hover:bg-gray-100"
            >
              {"<<"}
            </button>
          </div>
            <br />

            <ThongTinDangKy appointment={appointment} />
            <ThongTinHoSo patientsId={patientsId} />
            <ThongTinKetQua
                healthCheckResults={healthCheckResults}
                appointmentId={appointmentId}
                onAddResult={getAppointment} // Truyền hàm callback
            />

        </div>
    )

}

export default ChiTietLichKham;