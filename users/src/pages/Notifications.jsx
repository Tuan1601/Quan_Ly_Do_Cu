import React, { useState, useEffect } from 'react';
import { FaSpinner, FaBell, FaCheck, FaTimes, FaTrash, FaExclamationTriangle, FaCalendarTimes, FaClock, FaCheckDouble, FaInfoCircle } from 'react-icons/fa';
import { getNotifications, markAsRead, deleteNotification } from '../api/notificationApi';
import { getBorrowingHistory } from '../api/borrowingApi';
import { Link } from 'react-router-dom';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const initializeNotifications = async () => {
      try {
        await fetchNotifications();
        await checkBorrowingDueDates();
      } catch (error) {
        console.error('Error initializing notifications:', error);
        setError('Không thể tải thông báo. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };

    initializeNotifications();

    // Kiểm tra mỗi giờ
    const interval = setInterval(async () => {
      try {
        await checkBorrowingDueDates();
      } catch (error) {
        console.error('Error checking due dates:', error);
      }
    }, 3600000);

    return () => clearInterval(interval);
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getTimeRemaining = (expectedReturnDate) => {
    const now = new Date();
    const returnDate = new Date(expectedReturnDate);
    const timeDiff = returnDate.getTime() - now.getTime();
    
    const daysLeft = Math.ceil(timeDiff / (1000 * 3600 * 24));
    const hoursLeft = Math.ceil(timeDiff / (1000 * 3600));
    const minutesLeft = Math.ceil(timeDiff / (1000 * 60));

    if (daysLeft <= 0) {
      const overdueDays = Math.abs(daysLeft);
      return {
        type: 'overdue',
        text: overdueDays === 0 
          ? 'Đã đến hạn trả hôm nay!'
          : `Đã quá hạn ${overdueDays} ngày!`,
        urgent: true,
        color: 'text-red-600'
      };
    } else if (daysLeft <= 1) {
      if (hoursLeft <= 1) {
        return {
          type: 'urgent',
          text: minutesLeft <= 60 
            ? `Còn ${minutesLeft} phút nữa đến hạn!`
            : 'Còn chưa đầy 1 giờ nữa đến hạn!',
          urgent: true,
          color: 'text-orange-600'
        };
      }
      return {
        type: 'urgent',
        text: `Còn ${hoursLeft} giờ nữa đến hạn!`,
        urgent: true,
        color: 'text-orange-600'
      };
    } else if (daysLeft <= 2) {
      return {
        type: 'warning',
        text: `Còn ${daysLeft} ngày nữa đến hạn!`,
        urgent: true,
        color: 'text-yellow-600'
      };
    }
    return null;
  };

  const checkBorrowingDueDates = async () => {
    try {
      const response = await getBorrowingHistory();
      if (!response?.data) {
        console.error('Invalid borrowing history response:', response);
        return;
      }

      const borrowings = response.data;
      
      // Lọc các mượn đang active (approved) và chưa trả
      const activeLoans = borrowings.filter(item => 
        item.status === 'approved' && !item.actualReturnDate && item.equipment
      );

      const newNotifications = [];

      activeLoans.forEach(loan => {
        const timeStatus = getTimeRemaining(loan.expectedReturnDate);
        
        if (timeStatus?.urgent) {
          const existingNotification = notifications.find(n => 
            n.type === timeStatus.type && 
            n.equipment?._id === loan.equipment?._id
          );

          if (!existingNotification) {
            newNotifications.push({
              _id: `local_${Date.now()}_${loan.equipment._id}`,
              type: timeStatus.type,
              message: `Thiết bị "${loan.equipment?.name}" ${timeStatus.text}`,
              isRead: false,
              createdAt: new Date().toISOString(),
              equipment: loan.equipment,
              dueDate: loan.expectedReturnDate,
              timeRemaining: timeStatus.text,
              color: timeStatus.color,
              isLocal: true
            });
          } else if (existingNotification.timeRemaining !== timeStatus.text) {
            setNotifications(prev => prev.map(n => 
              n._id === existingNotification._id
                ? {
                    ...n,
                    message: `Thiết bị "${loan.equipment?.name}" ${timeStatus.text}`,
                    timeRemaining: timeStatus.text,
                    color: timeStatus.color
                  }
                : n
            ));
          }
        }
      });

      if (newNotifications.length > 0) {
        setNotifications(prev => [...newNotifications, ...prev]);
      }
    } catch (error) {
      console.error('Error checking due dates:', error);
      throw error;
    }
  };

  const fetchNotifications = async () => {
    try {
      const response = await getNotifications();
      if (!response?.data) {
        console.error('Invalid notifications response:', response);
        return;
      }
      
      // Lọc ra các thông báo hệ thống (không phải local)
      const systemNotifications = response.data.filter(n => !n.isLocal);
      setNotifications(prev => {
        // Giữ lại các thông báo local và thêm thông báo hệ thống
        const localNotifications = prev.filter(n => n.isLocal);
        return [...localNotifications, ...systemNotifications];
      });
    } catch (error) {
      console.error('Error fetching notifications:', error);
      throw error;
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      const notification = notifications.find(n => n._id === id);
      
      // Chỉ gọi API nếu là thông báo hệ thống
      if (notification && !notification.isLocal) {
        await markAsRead(id);
      }
      
      setNotifications(notifications.map(notification =>
        notification._id === id ? { ...notification, isRead: true } : notification
      ));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const notification = notifications.find(n => n._id === id);
      
      // Chỉ gọi API nếu là thông báo hệ thống
      if (notification && !notification.isLocal) {
        await deleteNotification(id);
      }
      
      setNotifications(notifications.filter(n => n._id !== id));
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success':
        return <FaCheck className="text-green-500" />;
      case 'error':
        return <FaTimes className="text-red-500" />;
      case 'warning':
        return <FaExclamationTriangle className="text-yellow-500" />;
      case 'overdue':
        return <FaCalendarTimes className="text-red-500" />;
      case 'urgent':
        return <FaClock className="text-orange-500" />;
      default:
        return <FaBell className="text-violet-500" />;
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'success':
        return 'bg-green-100';
      case 'error':
        return 'bg-red-100';
      case 'warning':
        return 'bg-yellow-100';
      case 'overdue':
        return 'bg-red-100';
      case 'urgent':
        return 'bg-orange-100';
      default:
        return 'bg-violet-100';
    }
  };

  const getNotificationStyle = (type, isRead, color) => {
    const baseStyle = "bg-white rounded-lg shadow p-4 transition";
    if (type === 'urgent' || type === 'overdue') {
      return `${baseStyle} ${isRead ? 'opacity-75' : `border-l-4 border-${color.split('-')[1]}-500 animate-pulse`}`;
    }
    if (type === 'warning') {
      return `${baseStyle} ${isRead ? 'opacity-75' : 'border-l-4 border-yellow-500'}`;
    }
    return `${baseStyle} ${isRead ? 'opacity-75' : ''}`;
  };

  const handleMarkAllAsRead = async () => {
    try {
      const unreadNotifications = notifications.filter(n => !n.isRead);
      for (const notification of unreadNotifications) {
        await handleMarkAsRead(notification._id);
      }
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'all') return true;
    if (filter === 'unread' && !n.isRead) return true;
    if (filter === 'read' && n.isRead) return true;
    if (filter === 'overdue' && n.type === 'overdue') return true;
    if (filter === 'dueToday' && n.type === 'return' && isToday(new Date(n.dueDate))) return true;
    if (filter === 'dueSoon' && n.type === 'return' && !isToday(new Date(n.dueDate)) && isWithinDays(new Date(n.dueDate), 2)) return true;
    return false;
  });

  const formatTimeAgo = (date) => {
    const now = new Date();
    const diff = Math.floor((now - date) / 1000);

    if (diff < 60) {
      return 'Vừa xong';
    } else if (diff < 3600) {
      return `${Math.floor(diff / 60)} phút trước`;
    } else if (diff < 86400) {
      return `${Math.floor(diff / 3600)} giờ trước`;
    } else if (diff < 259200) {
      return `${Math.floor(diff / 86400)} ngày trước`;
    } else {
      return formatDate(date);
    }
  };

  const formatDuration = (date) => {
    const now = new Date();
    const diff = Math.floor((date - now) / 1000);

    if (diff < 60) {
      return 'dưới 1 phút';
    } else if (diff < 3600) {
      return `${Math.floor(diff / 60)} phút`;
    } else if (diff < 86400) {
      return `${Math.floor(diff / 3600)} giờ`;
    } else if (diff < 259200) {
      return `${Math.floor(diff / 86400)} ngày`;
    } else {
      return formatDate(date);
    }
  };

  const isToday = (date) => {
    const now = new Date();
    return date.toDateString() === now.toDateString();
  };

  const isWithinDays = (date, days) => {
    const now = new Date();
    const diff = Math.floor((date - now) / (1000 * 3600 * 24));
    return diff >= 0 && diff <= days;
  };

  return (
    <div className="container mx-auto px-4 py-6 sm:py-8">
      <div className="flex flex-col gap-6 mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Thông báo</h1>
          
          {/* Filter Controls */}
          <div className="w-full sm:w-auto flex flex-col sm:flex-row gap-4">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full sm:w-auto rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 p-2.5"
            >
              <option value="all">Tất cả thông báo</option>
              <option value="unread">Chưa đọc</option>
              <option value="read">Đã đọc</option>
              <option value="overdue">Quá hạn</option>
              <option value="dueToday">Đến hạn hôm nay</option>
              <option value="dueSoon">Sắp đến hạn</option>
            </select>
            
            <button
              onClick={handleMarkAllAsRead}
              disabled={!notifications.some(n => !n.isRead)}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
            >
              <FaCheckDouble />
              <span>Đánh dấu tất cả đã đọc</span>
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center py-8">
          <FaSpinner className="animate-spin text-blue-600 text-2xl" />
        </div>
      ) : filteredNotifications.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          Không có thông báo nào
        </div>
      ) : (
        <div className="space-y-4">
          {filteredNotifications.map((notification) => {
            const isOverdue = notification.type === 'return' && new Date(notification.dueDate) < new Date();
            const isDueToday = notification.type === 'return' && isToday(new Date(notification.dueDate));
            const isDueSoon = notification.type === 'return' && !isOverdue && !isDueToday && isWithinDays(new Date(notification.dueDate), 2);
            
            let statusColor = '';
            if (isOverdue) statusColor = 'bg-red-50 border-red-200';
            else if (isDueToday) statusColor = 'bg-orange-50 border-orange-200';
            else if (isDueSoon) statusColor = 'bg-yellow-50 border-yellow-200';
            else statusColor = 'bg-white border-gray-200';

            return (
              <div
                key={notification._id}
                className={`rounded-lg border p-4 sm:p-5 transition-all hover:shadow-md ${statusColor} ${
                  !notification.isRead ? 'border-l-4 border-l-blue-500' : ''
                }`}
              >
                <div className="flex flex-col sm:flex-row gap-4">
                  {/* Equipment Image */}
                  <div className="sm:w-16 sm:h-16 w-full h-32 flex-shrink-0">
                    <img
                      src={notification.equipment?.imageUrl || 'https://via.placeholder.com/64?text=NA'}
                      alt=""
                      className="w-full h-full object-contain sm:object-cover rounded-lg"
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-grow">
                    <div className="flex flex-col sm:flex-row justify-between gap-2 mb-2">
                      <h3 className="text-lg font-medium text-gray-900">
                        {notification.equipment?.name}
                      </h3>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-gray-500">
                          {formatTimeAgo(new Date(notification.createdAt))}
                        </span>
                        {!notification.isRead && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            Mới
                          </span>
                        )}
                      </div>
                    </div>

                    <p className="text-gray-600 mb-4">{notification.message}</p>

                    {/* Due Date Info */}
                    {notification.type === 'return' && (
                      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-md text-sm ${
                        isOverdue
                          ? 'bg-red-100 text-red-800'
                          : isDueToday
                          ? 'bg-orange-100 text-orange-800'
                          : isDueSoon
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        <FaClock className="flex-shrink-0" />
                        <span>
                          {isOverdue
                            ? `Đã quá hạn ${formatDuration(new Date(notification.dueDate))}`
                            : isDueToday
                            ? 'Đến hạn trả hôm nay!'
                            : isDueSoon
                            ? `Còn ${formatDuration(new Date(notification.dueDate))} nữa đến hạn`
                            : `Hạn trả: ${formatDate(new Date(notification.dueDate))}`}
                        </span>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex flex-wrap items-center gap-3 mt-4">
                      <Link
                        to={`/equipment/${notification.equipment?._id}`}
                        className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800"
                      >
                        <FaInfoCircle />
                        <span>Xem chi tiết thiết bị</span>
                      </Link>
                      {!notification.isRead && (
                        <button
                          onClick={() => handleMarkAsRead(notification._id)}
                          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800"
                        >
                          <FaCheck />
                          <span>Đánh dấu đã đọc</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-wrap justify-center items-center gap-2 mt-8">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded-md border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 min-w-[80px]"
          >
            Trước
          </button>
          
          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter(page => {
              if (totalPages <= 5) return true;
              if (page === 1 || page === totalPages) return true;
              if (Math.abs(currentPage - page) <= 1) return true;
              return false;
            })
            .map((page, index, array) => (
              <React.Fragment key={page}>
                {index > 0 && array[index - 1] !== page - 1 && (
                  <span className="px-2 text-gray-500">...</span>
                )}
                <button
                  onClick={() => setCurrentPage(page)}
                  className={`min-w-[40px] px-3 py-1 rounded-md ${
                    currentPage === page
                      ? 'bg-blue-600 text-white'
                      : 'border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              </React.Fragment>
            ))}
          
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 rounded-md border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 min-w-[80px]"
          >
            Tiếp
          </button>
        </div>
      )}
    </div>
  );
};

export default Notifications; 