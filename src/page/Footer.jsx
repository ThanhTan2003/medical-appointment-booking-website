import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhone, faEnvelope, faClock, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';

export default function Footer (){
    return (
        <footer className="bg-blue-50 py-10 text-gray-700">
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 px-4">
                {/* Thông tin liên hệ */}
                <div className="bg-cyan-600 text-white p-6 rounded-lg shadow-md">
                    <h3 className="text-xl font-bold mb-4">PHÒNG KHÁM ĐA KHOA GIA ĐỊNH</h3>
                    <div className="flex items-center mb-3">
                        <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2" />
                        <p>21a Ấp Bắc, Phường 1, Thành phố Mỹ Tho, Tỉnh Tiền Giang</p>
                    </div>
                    <div className="flex items-center mb-3">
                        <FontAwesomeIcon icon={faPhone} className="mr-2" />
                        <p className="text-2xl font-bold">1900 6923</p>
                    </div>
                    <div className="flex items-center mb-3">
                        <FontAwesomeIcon icon={faEnvelope} className="mr-2" />
                        <p>contact.us@umcclinic.com.vn</p>
                    </div>
                    <div className="flex items-center">
                        <FontAwesomeIcon icon={faClock} className="mr-2" />
                        <p>
                            Lịch làm việc: Thứ 2 - Thứ 7 (7:30 - 16:30)
                        </p>
                    </div>
                </div>

                {/* Liên kết nhanh */}
                <div>
                    <h4 className="text-lg font-bold mb-3">LIÊN KẾT NHANH</h4>
                    <ul className="space-y-2">
                        <li>Giới thiệu</li>
                        <li>Chuyên khoa</li>
                        <li>Đội ngũ bác sĩ</li>
                        <li>Tin tức</li>
                        <li>Hướng dẫn khách hàng</li>
                        <li>Liên hệ</li>
                    </ul>
                </div>

                {/* Liên kết khác */}
                <div>
                    <h4 className="text-lg font-bold mb-3">LIÊN KẾT</h4>
                    <ul className="space-y-2">
                        <li>Cổng thông tin điện tử Bộ Y Tế</li>
                        <li>Cổng thông tin điện tử Sở Y Tế Tỉnh Tiền Giang</li>
                        <li>Cập nhật thông báo Sở Y Tế Tỉnh Tiền Giang</li>
                    </ul>
                    <div className="mt-4">
                        <img
                            src="https://bvndgiadinh.org.vn/wp-content/uploads/slider/cache/5fbfde5cb04078d91408df5fcdfd5410/bv1-2.jpg"
                            alt="Facebook Page"
                            className="w-full rounded-lg"
                        />
                    </div>
                </div>
            </div>

            {/* Bản quyền */}
            <div className="text-center mt-8 text-sm text-gray-500">
                Giấy phép hoạt động số 06883 TG-GPHĐ
                <br />
                2024 © Phòng khám Đa khoa Gia Định.
            </div>
        </footer>
    );
};
