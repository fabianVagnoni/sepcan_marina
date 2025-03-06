import { Routes, Route } from 'react-router-dom'
import { Container, Box } from '@mui/material'
import backgroundImage from '/src/assets/background_pic.jpg'

import Navbar from './components/Navbar'
import Dashboard from './pages/Dashboard'
import VehicleForm from './pages/VehicleForm'
import JobForm from './pages/JobForm'
import QueryPage from './pages/QueryPage'
import NotFound from './pages/NotFound'
// import backgroundImage from "/src/assets/background_pic.jpg"
import './App.css'

function App() {
  return (
    <>
      {/* Background div with direct background-image style */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        filter: 'blur(5px)',
        opacity: 0.7,
      }} />

      <Navbar />
      <Container 
        maxWidth="lg" 
        sx={{ 
          mt: 4, 
          mb: 4,
          position: 'relative',
          zIndex: 1,
        }}
      >
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/vehicle-form" element={<VehicleForm />} />
          <Route path="/job-form" element={<JobForm />} />
          <Route path="/query" element={<QueryPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Container>
    </>
  )
}

export default App

