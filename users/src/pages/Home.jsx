import React, { useEffect, useState } from 'react';
import { getEquipment } from '../api/userApi';
import { Link } from 'react-router-dom';
import { FaShippingFast, FaShieldAlt, FaMoneyBillWave, FaHeadset, FaBell, FaHistory, FaList } from 'react-icons/fa';
import { useNotifications } from '../contexts/NotificationContext';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const sliderStyles = `
  .featured-slider .slick-list {
    margin: 0 -12px;
    padding: 8px 0;
  }
  
  .featured-slider .slick-slide {
    padding: 0 12px;
  }

  .featured-slider .slick-dots {
    bottom: -35px;
  }

  .featured-slider .slick-dots li button:before {
    font-size: 12px;
    color: #2563EB;
    opacity: 0.3;
  }

  .featured-slider .slick-dots li.slick-active button:before {
    opacity: 1;
    color: #2563EB;
  }

  .featured-slider .slick-prev,
  .featured-slider .slick-next {
    width: 40px;
    height: 40px;
    background: white;
    border-radius: 50%;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    z-index: 1;
    transition: all 0.2s;
  }

  .featured-slider .slick-prev {
    left: -20px;
  }

  .featured-slider .slick-next {
    right: -20px;
  }

  .featured-slider .slick-prev:hover,
  .featured-slider .slick-next:hover {
    background: #2563EB;
  }

  .featured-slider .slick-prev:hover:before,
  .featured-slider .slick-next:hover:before {
    color: white;
  }

  .featured-slider .slick-prev:before,
  .featured-slider .slick-next:before {
    font-size: 20px;
    color: #2563EB;
    transition: all 0.2s;
  }

  @media (max-width: 640px) {
    .featured-slider .slick-prev,
    .featured-slider .slick-next {
      display: none !important;
    }
  }
`;

const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = sliderStyles;
document.head.appendChild(styleSheet);

const bannerSlides = [
  {
    title: 'Mượn Thiết Bị Dễ Dàng',
    desc: 'Nhanh chóng, tiện lợi, hỗ trợ mọi nhu cầu học tập và sự kiện!',
    img: 'https://media.istockphoto.com/id/1414489347/vi/anh/c%C3%B4-b%C3%A9-h%E1%BA%A1nh-ph%C3%BAc-ch%E1%BB%89-v%C3%A0o-ba-l%C3%B4-trong-khi-mua-%C4%91%E1%BB%93-d%C3%B9ng-h%E1%BB%8Dc-t%E1%BA%ADp-v%E1%BB%9Bi-b%E1%BB%91-m%E1%BA%B9-trong-si%C3%AAu-th%E1%BB%8B.jpg?s=612x612&w=0&k=20&c=YYbsh8HJTgn0CBRHgg46Rn5KuIbNdhx9MMWwTIjwolQ=',
    position: 'center right'
  },
  {
    title: 'Đa Dạng Thiết Bị',
    desc: 'Laptop, máy chiếu, micro, camera... luôn sẵn sàng cho bạn!',
    img: 'https://zshop.vn/blogs/wp-content/uploads/2017/09/mon-do-cong-nghe.png',
    position: 'center'
  }
];

const sliderSettings = {
  autoplay: true,
  dots: true,
  arrows: false,
  infinite: true,
  speed: 700,
  slidesToShow: 1,
  slidesToScroll: 1
};

const Banner = () => (
  <div className="w-screen relative left-1/2 right-1/2 -mx-[50vw] bg-gray-100">
    <Slider {...sliderSettings} className="mb-10">
      {bannerSlides.map((slide, idx) => (
        <div key={idx}>
          <div
            className="relative w-full h-[450px] md:h-[550px] flex items-center justify-center overflow-hidden"
          >
            <div 
              className="absolute inset-0 w-full h-full"
              style={{
                backgroundImage: `url(${slide.img})`,
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover',
                backgroundPosition: '50% 30%',
                transform: 'scale(1.02)', 
              }}
            />
            
            <div 
              className="absolute inset-0" 
              style={{
                background: 'linear-gradient(to right, rgba(30, 58, 138, 0.8), rgba(30, 58, 138, 0.4))'
              }}
            />

            <div className="relative z-10 container mx-auto px-4">
              <div className="max-w-2xl">
                <span className="inline-block bg-blue-100 text-blue-700 px-4 py-1 rounded-full text-sm font-semibold mb-6 shadow-lg">
                  Dịch vụ sinh viên
                </span>
                <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 leading-tight">
                  {slide.title}
                </h1>
                <p className="text-xl text-blue-100 mb-8 leading-relaxed max-w-xl">
                  {slide.desc}
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link 
                    to="/equipment" 
                    className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-lg shadow-lg hover:shadow-xl transition duration-200"
                  >
                    Xem thiết bị
                  </Link>
                  <Link 
                    to="/borrow" 
                    className="inline-block bg-white hover:bg-blue-50 text-blue-600 font-semibold px-8 py-4 rounded-lg shadow-lg hover:shadow-xl transition duration-200"
                  >
                    Gửi yêu cầu
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </Slider>
  </div>
);

const QuickActions = () => {
  const { notifications } = useNotifications();
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
      <Link to="/equipment" className="flex items-center p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition border border-gray-100">
        <div className="w-12 h-12 flex items-center justify-center bg-blue-100 rounded-lg mr-4">
          <FaList className="text-2xl text-blue-600" />
        </div>
        <div>
          <h3 className="font-semibold text-lg">Danh sách thiết bị</h3>
          <p className="text-gray-600">Xem tất cả thiết bị có sẵn</p>
        </div>
      </Link>

      <Link
        to="/notifications"
        className="flex items-center gap-3 p-4 bg-white rounded-lg shadow hover:shadow-md transition"
      >
        <div className="flex-shrink-0 w-12 h-12 rounded-full bg-violet-100 flex items-center justify-center">
          <FaBell className="text-violet-600 text-xl" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-medium text-gray-900">Thông báo</h3>
          <p className="text-gray-600">
            {notifications.length > 0 ? `${notifications.length} thông báo` : 'Không có thông báo'}
          </p>
        </div>
      </Link>

      <Link to="/history" className="flex items-center p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition border border-gray-100">
        <div className="w-12 h-12 flex items-center justify-center bg-green-100 rounded-lg mr-4">
          <FaHistory className="text-2xl text-green-600" />
        </div>
        <div>
          <h3 className="font-semibold text-lg">Lịch sử mượn</h3>
          <p className="text-gray-600">Xem các lượt mượn của bạn</p>
        </div>
      </Link>
    </div>
  );
};

const statusColor = {
  available: 'bg-green-100 text-green-700',
  maintenance: 'bg-yellow-100 text-yellow-700',
  broken: 'bg-red-100 text-red-700',
  unavailable: 'bg-gray-100 text-gray-700'
};

const productSliderSettings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 3,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 3000,
  pauseOnHover: true,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1,
      }
    },
    {
      breakpoint: 640,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1
      }
    }
  ]
};

