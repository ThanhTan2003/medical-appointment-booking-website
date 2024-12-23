
import React, { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserNurse, faHandHoldingMedical, faPills, faSyringe, faPhone, faEnvelope, faClock, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import { Link } from "react-router-dom";

// MainContent Component
const MainContent = () => (
    <div className="flex flex-col md:flex-row items-center pl-8 pt-4">
        {/* Left Text Section */}
        <div className="w-full md:w-1/2 text-center md:text-left">
            <h4 className="text-gray-500 uppercase tracking-widest mb-2 text-1xl">
                PHÒNG KHÁM ĐA KHOA GIA ĐỊNH
            </h4>
            <h1 className="text-3xl font-bold leading-tight text-gray-800">
                Đặt lịch khám bệnh trực tuyến
            </h1>
            <h1 className="text-5xl font-bold leading-tight text-sky-700 relative">
                Dịch vụ khám chữa bệnh
                <div className="pt-4">
                    <span
                        className="absolute left-0 w-1/2 h-2 bg-cyan-600"
                        style={{
                            bottom: '-4px',
                            borderRadius: '9999px',
                        }}
                    ></span>
                </div>
            </h1>
            <p className="text-gray-600 mt-6 text-lg leading-relaxed">
                Đặt lịch khám trực tuyến với bác sĩ tại Phòng khám Đa khoa Gia Định.
                Đảm bảo sự tiện lợi và nhanh chóng trong việc chăm sóc sức khỏe.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row justify-center md:justify-start gap-4">
                {/* <button className="w-32 h-10 bg-gradient-to-r from-cyan-600 to-sky-700 text-white font-semibold rounded-lg shadow-lg hover:from-cyan-800 hover:to-blue-900 transition duration-300"> */}
                <button className="bg-gradient-to-r from-cyan-600 to-sky-700 text-white px-6 py-3 rounded-lg hover:from-cyan-800 hover:to-blue-900 transition font-semibold">
                    Đăng ký ngay
                </button>
                {/* <button className="w-28 h-10 border-2 border-cyan-700 text-cyan-700 font-semibold rounded-lg bg-white hover:bg-cyan-50 transition duration-300"></button> */}
                <button className="border border-cyan-700 text-cyan-700 px-6 py-3 rounded-lg bg-white hover:bg-cyan-50 transition font-semibold">
                    Hướng dẫn
                </button>
            </div>
        </div>
        <RightImageSection />
    </div>
);

// RightImageSection Component
const RightImageSection = () => (
    <div className="relative w-full md:w-1/2 md:mt-0">
        <div className="relative">
            <img
                src="https://careplusvn.com/files/quy-trinh-kham-benh-va-nhung-dieu-can-luu-y-2.jpg"
                alt="Coworking"
                className="w-full h-auto object-cover"
                style={{
                    clipPath: "polygon(10% 0, 100% 0, 100% 100%, 0 100%)",
                    maskImage: "linear-gradient(to top, rgba(0, 0, 0, 1) 10%, rgba(0, 0, 0, 0) 100%)",
                    WebkitMaskImage: "linear-gradient(to top, rgba(0, 0, 0, 1) 90%, rgba(0, 0, 0, 0) 100%)",
                }}
            />
        </div>
    </div>
);


const ServiceGrid = () => {
    const services = [
        { name: "Đặt khám theo bác sĩ", path: 'bac-si', icon: faUserNurse },
        { name: "Đặt khám theo chuyên khoa", path: 'chuyen-khoa', icon: faHandHoldingMedical },
        { name: "Đặt lịch khám theo dịch vụ", path: 'dich-vu', icon: faPills },
        { name: "Đặt lịch tiêm chủng", path: 'tiem-chung', icon: faSyringe },
    ];

    return (
        <div className="bg-slate-50 py-12">
            <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 px-4">
                {services.map((service, index) => (
                    <div
                        key={index}
                        className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition duration-300 transform hover:-translate-y-1 flex flex-col items-center"
                    >
                        <div className="text-5xl text-sky-700 mb-4">
                            <FontAwesomeIcon icon={service.icon} />
                        </div>
                        <p className="text-gray-800 font-semibold text-center leading-snug">
                            {service.name}
                        </p>
                        <div className="mt-3">
                            <Link
                                to={`/dat-lich-kham/${service.path}`}
                            >
                            <button className="w-32 h-10 bg-gradient-to-r from-cyan-600 to-sky-700 text-white font-semibold rounded-lg shadow-lg hover:from-cyan-800 hover:to-blue-900 transition duration-300">
                                Đăng ký khám
                            </button>
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
// Main CoworkingComponent
const TrangChu = () => (
    <div className="font-sans bg-white">
        <MainContent />
        <ServiceGrid />
    </div>
);

export default TrangChu;
