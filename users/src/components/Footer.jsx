import React from 'react';
import { FaFacebook, FaTwitter, FaInstagram, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* About */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4 text-white">Về chúng tôi</h3>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl font-bold">
                <span className="text-gray-100">Equip</span>
                <span className="text-blue-400">Mart</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed">
              Hệ thống quản lý mượn trả thiết bị hiện đại, giúp sinh viên dễ dàng
              tiếp cận và sử dụng các thiết bị phục vụ học tập.
            </p>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4 text-white">Liên hệ</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-sm hover:text-blue-400 transition-colors">
                <FaPhoneAlt className="text-blue-400 flex-shrink-0" />
                <a href="tel:0123456789" className="hover:underline">0123.456.789</a>
              </li>
              <li className="flex items-center gap-3 text-sm hover:text-blue-400 transition-colors">
                <FaEnvelope className="text-blue-400 flex-shrink-0" />
                <a href="mailto:support@equipmart.com" className="hover:underline break-all">
                  support@equipmart.com
                </a>
              </li>
              <li className="flex items-start gap-3 text-sm">
                <FaMapMarkerAlt className="text-blue-400 flex-shrink-0 mt-1" />
                <span>Học viên Công nghệ Bưu chính Viễn thông</span>
              </li>
            </ul>
          </div>

          {/* Social & Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4 text-white">Kết nối</h3>
            <div className="flex gap-4">
              <a
                href="#"
                className="text-gray-400 hover:text-blue-400 transition-colors"
                title="Facebook"
              >
                <FaFacebook className="text-2xl" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-blue-400 transition-colors"
                title="Twitter"
              >
                <FaTwitter className="text-2xl" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-blue-400 transition-colors"
                title="Instagram"
              >
                <FaInstagram className="text-2xl" />
              </a>
            </div>

            {/* Quick Links */}
            <div className="mt-6 pt-6 border-t border-gray-800">
              <h4 className="text-sm font-semibold mb-4 text-white">Liên kết nhanh</h4>
              <ul className="grid grid-cols-2 gap-2 text-sm">
                <li>
                  <a href="#" className="hover:text-blue-400 transition-colors">Điều khoản</a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-400 transition-colors">Chính sách</a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-400 transition-colors">Hướng dẫn</a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-400 transition-colors">Trợ giúp</a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-center md:text-left">
              &copy; 2024 EquipMart. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-sm">
              <a href="#" className="hover:text-blue-400 transition-colors">Điều khoản</a>
              <a href="#" className="hover:text-blue-400 transition-colors">Chính sách</a>
              <a href="#" className="hover:text-blue-400 transition-colors">Bảo mật</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 