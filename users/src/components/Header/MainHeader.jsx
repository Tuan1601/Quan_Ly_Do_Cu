import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaHome, FaBoxOpen, FaHistory, FaSearch, FaSpinner, FaBars, FaTimes } from 'react-icons/fa';
import { IoClose } from 'react-icons/io5';
import { searchEquipment } from '../../api/userApi';

const MainHeader = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showSearch, setShowSearch] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const searchRef = useRef(null);

  const isActive = (path) => {
    return location.pathname === path;
  };

  const menuItems = [
    { path: '/', icon: <FaHome />, text: 'Trang chủ' },
    { path: '/equipment', icon: <FaBoxOpen />, text: 'Thiết bị' },
    { path: '/history', icon: <FaHistory />, text: 'Lịch sử mượn' },
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearch(false);
        setSearchResults([]);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setShowMobileMenu(false);
  }, [location.pathname]);

  useEffect(() => {
    if (showMobileMenu) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showMobileMenu]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery.trim()) {
        setLoading(true);
        try {
          const response = await searchEquipment(searchQuery);
          setSearchResults(response.data.slice(0, 5));
        } catch (error) {
          console.error('Search error:', error);
          setSearchResults([]);
        }
        setLoading(false);
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/equipment?search=${encodeURIComponent(searchQuery)}`);
      setShowSearch(false);
      setSearchQuery('');
      setSearchResults([]);
    }
  };

  const handleResultClick = (id) => {
    navigate(`/equipment/${id}`);
    setShowSearch(false);
    setSearchQuery('');
    setSearchResults([]);
  };

  return (
    <nav className="bg-white">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-xl md:text-2xl font-bold">
              <span className="text-gray-800">Equip</span>
              <span className="text-blue-600">Mart</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-4">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-4 py-4 text-sm font-medium transition-colors ${
                  isActive(item.path)
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-700 hover:text-blue-600'
                }`}
              >
                <span className="mr-2">{item.icon}</span>
                {item.text}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <div className="relative flex items-center" ref={searchRef}>
              <div className={`${showSearch ? 'w-full md:w-96' : 'w-auto'} transition-all duration-300`}>
                <form onSubmit={handleSearch} className="relative flex items-center">
                  {showSearch ? (
                    <>
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaSearch className="text-gray-400" />
                      </div>
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Tìm kiếm thiết bị..."
                        className="w-full pl-10 pr-10 py-2.5 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                        autoFocus
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setShowSearch(false);
                          setSearchResults([]);
                          setSearchQuery('');
                        }}
                        className="absolute right-2 p-2 text-gray-500 hover:text-gray-700"
                      >
                        <IoClose className="w-5 h-5" />
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setShowSearch(true)}
                      className="p-2 text-gray-600 hover:text-blue-600 transition-colors rounded-lg hover:bg-gray-100"
                    >
                      <FaSearch className="w-5 h-5" />
                    </button>
                  )}
                </form>

                {showSearch && (searchResults.length > 0 || loading) && (
                  <div className="absolute right-0 mt-2 w-full bg-white rounded-lg shadow-lg border border-gray-200 max-h-[480px] overflow-y-auto z-50">
                    {loading ? (
                      <div className="p-4 text-center text-gray-500">
                        <FaSpinner className="animate-spin inline mr-2" />
                        Đang tìm kiếm...
                      </div>
                    ) : (
                      <>
                        {searchResults.map((item) => (
                          <div
                            key={item._id}
                            onClick={() => handleResultClick(item._id)}
                            className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0 flex items-center gap-3"
                          >
                            <div className="w-16 h-16 flex-shrink-0 bg-gray-50 rounded-lg overflow-hidden">
                              <img
                                src={item.imageUrl || 'https://via.placeholder.com/400x300?text=No+Image'}
                                alt={item.name}
                                className="w-full h-full object-contain p-2"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-gray-800 truncate">
                                {item.name}
                              </div>
                              <div className="text-sm text-gray-500 truncate mt-1">
                                {item.description}
                              </div>
                              <div className="flex items-center gap-3 mt-1">
                                <span className="text-sm text-gray-600">
                                  Còn lại: <span className="font-medium text-blue-600">{item.availableQuantity}</span>
                                </span>
                                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                                  item.status === 'available' 
                                    ? 'bg-green-100 text-green-800'
                                    : item.status === 'maintenance'
                                    ? 'bg-yellow-100 text-yellow-800'
                                    : 'bg-red-100 text-red-800'
                                }`}>
                                  {item.status === 'available' 
                                    ? 'Có sẵn'
                                    : item.status === 'maintenance'
                                    ? 'Đang bảo trì'
                                    : 'Không khả dụng'}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                        <button
                          onClick={handleSearch}
                          className="w-full p-3 text-center text-blue-600 hover:bg-blue-50 font-medium border-t border-gray-100"
                        >
                          Xem tất cả kết quả
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="md:hidden p-2 text-gray-600 hover:text-blue-600 transition-colors rounded-lg hover:bg-gray-100"
            >
              {showMobileMenu ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </div>
      </div>

      <div
        className={`fixed inset-0 bg-gray-800 bg-opacity-50 z-40 transition-opacity duration-300 md:hidden ${
          showMobileMenu ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setShowMobileMenu(false)}
      >
        <div
          className={`fixed inset-y-0 right-0 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${
            showMobileMenu ? 'translate-x-0' : 'translate-x-full'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl font-bold text-gray-800">Menu</h2>
              <button
                onClick={() => setShowMobileMenu(false)}
                className="p-2 text-gray-600 hover:text-gray-800 rounded-lg hover:bg-gray-100"
              >
                <FaTimes />
              </button>
            </div>
            <nav className="space-y-4">
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center py-3 px-4 rounded-lg transition-colors ${
                    isActive(item.path)
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'
                  }`}
                >
                  <span className="mr-3">{item.icon}</span>
                  {item.text}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default MainHeader; 