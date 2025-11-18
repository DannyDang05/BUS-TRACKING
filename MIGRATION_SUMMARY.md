# Bus Tracking System - Frontend & Backend Alignment Summary

## Project Overview

This document summarizes the complete alignment of the bus tracking frontend and backend with the MySQL database schema (`bustracking`), enabling full API integration and data fetching from the backend.

## Database Configuration

- **Database Name:** `bustracking` (MySQL via XAMPP)
- **MySQL Server:** localhost:3306
- **XAMPP Root Password:** (empty)
- **Database Tables:**
  - `drivers` - Driver information (Id, FullName, MaBangLai, PhoneNumber)
  - `hocsinh` - Student information (MaHocSinh, HoTen, Lop, TinhTrang, MaPhuHuynh, MaDiemDon)
  - `routes` - Bus routes (Id, MaTuyen, Name, DriverId, VehicleId, Status, currentLatitude, currentLongitude)
  - `vehicles` - Bus vehicles (Id, LicensePlate, Model, SpeedKmh)
  - `thongbao` - Notifications (MaThongBao, NoiDung, ThoiGian, LoaiThongBao)
  - `users` - User authentication (Username, Password)
  - `phuhuynh` - Parents
  - `pickuppoints` - Pickup locations
  - `quanly` - Managers

## Backend Implementation

### Server Configuration

- **Port:** 6969
- **Base URL:** http://localhost:6969/api/v1
- **CORS Origin:** http://localhost:8080
- **Authentication:** JWT tokens stored in HttpOnly cookies

### API Endpoints Created

#### Authentication (`/api/v1/auth`)

- `POST /login` - User login with Username/Password
- `POST /logout` - User logout
- `GET /check-session` - Verify current session

#### Drivers (`/api/v1/drivers`)

- `GET /` - Get all drivers
- `GET /:id` - Get specific driver
- `POST /` - Create new driver
- `PUT /:id` - Update driver
- `DELETE /:id` - Delete driver

**Database Fields:** Id, FullName, MaBangLai, PhoneNumber, UserId

#### Students (`/api/v1/students`)

- `GET /` - Get all students
- `GET /:id` - Get specific student
- `POST /` - Create new student
- `PUT /:id` - Update student
- `DELETE /:id` - Delete student

**Database Fields:** MaHocSinh, HoTen, Lop, TinhTrang, MaPhuHuynh, MaDiemDon

#### Routes (`/api/v1/routes`)

- `GET /` - Get all routes
- `GET /:id` - Get specific route
- `POST /` - Create new route
- `PUT /:id` - Update route
- `DELETE /:id` - Delete route

**Database Fields:** Id, MaTuyen, Name, DriverId, VehicleId, Status, currentLatitude, currentLongitude

#### Vehicles (`/api/v1/vehicles`)

- `GET /` - Get all vehicles
- `GET /:id` - Get specific vehicle
- `POST /` - Create new vehicle
- `PUT /:id` - Update vehicle
- `DELETE /:id` - Delete vehicle

**Database Fields:** Id, LicensePlate, Model, SpeedKmh

#### Notifications (`/api/v1/notifications`)

- `GET /` - Get all notifications
- `GET /:id` - Get specific notification
- `POST /` - Create new notification
- `DELETE /:id` - Delete notification

**Database Fields:** MaThongBao, NoiDung, ThoiGian, LoaiThongBao

#### Tracking (`/api/v1/tracking`)

- `POST /update-location` - Update bus location
- `GET /live` - Get live bus locations
- `GET /history/:busId` - Get bus route history

### Backend File Structure

