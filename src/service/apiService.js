import axios from 'axios';

// Cấu hình một instance axios
const apiService = axios.create({
    baseURL: 'http://localhost:6969/api/v1', // URL cơ sở của back-end
    withCredentials: true // RẤT QUAN TRỌNG: Để cho phép gửi/nhận cookie (jwt_token)
});

// Thêm interceptor để xử lý lỗi chung (tùy chọn nhưng nên có)
apiService.interceptors.response.use(
    (response) => {
        // Trả về dữ liệu từ response
        return response.data;
    },
    (error) => {
        // Xử lý lỗi (ví dụ: token hết hạn, lỗi máy chủ)
        console.error('Lỗi API:', error.response?.data || error.message);
        // Bạn có thể xử lý việc tự động logout ở đây nếu gặp lỗi 401
        if (error.response?.status === 401) {
             // Xử lý logout hoặc refresh token
        }
        return Promise.reject(error.response?.data || error);
    }
);

// --- API XÁC THỰC (Auth) ---
export const loginAPI = (credentials) => apiService.post('/auth/login', credentials);
export const logoutAPI = () => apiService.post('/auth/logout');
export const checkSessionAPI = () => apiService.get('/auth/check-session');


// --- API TÀI XẾ (Drivers) ---
export const getAllDrivers = () => apiService.get('/drivers');
export const getDriverById = (id) => apiService.get(`/drivers/${id}`);
export const createDriver = (driverData) => apiService.post('/drivers', driverData);
export const updateDriver = (id, driverData) => apiService.put(`/drivers/${id}`, driverData);
export const deleteDriver = (id) => apiService.delete(`/drivers/${id}`);

// --- API HỌC SINH (Students) ---
export const getAllStudents = () => apiService.get('/students');
export const getStudentById = (id) => apiService.get(`/students/${id}`);
export const createStudent = (studentData) => apiService.post('/students', studentData);
export const updateStudent = (id, studentData) => apiService.put(`/students/${id}`, studentData);
export const deleteStudent = (id) => apiService.delete(`/students/${id}`);

// --- API ROUTES (Tuyến) ---
export const getAllRoutes = () => apiService.get('/routes');
export const getRouteById = (id) => apiService.get(`/routes/${id}`);
export const createRoute = (routeData) => apiService.post('/routes', routeData);
export const updateRoute = (id, routeData) => apiService.put(`/routes/${id}`, routeData);
export const deleteRoute = (id) => apiService.delete(`/routes/${id}`);

// --- API VEHICLES/BUSES (Xe) ---
export const getAllVehicles = () => apiService.get('/vehicles');
export const getVehicleById = (id) => apiService.get(`/vehicles/${id}`);
export const createVehicle = (vehicleData) => apiService.post('/vehicles', vehicleData);
export const updateVehicle = (id, vehicleData) => apiService.put(`/vehicles/${id}`, vehicleData);
export const deleteVehicle = (id) => apiService.delete(`/vehicles/${id}`);

// --- API NOTIFICATIONS (Thông báo) ---
export const getAllNotifications = () => apiService.get('/notifications');
export const getNotificationById = (id) => apiService.get(`/notifications/${id}`);
export const createNotification = (notificationData) => apiService.post('/notifications', notificationData);
export const deleteNotification = (id) => apiService.delete(`/notifications/${id}`);

// --- API THEO DÕI (Tracking) ---
export const getLiveLocations = () => apiService.get('/tracking/live');
export const getRouteHistory = (busId) => apiService.get(`/tracking/history/${busId}`);

export default apiService;