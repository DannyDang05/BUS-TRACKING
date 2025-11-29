import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { LanguageProvider } from './Admin/Shared/LanguageContext';


import App from './App.jsx'
import Map from './Admin/Content/Map.jsx'
import Student from './Admin/Content/Student/Student.jsx'
import MainPage from './Admin/Content/Mainpage/MainPage.jsx'
import Driver from './Admin/Content/Driver/Driver.jsx'
import CreateDriverModal from './Admin/Content/Driver/CreateDriverModal.jsx'
import UpdateDriverModal from './Admin/Content/Driver/UpdateDriverModal.jsx'
import CreateStudentModal from './Admin/Content/Student/CreateStudentModal.jsx'
import UpdateStudentModal from './Admin/Content/Student/UpdateStudentModal.jsx'
import Calendar from './Admin/Content/Calendar/Calendar.jsx'
import CreateCalendarModal from './Admin/Content/Calendar/CreateCalendarModal.jsx'
import UpdateCalendarModal from './Admin/Content/Calendar/UpdateCalendarModal.jsx'
import Routee from './Admin/Content/Route/Routee.jsx'
import CreateRouteModal from './Admin/Content/Route/CreateRouteModal.jsx'
import UpdateRouteModal from './Admin/Content/Route/UpdateRouteModal.jsx'
import RouteStopsPage from './Admin/Content/Route/RouteStopsPage.jsx'
import RouteOptimization from './Admin/Content/Route/RouteOptimization.jsx'
import Bus from './Admin/Content/Bus/Bus.jsx'
import CreateBusModal from './Admin/Content/Bus/CreateBusModal.jsx'
import UpdateBusModal from './Admin/Content/Bus/UpdateBusModal.jsx'
import Login from './Admin/Content/Auth/Login.jsx'
import DriverUI from './DriverUI/DriverUI.jsx';
import DriverRoute from './DriverUI/Content/DriverRoute.jsx';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AdminRoute from './Admin/Shared/AdminRoute';
import DetailSchedule from './DriverUI/Content/DetailSchedule.jsx';
import DriverDashboard from './DriverUI/Content/DriverDashBoard.jsx';
import ParentUI from './ParentUI/ParentUI.jsx';
import ParentDashboard from './ParentUI/ParentContent/ParentDashboard.jsx';
import ParentMap from './ParentUI/ParentContent/ParentMap.jsx';
import ParentNotification from './ParentUI/ParentContent/ParentNotification.jsx';
import ParentSchedule from './ParentUI/ParentContent/ParentSchedule.jsx';
import Notification from './Admin/Content/Notification/Notification.jsx';
import CreateNotificationModal from './Admin/Content/Notification/CreateNotificationModal.jsx';
import UpdateNotificationModal from './Admin/Content/Notification/UpdateNotificationModal.jsx';
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <LanguageProvider>
      <BrowserRouter>
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick pauseOnFocusLoss draggable pauseOnHover />
        <Routes>
          {/* Admin protected routes */}
          <Route element={<AdminRoute />}>
            <Route path='/' element={<App />}>
              <Route index element={<MainPage />} />
              <Route path="map" element={<Map />} />
              <Route path="students" element={<Student />} />
              <Route path="students/create-student" element={<CreateStudentModal />} />
              <Route path="students/update-student/:id" element={<UpdateStudentModal />} />
              <Route path="drivers" element={<Driver />} />
              <Route path="drivers/create-driver" element={<CreateDriverModal />} />
              <Route path="drivers/update-driver/:id" element={<UpdateDriverModal />} />
              <Route path='calendars' element={<Calendar />} />
              <Route path="calendars/create-calendar" element={<CreateCalendarModal />} />
              <Route path="calendars/update-calendar/:id" element={<UpdateCalendarModal />} />
              <Route path='routes' element={<Routee />} />
              <Route path="routes/create-route" element={<CreateRouteModal />} />
              <Route path="routes/update-route/:id" element={<UpdateRouteModal />} />
              <Route path="routes/:id/points" element={<RouteStopsPage />} />
              <Route path="routes/optimization" element={<RouteOptimization />} />
              <Route path='buses' element={<Bus />} />
              <Route path="buses/create-bus" element={<CreateBusModal />} />
              <Route path="buses/update-bus/:id" element={<UpdateBusModal />} />
              <Route path='notifications' element={<Notification />} />
              <Route path="notifications/create-notification" element={<CreateNotificationModal />} />
              <Route path="notifications/update-notification/:id" element={<UpdateNotificationModal />} />
            </Route>
          </Route>
          {/* Public routes */}
          <Route path="login" element={<Login />} />
          {/* Driver protected route */}
          <Route element={<DriverRoute />}>
            <Route path='driver' element={<DriverUI />}>
              <Route index element={<DriverDashboard />} />
              <Route path="schedule/:id" element={<DetailSchedule />} />
            </Route>
          </Route>
          <Route path="parent" element={<ParentUI />}>
              <Route index element={<ParentDashboard/>}></Route>
              <Route path="map/:studentId" element={<ParentMap/>}/>
              <Route path="notifications" element={<ParentNotification/>}/>
              <Route path="schedule" element={<ParentSchedule/>}/>
          </Route>
        </Routes>
      </BrowserRouter>
    </LanguageProvider>
  </StrictMode>,
)
