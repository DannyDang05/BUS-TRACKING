import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'


import App from './App.jsx'
import Map from './Admin/Content/Map.jsx'
import StudentManagement from './Admin/Content/Student/Student.jsx'
import MainPage from './Admin/Content/MainPage.jsx'
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
import Bus from './Admin/Content/Bus/Bus.jsx'
import CreateBusModal from './Admin/Content/Bus/CreateBusModal.jsx'
import UpdateBusModal from './Admin/Content/Bus/UpdateBusModal.jsx'
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<App />}>
          <Route index element={<MainPage />} />
          <Route path="map" element={<Map />} />
          <Route path="students" element={<StudentManagement />} />
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
          <Route path='buses' element={<Bus />} />
          <Route path="buses/create-bus" element={<CreateBusModal />} />
          <Route path="buses/update-bus/:id" element={<UpdateBusModal />} />





        </Route>
      </Routes>
    </BrowserRouter>

  </StrictMode>,
)