const Home = () => {
  const [featured, setFeatured] = useState([]);

  useEffect(() => {
    getEquipment({ status: 'available' }).then(res => {
      if (res.data) {
        const availableEquipment = res.data.filter(item => item.status === 'available');
        setFeatured(availableEquipment.slice(0, 15));
      }
    });
  }, []);

  return (
    <div>
      <Banner />

      <div className="container mx-auto px-4">
        <QuickActions />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 my-8">
          <div className="flex flex-col items-center">
            <FaShippingFast className="text-3xl text-blue-600 mb-2" />
            <span className="font-semibold">Đăng ký nhanh</span>
            <span className="text-sm text-gray-500 text-center">Chỉ vài bước, không rườm rà</span>
          </div>
          <div className="flex flex-col items-center">
            <FaShieldAlt className="text-3xl text-blue-600 mb-2" />
            <span className="font-semibold">Thiết bị đảm bảo</span>
            <span className="text-sm text-gray-500 text-center">Kiểm tra kỹ trước khi giao</span>
          </div>
          <div className="flex flex-col items-center">
            <FaMoneyBillWave className="text-3xl text-blue-600 mb-2" />
            <span className="font-semibold">Miễn phí cho sinh viên</span>
            <span className="text-sm text-gray-500 text-center">Không phát sinh chi phí</span>
          </div>
          <div className="flex flex-col items-center">
            <FaHeadset className="text-3xl text-blue-600 mb-2" />
            <span className="font-semibold">Hỗ trợ 24/7</span>
            <span className="text-sm text-gray-500 text-center">Luôn sẵn sàng giải đáp</span>
          </div>
        </div>

        <div className="mb-12">
          <h3 className="text-2xl font-bold mb-6 text-blue-900">Thiết bị nổi bật</h3>
          <div className="relative -mx-4">
            <Slider {...productSliderSettings} className="featured-slider">
              {featured.map(item => (
                <div key={item._id} className="px-4">
                  <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden flex flex-col group h-full">
                    <div className="relative pt-[75%] overflow-hidden bg-gray-50">
                      <img
                        src={item.imageUrl || 'https://via.placeholder.com/400x300?text=No+Image'}
                        alt={item.name}
                        className="absolute inset-0 w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>

                    <div className="p-5 flex flex-col flex-grow">
                      <div className="flex-grow">
                        <h4 className="font-bold text-lg mb-2 text-gray-800 group-hover:text-blue-600 transition-colors line-clamp-1">
                          {item.name}
                        </h4>
                        <p className="text-gray-600 mb-4 text-sm line-clamp-2">{item.description}</p>
                        
                        <div className="flex items-center gap-2 mb-4">
                          <span className="text-sm">
                            Còn lại: <span className="font-medium text-blue-600">{item.availableQuantity}</span>
                            {item.totalQuantity && (
                              <span className="text-gray-400"> / {item.totalQuantity}</span>
                            )}
                          </span>
                        </div>
                      </div>

                      <div className="flex gap-3 pt-4 border-t border-gray-100">
                        <Link
                          to={`/equipment/${item._id}`}
                          className="flex-1 px-4 py-2.5 text-center text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg font-medium transition-colors"
                        >
                          Chi tiết
                        </Link>
                        <Link
                          to={`/borrow?equipmentId=${item._id}`}
                          className="flex-1 px-4 py-2.5 text-center text-white bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors"
                        >
                          Mượn ngay
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </Slider>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home; 