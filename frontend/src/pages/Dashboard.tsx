import { Link as RouterLink } from 'react-router-dom'
import {
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Box,
  Paper,
} from '@mui/material'
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar'
import BuildIcon from '@mui/icons-material/Build'
import StorageIcon from '@mui/icons-material/Storage'

const Dashboard = () => {
  return (
    <Paper elevation={3} className="form-container">
      <Typography variant="h4" component="h1" className="page-title" gutterBottom>
        Formularios SEPCAN Marina
      </Typography>
      
      <Typography variant="body1" paragraph>
        Bienvenido a la aplicación de Formularios de SEPCAN Marina. Este sistema permite a los empleados enviar
        formularios de vehículos y trabajos, y proporciona una forma para que los administradores consulten los datos.
      </Typography>
      
      <Box sx={{ mt: 4 }}>
        <Grid 
          container 
          spacing={4} 
          className="dashboard-grid"
          justifyContent="center"
          sx={{
            flexWrap: { xs: 'wrap', md: 'nowrap' }
          }}
        >
          {/* Vehicle Form Card */}
          <Grid item xs={12} sm={6} md={4} sx={{ width: '100%', maxWidth: '350px' }}>
            <Card 
              sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: 6,
                },
              }}
            >
              <Box sx={{ p: 2, display: 'flex', justifyContent: 'center' }}>
                <DirectionsCarIcon sx={{ fontSize: 60, color: 'primary.main' }} />
              </Box>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h5" component="h2">
                  Formulario de Vehículo
                </Typography>
                <Typography>
                  Complete este formulario antes de reunirse con el cliente. Incluye información sobre la
                  condición y limpieza del vehículo.
                </Typography>
              </CardContent>
              <CardActions>
                <Button 
                  size="small" 
                  color="primary" 
                  component={RouterLink} 
                  to="/vehicle-form"
                  fullWidth
                  variant="contained"
                >
                  Ir al Formulario de Vehículo
                </Button>
              </CardActions>
            </Card>
          </Grid>
          
          {/* Job Form Card */}
          <Grid item xs={12} sm={6} md={4} sx={{ width: '100%', maxWidth: '350px' }}>
            <Card 
              sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: 6,
                },
              }}
            >
              <Box sx={{ p: 2, display: 'flex', justifyContent: 'center' }}>
                <BuildIcon sx={{ fontSize: 60, color: 'primary.main' }} />
              </Box>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h5" component="h2">
                  Formulario de Trabajo
                </Typography>
                <Typography>
                  Complete este formulario después de terminar el trabajo. Incluye información sobre el tiempo
                  dedicado y los materiales utilizados.
                </Typography>
              </CardContent>
              <CardActions>
                <Button 
                  size="small" 
                  color="primary" 
                  component={RouterLink} 
                  to="/job-form"
                  fullWidth
                  variant="contained"
                >
                  Ir al Formulario de Trabajo
                </Button>
              </CardActions>
            </Card>
          </Grid>
          
          {/* Query Data Card */}
          <Grid item xs={12} sm={6} md={4} sx={{ width: '100%', maxWidth: '350px' }}>
            <Card 
              sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: 6,
                },
              }}
            >
              <Box sx={{ p: 2, display: 'flex', justifyContent: 'center' }}>
                <StorageIcon sx={{ fontSize: 60, color: 'primary.main' }} />
              </Box>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h5" component="h2">
                  Consultar Datos
                </Typography>
                <Typography>
                  Consulte y descargue datos de la base de datos. Filtre por empleado, trabajo o vehículo.
                </Typography>
              </CardContent>
              <CardActions>
                <Button 
                  size="small" 
                  color="primary" 
                  component={RouterLink} 
                  to="/query"
                  fullWidth
                  variant="contained"
                >
                  Ir a la Página de Consulta
                </Button>
              </CardActions>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  )
}

export default Dashboard 