```
BackEnd/src/
├── controller/
│   ├── authController.js (Updated: Username-based auth)
│   ├── driverController.js (Updated: DB field alignment)
│   ├── studentController.js (Updated: DB field alignment)
│   ├── trackingController.js (Rewritten: uses routes table)
│   ├── routeController.js (NEW: Full CRUD for routes)
│   ├── vehicleController.js (NEW: Full CRUD for vehicles)
│   └── notificationController.js (NEW: Full CRUD for notifications)
├── route/
│   ├── Api.js (Updated: All endpoints registered)
│   ├── authRoute.js (Fixed: Import paths)
│   ├── driverRoute.js (Fixed: Import paths)
│   ├── studentRoute.js (Fixed: Import paths)
│   ├── trackingRoute.js (Fixed: Import paths)
│   ├── routeRoute.js (NEW: Route management)
│   ├── vehicleRoute.js (NEW: Vehicle management)
│   ├── notificationRoute.js (NEW: Notification management)
│   └── web.js (Created: Health check router)
├── config/
│   ├── connectDB.js (Fixed: XAMPP configuration)
│   └── viewEngine.js
├── middleWare/
│   └── authMiddleware.js (JWT verification)
├── service/
│   └── WebsocketService.js
└── util/
```

## Frontend Implementation

### API Service (`src/service/apiService.js`)

- **Axios Configuration:** baseURL = http://localhost:6969/api/v1
- **Credentials:** withCredentials: true (for HttpOnly cookie JWT)
- **Response Interceptor:** Automatically extracts data and handles errors

**API Functions Added:**

```javascript
// Auth
loginAPI(credentials);
logoutAPI();
checkSessionAPI();

// Drivers
getAllDrivers();
getDriverById(id);
createDriver(driverData);
updateDriver(id, driverData);
deleteDriver(id);

// Students
getAllStudents();
getStudentById(id);
createStudent(studentData);
updateStudent(id, studentData);
deleteStudent(id);

// Routes
getAllRoutes();
getRouteById(id);
createRoute(routeData);
updateRoute(id, routeData);
deleteRoute(id);

// Vehicles
getAllVehicles();
getVehicleById(id);
createVehicle(vehicleData);
updateVehicle(id, vehicleData);
deleteVehicle(id);

// Notifications
getAllNotifications();
getNotificationById(id);
createNotification(notificationData);
deleteNotification(id);

// Tracking
getLiveLocations();
getRouteHistory(busId);
```

### Frontend File Structure - Updated Components

#### Admin Dashboard

```
FrontEnd/BUS-TRACKING/src/Admin/
├── Admin.jsx
├── HeaderAdmin.jsx
├── SideBarAdmin.jsx
└── Content/
    ├── MainPage.jsx
    ├── Map.jsx
    ├── Driver/
    │   ├── Driver.jsx
    │   ├── CreateDriverModal.jsx (Updated: API integration)
    │   ├── UpdateDriverModal.jsx (Updated: API integration)
    │   └── TableDrivers.jsx (Updated: Fetches from API)
    ├── Student/
    │   ├── Student.jsx
    │   ├── CreateStudentModal.jsx (Updated: API integration)
    │   ├── UpdateStudentModal.jsx (Updated: API integration)
    │   └── TableStudents.jsx (Updated: Fetches from API)
    ├── Route/
    │   ├── Routee.jsx
    │   ├── CreateRouteModal.jsx (Updated: API integration)
    │   ├── UpdateRouteModal.jsx (Updated: API integration)
    │   └── TableRoute.jsx (Updated: Fetches from API)
    ├── Bus/
    │   ├── Bus.jsx
    │   ├── CreateBusModal.jsx (Updated: API integration)
    │   ├── UpdateBusModal.jsx (Updated: API integration)
    │   └── TableBus.jsx (Updated: Fetches from API)
    └── Calendar/
        ├── Calendar.jsx
        ├── CreateCalendarModal.jsx (Updated: API integration)
        ├── UpdateCalendarModal.jsx (Updated: API integration)
        └── TableCalendar.jsx (Updated: Fetches from API)
```

## Key Updates Made

### 1. **Database Schema Alignment**

- Fixed all controller imports to use correct paths
- Updated field names to match database schema exactly
- Removed references to non-existent tables (BusLocations)

### 2. **Authentication System**

- Updated `authController.js` to authenticate using `Username` field from `users` table
- JWT tokens stored in HttpOnly cookies for security
- Added `verifyToken` middleware to all protected routes

### 3. **Tracking System Rewrite**

