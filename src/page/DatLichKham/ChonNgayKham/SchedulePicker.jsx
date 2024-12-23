import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";

function SchedulePicker({
    doctorServiceId,
    availableDays,
    holidayMatrix,
    specificHolidays,
    onDateTimeSelection,
    setSelectedDate, // Truyền từ MainContent
}) {
    const today = new Date();
    const oneMonthLater = new Date(today);
    oneMonthLater.setMonth(today.getMonth() + 1);

    const [currentMonth, setCurrentMonth] = useState(today.getMonth());
    const [currentYear, setCurrentYear] = useState(today.getFullYear());
    const [selectedDate, setSelectedDateState] = useState(null); // Thêm khai báo `selectedDate` state

    const [timeSlots, setTimeSlots] = useState([]);
    const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);

    // Hàm xử lý khi người dùng chọn ngày
    const handleDateSelection = (date) => {
        console.log("Ngày được chọn:", date);
        setSelectedDateState(date); // Cập nhật state nội bộ
        setSelectedDate(date); // Cập nhật state bên ngoài thông qua prop
        setSelectedTimeSlot(null); // Xóa thông tin khung giờ cũ
        setTimeSlots([]); // Reset danh sách khung giờ cũ

        const dayOfWeek = Object.keys(dayMapping).find(
            (key) => dayMapping[key] === date.getDay()
        );
        if (!dayOfWeek) return; // Đảm bảo dayOfWeek hợp lệ trước khi gọi API

        // Gọi API để lấy danh sách khung giờ cho ngày đã chọn
        fetchTimeSlots(dayOfWeek, date.toISOString().split("T")[0]);
    };

