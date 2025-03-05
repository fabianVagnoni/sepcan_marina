import { Routes, Route } from 'react-router-dom'
import { Container } from '@mui/material'

import Navbar from './components/Navbar'
import Dashboard from './pages/Dashboard'
import VehicleForm from './pages/VehicleForm'
import JobForm from './pages/JobForm'
import QueryPage from './pages/QueryPage'
import NotFound from './pages/NotFound'

function App() {
  return (
    <>
      <Navbar />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
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