- Changed from non-existent `BusLocations` table to `routes` table
- Uses `currentLatitude` and `currentLongitude` columns
- Supports WebSocket broadcasting for real-time updates

### 4. **New Backend Controllers & Routes**

- Created `routeController.js` with full CRUD operations
- Created `vehicleController.js` with full CRUD operations
- Created `notificationController.js` with CRUD operations
- Created corresponding route files with proper middleware

### 5. **Frontend Components Update**

All table components now:

- Fetch data from backend APIs on component mount
- Use Material-UI DataGrid with proper column definitions
- Include loading states and error handling
- Use correct database field names

All modal components now:

- Use Dialog from Material-UI
- Send data to backend APIs
- Include form validation and error messages
- Support create and update operations

## How to Run

### Backend

```bash
cd BackEnd
npm install
npm run start
# Server will run on http://localhost:6969
```

### Frontend

```bash
cd FrontEnd/BUS-TRACKING
npm install
npm run dev
# Frontend will run on http://localhost:3000 (or similar)
```

### Database Setup

1. Open XAMPP Control Panel
2. Start Apache and MySQL services
3. Open http://localhost:8080/phpmyadmin
4. Create database named `bustracking`
5. Import database schema from `BackEnd/school_bus_db.sql`

## Testing the Integration

### 1. Login

- Navigate to the admin login page
- Use credentials from the `users` table (Username/Password)
- System will return JWT token in HttpOnly cookie

### 2. Drivers Page

- Click "Quản Lý Tài Xế" (Driver Management)
- Table should load drivers from `/api/v1/drivers` API
- Click "Tạo" (Create) to open modal and add new driver
- Click row to edit driver

### 3. Students Page

- Click "Quản Lý Học Sinh" (Student Management)
- Table should load students from `/api/v1/students` API
- Click "Tạo" to add new student
- Click row to edit student

### 4. Routes Page

- Click "Quản Lý Tuyến" (Route Management)
- Table should load routes from `/api/v1/routes` API
- Click "Tạo" to add new route
- Click row to edit route

### 5. Vehicles Page

- Click "Quản Lý Xe" (Bus Management)
- Table should load vehicles from `/api/v1/vehicles` API
- Click "Tạo" to add new vehicle
- Click row to edit vehicle

### 6. Notifications Page

- Click "Lịch" (Calendar/Notifications)
- Table should load notifications from `/api/v1/notifications` API
- Click "Tạo" to add new notification

## Environment Variables

### Backend (.env)

```
PORT=6969
CORS_ORIGIN=http://localhost:8080
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_DATABASE=bustracking
JWT_SECRET=your_strong_secret_key_for_hashing
NODE_ENV=development
```

### Frontend

- CORS automatically handled by axios with credentials
- API baseURL configured in `apiService.js`

## Troubleshooting

### Issue: "Cannot connect to MySQL"

**Solution:**

- Ensure XAMPP MySQL service is running
- Check `.env` file has correct DB_HOST, DB_PORT, DB_USER, DB_PASSWORD
- Verify database `bustracking` exists in phpmyadmin

### Issue: "401 Unauthorized"

**Solution:**

- Login with valid credentials from `users` table
- Check JWT token is being stored in HttpOnly cookie
- Verify `verifyToken` middleware is applied to routes

### Issue: "API returns 404"

**Solution:**

- Check backend server is running on port 6969
- Verify route is registered in `Api.js`
- Check spelling of API endpoint

### Issue: "CORS errors"

**Solution:**

- Ensure `withCredentials: true` is set in apiService.js
- Verify `CORS_ORIGIN` in .env matches frontend URL
- Check backend enables credentials in CORS configuration

## Next Steps

1. Test all CRUD operations to ensure data persistence
2. Implement WebSocket connection for real-time tracking
3. Add role-based access control (RBAC)
4. Implement search and filter functionality
5. Add data validation and sanitization
6. Deploy to production environment

## Notes

- All database operations use parameterized queries to prevent SQL injection
- JWT tokens are stored in HttpOnly cookies for security
- CORS is configured to only allow requests from localhost:8080
- WebSocket service is ready for real-time location tracking implementation
