import { Box, Typography, Grid, Paper, Button } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar'
import WorkIcon from '@mui/icons-material/Work'
import PeopleIcon from '@mui/icons-material/People'
import SearchIcon from '@mui/icons-material/Search'
import LockIcon from '@mui/icons-material/Lock'

const Dashboard = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom align="center" sx={{ mb: 4 }}>
        Sistema de Gestión SEPCAN MARINA
      </Typography>
      
      <Grid container spacing={4}>
        {/* Formularios Section */}
        <Grid item xs={12}>
          <Typography variant="h5" gutterBottom sx={{ mb: 2 }}>
            Formularios
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Paper 
                elevation={3} 
                sx={{ 
                  p: 3, 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center',
                  height: '100%',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: 6,
                  }
                }}
              >
                <DirectionsCarIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Formulario de Coche
                </Typography>
                <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 2 }}>
                  Registre información sobre los coches utilizados en los trabajos.
                </Typography>
                <Button 
                  variant="contained" 
                  component={RouterLink} 
                  to="/formulario-coche"
                  sx={{ mt: 'auto' }}
                >
                  Ir al Formulario
                </Button>
              </Paper>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Paper 
                elevation={3} 
                sx={{ 
                  p: 3, 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center',
                  height: '100%',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: 6,
                  }
                }}
              >
                <WorkIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Formulario de Trabajo
                </Typography>
                <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 2 }}>
                  Registre información sobre los trabajos realizados.
                </Typography>
                <Button 
                  variant="contained" 
                  component={RouterLink} 
                  to="/formulario-trabajo"
                  sx={{ mt: 'auto' }}
                >
                  Ir al Formulario
                </Button>
              </Paper>
            </Grid>
          </Grid>
        </Grid>
        
        {/* Datos Privados Section */}
        <Grid item xs={12}>
          <Typography variant="h5" gutterBottom sx={{ mb: 2 }}>
            Datos Privados
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Paper 
                elevation={3} 
                sx={{ 
                  p: 3, 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center',
                  height: '100%',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: 6,
                  }
                }}
              >
                <Box sx={{ position: 'relative' }}>
                  <DirectionsCarIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
                  <LockIcon sx={{ 
                    position: 'absolute', 
                    top: -10, 
                    right: -10, 
                    color: 'warning.main',
                    backgroundColor: 'white',
                    borderRadius: '50%',
                    padding: '2px'
                  }} />
                </Box>
                <Typography variant="h6" gutterBottom>
                  Gestión de Coches
                </Typography>
                <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 2 }}>
                  Administre la información de los coches (requiere contraseña).
                </Typography>
                <Button 
                  variant="contained" 
                  component={RouterLink} 
                  to="/datos-privados/coches"
                  sx={{ mt: 'auto' }}
                >
                  Gestionar Coches
                </Button>
              </Paper>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Paper 
                elevation={3} 
                sx={{ 
                  p: 3, 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center',
                  height: '100%',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: 6,
                  }
                }}
              >
                <Box sx={{ position: 'relative' }}>
                  <PeopleIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
                  <LockIcon sx={{ 
                    position: 'absolute', 
                    top: -10, 
                    right: -10, 
                    color: 'warning.main',
                    backgroundColor: 'white',
                    borderRadius: '50%',
                    padding: '2px'
                  }} />
                </Box>
                <Typography variant="h6" gutterBottom>
                  Gestión de Trabajadores
                </Typography>
                <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 2 }}>
                  Administre la información de los trabajadores (requiere contraseña).
                </Typography>
                <Button 
                  variant="contained" 
                  component={RouterLink} 
                  to="/datos-privados/trabajadores"
                  sx={{ mt: 'auto' }}
                >
                  Gestionar Trabajadores
                </Button>
              </Paper>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Paper 
                elevation={3} 
                sx={{ 
                  p: 3, 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center',
                  height: '100%',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: 6,
                  }
                }}
              >
                <Box sx={{ position: 'relative' }}>
                  <WorkIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
                  <LockIcon sx={{ 
                    position: 'absolute', 
                    top: -10, 
                    right: -10, 
                    color: 'warning.main',
                    backgroundColor: 'white',
                    borderRadius: '50%',
                    padding: '2px'
                  }} />
                </Box>
                <Typography variant="h6" gutterBottom>
                  Gestión de Trabajos
                </Typography>
                <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 2 }}>
                  Administre la información de los trabajos (requiere contraseña).
                </Typography>
                <Button 
                  variant="contained" 
                  component={RouterLink} 
                  to="/datos-privados/trabajos"
                  sx={{ mt: 'auto' }}
                >
                  Gestionar Trabajos
                </Button>
              </Paper>
            </Grid>
          </Grid>
        </Grid>
        
        {/* Consultar Datos Section */}
        <Grid item xs={12}>
          <Paper 
            elevation={3} 
            sx={{ 
              p: 3, 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center',
              transition: 'transform 0.3s, box-shadow 0.3s',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: 6,
              }
            }}
          >
            <Box sx={{ position: 'relative' }}>
              <SearchIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
              <LockIcon sx={{ 
                position: 'absolute', 
                top: -10, 
                right: -10, 
                color: 'warning.main',
                backgroundColor: 'white',
                borderRadius: '50%',
                padding: '2px'
              }} />
            </Box>
            <Typography variant="h6" gutterBottom>
              Consultar Datos
            </Typography>
            <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 2 }}>
              Consulte y exporte datos de formularios (requiere contraseña).
            </Typography>
            <Button 
              variant="contained" 
              component={RouterLink} 
              to="/consultar"
            >
              Ir a Consultas
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
}

export default Dashboard 