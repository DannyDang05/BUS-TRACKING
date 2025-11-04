import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'


import App from './App.jsx'
import Map from './Admin/Content/Map.jsx'
import StudentManagement from './Admin/Content/StudentManagement.jsx'
import MainPage from './Admin/Content/MainPage.jsx'
import Driver from './Admin/Content/Driver.jsx'
import CreateDriverModal from './Admin/Content/CreateDriverModal.jsx'
import UpdateDriverModal from './Admin/Content/UpdateDriverModal.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<App />}>
          <Route index element={<MainPage />} />
          <Route path="map" element={<Map />} />
          <Route path="students" element={<StudentManagement />} />
          <Route path="drivers" element={<Driver />} />
          <Route path="drivers/create-driver" element={<CreateDriverModal />} />
          <Route path="drivers/update-driver/:id" element={<UpdateDriverModal/>}/>


        </Route>
      </Routes>
    </BrowserRouter>

  </StrictMode>,
)
