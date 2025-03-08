import { Routes, Route } from 'react-router-dom'
import { Container, Box } from '@mui/material'
import backgroundImage from '/src/assets/background_pic.jpg'

import Navbar from './components/Navbar'
import Dashboard from './pages/Dashboard'
import FormularioTrabajo from './pages/FormularioTrabajo'
import FormularioCoche from './pages/FormularioCoche'
import ConsultarDatos from './pages/ConsultarDatos'
import { DatosPrivadosCoches, DatosPrivadosTrabajadores, DatosPrivadosTrabajos } from './pages/DatosPrivados'
import NotFound from './pages/NotFound'
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
          
          {/* Formularios */}
          <Route path="/formulario-coche" element={<FormularioCoche />} />
          <Route path="/formulario-trabajo" element={<FormularioTrabajo />} />
          
          {/* Datos Privados */}
          <Route path="/datos-privados/coches" element={<DatosPrivadosCoches />} />
          <Route path="/datos-privados/trabajadores" element={<DatosPrivadosTrabajadores />} />
          <Route path="/datos-privados/trabajos" element={<DatosPrivadosTrabajos />} />
          
          {/* Consultar Datos */}
          <Route path="/consultar" element={<ConsultarDatos />} />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Container>
    </>
  )
}

export default App