// Hàm xử lý khi người dùng chọn khung giờ
const handleTimeSlotClick = (slot) => {
    setSelectedTimeSlot(slot); // Lưu thông tin khung giờ đã chọn
    if (selectedDate && slot) {
        // Điều chỉnh thời gian theo múi giờ GMT+7
        const adjustedDate = new Date(selectedDate.getTime() + 7 * 60 * 60 * 1000);

        // Chuyển ngày thành định dạng yyyy-MM-dd (ISO format)
        const year = adjustedDate.getFullYear();
        const month = String(adjustedDate.getMonth() + 1).padStart(2, "0");
        const day = String(adjustedDate.getDate()).padStart(2, "0");
        const formattedDate = `${year}-${month}-${day}`;

        console.log("Formatted date sent to backend:", formattedDate);

        // Truyền dữ liệu đã chỉnh sửa sang MainContent
        onDateTimeSelection(formattedDate, slot);
    }
};


    // Ánh xạ ngày trong tuần
    const dayMapping = {
        CN: 0,
        "2": 1,
        "3": 2,
        "4": 3,
        "5": 4,
        "6": 5,
        "7": 6,
    };

    const numericAvailableDays = availableDays.map((day) => {
        if (dayMapping[day] !== undefined) {
            return dayMapping[day];
        }
        throw new Error(`Invalid day: ${day}`);
    });

    const isHoliday = (day, month, year) => {
        const dateString = `${year}/${month + 1}/${day}`;
        if (specificHolidays.includes(dateString)) return true;
        return holidayMatrix.some(
            ([holidayDay, holidayMonth]) =>
                holidayDay === day && holidayMonth - 1 === month
        );
    };

    const getDaysInMonth = (month, year) => {
        const days = [];
        const date = new Date(year, month, 1);
        const firstDayOfWeek = date.getDay();

        // Thêm các ô trống trước ngày 1
        for (let i = 0; i < firstDayOfWeek; i++) {
            days.push(null);
        }

        // Thêm các ngày trong tháng
        while (date.getMonth() === month) {
            days.push(new Date(date));
            date.setDate(date.getDate() + 1);
        }

        return days;
    };

    const daysInMonth = getDaysInMonth(currentMonth, currentYear);

    const prevMonth = () => {
        if (currentMonth === today.getMonth() && currentYear === today.getFullYear()) return;
        if (currentMonth === 0) {
            setCurrentMonth(11);
            setCurrentYear(currentYear - 1);
        } else {
            setCurrentMonth(currentMonth - 1);
        }
    };

    const nextMonth = () => {
        const nextDate = new Date(currentYear, currentMonth + 1, 1);
        if (nextDate > oneMonthLater) return;
        if (currentMonth === 11) {
            setCurrentMonth(0);
            setCurrentYear(currentYear + 1);
        } else {
            setCurrentMonth(currentMonth + 1);
        }
    };

    const isSelectable = (day, month, year) => {
        const date = new Date(year, month, day);
        const isValidDay = numericAvailableDays.includes(date.getDay());
        const maxSelectableDate = new Date(today);
        maxSelectableDate.setMonth(today.getMonth() + 1);
        maxSelectableDate.setDate(today.getDate());

        return (
            date > today &&
            date <= maxSelectableDate &&
            isValidDay &&
            !isHoliday(day, month, year)
        );
    };

    // Gọi API lấy danh sách khung giờ khi chọn ngày
    const fetchTimeSlots = async (dayOfWeek, day) => {
        try {
            const response = await fetch(
                `http://localhost:8080/api/v1/medical/service-time-frame/public/get-by-doctor-service-and-day?doctorServiceId=${doctorServiceId}&dayOfWeek=${dayOfWeek}&day=${day}`
            );
            const data = await response.json();
            setTimeSlots(
                data.map((slot) => ({
                    id: slot.id,
                    session: slot.timeFrameResponse.session,
                    name: slot.timeFrameResponse.name,
                }))
            );
        } catch (error) {
            console.error("Lỗi khi lấy danh sách khung giờ:", error);
        }
    };

    return (
        <div className="flex gap-4 max-w-7xl mx-auto">
            {/* Lịch (70%) */}
            <div className="w-7/12 bg-white rounded-lg shadow">
                <div className="flex justify-between items-center mb-4 bg-sky-600 p-4 rounded-t-md">
                    <button
                        onClick={prevMonth}
                        disabled={currentMonth === today.getMonth() && currentYear === today.getFullYear()}
                        className="text-white hover:bg-cyan-700 p-2 rounded-full"
                    >
                        <FontAwesomeIcon icon={faChevronLeft} size="lg" />
                    </button>
                    <h2 className="text-lg font-bold text-white">
                        THÁNG {currentMonth + 1} - {currentYear}
                    </h2>
                    <button
                        onClick={nextMonth}
                        className="text-white hover:bg-cyan-700 p-2 rounded-full"
                    >
                        <FontAwesomeIcon icon={faChevronRight} size="lg" />
                    </button>
                </div>
                <div className="grid grid-cols-7 gap-2 text-center p-4">
                    {["CN", "Hai", "Ba", "Tư", "Năm", "Sáu", "Bảy"].map((day) => (
                        <div key={day} className="text-cyan-800 font-bold">
                            {day}
                        </div>
                    ))}
                    {daysInMonth.map((date, index) => {
                        if (!date) {
                            return <div key={index} className="p-2"></div>;
                        }

                        const isAvailable = isSelectable(
                            date.getDate(),
                            date.getMonth(),
                            date.getFullYear()
                        );
                        const isToday =
                            date.getDate() === today.getDate() &&
                            date.getMonth() === today.getMonth() &&
                            date.getFullYear() === today.getFullYear();

                        const isSelected =
                            selectedDate &&
                            selectedDate.toISOString().split("T")[0] === date.toISOString().split("T")[0];

                        return (
                            <button
                                key={index}
                                disabled={!isAvailable}
                                className={`p-2 rounded-lg ${isToday
                                        ? "bg-red-300 text-white"
                                        : isSelected
                                            ? "bg-sky-600 text-white font-bold"
                                            : isAvailable
                                                ? "bg-sky-100 text-cyan-700 hover:bg-sky-200 font-semibold"
                                                : "bg-gray-100 text-gray-400"
                                    }`}
                                onClick={() => {
                                    if (isAvailable) {
                                        handleDateSelection(date);
                                    }
                                }}
                            >
                                {date.getDate()}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Danh sách khung giờ (30%) */}
            <div className="w-5/12 bg-white rounded-lg shadow">
                {/* Tiêu đề khung giờ */}
                <div className="bg-sky-600 text-white rounded-t-lg">
                    <p className="text-lg font-bold p-4 pt-5 pb-5 text-center">DANH SÁCH CÁC KHUNG GIỜ</p>
                </div>
                {/* Nội dung khung giờ */}
                <div className="p-4">
                    {timeSlots.length > 0 ? (
                        <>
                            {Object.entries(
                                timeSlots.reduce((sessions, slot) => {
                                    if (!sessions[slot.session]) sessions[slot.session] = [];
                                    sessions[slot.session].push(slot);
                                    return sessions;
                                }, {})
                            ).map(([session, slots]) => (
                                <div key={session} className="mb-4">
                                    <h4 className="text-md font-bold text-gray-600 pb-2">Buổi {session}</h4>
                                    <div className="grid grid-cols-3 gap-2">
                                        {slots.map((slot) => (
                                            <button
                                                key={slot.id}
                                                className={`p-2 text-center rounded-lg border ${selectedTimeSlot === slot.id
                                                        ? "bg-sky-600 text-white"
                                                        : "bg-white text-cyan-700 border-sky-700 hover:bg-sky-100"
                                                    }`}
                                                onClick={() => handleTimeSlotClick(slot)} // Gọi hàm khi người dùng click vào khung giờ
                                            >
                                                {slot.name}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                            {/* Dòng mô tả múi giờ */}
                            <p className="mt-4 text-base text-gray-500">
                                Tất cả thời gian theo múi giờ Việt Nam <b>GMT +7</b>
                            </p>
                        </>
                    ) : (
                        <div className="text-center text-gray-500">Không có khung giờ khả dụng.</div>
                    )}
                </div>
            </div>


        </div>
    );
};

export default SchedulePicker;
