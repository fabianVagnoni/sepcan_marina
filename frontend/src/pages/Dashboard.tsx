import { Link as RouterLink } from 'react-router-dom'
import {
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Box,
} from '@mui/material'
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar'
import BuildIcon from '@mui/icons-material/Build'
import StorageIcon from '@mui/icons-material/Storage'

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      <Typography variant="h4" component="h1" className="page-title" gutterBottom>
        Service Company Forms
      </Typography>
      
      <Typography variant="body1" paragraph>
        Welcome to the Service Company Forms application. This system allows employees to submit
        vehicle and job forms, and provides a way for administrators to query the data.
      </Typography>
      
      <Box sx={{ mt: 4 }}>
        <Grid container spacing={4}>
          {/* Vehicle Form Card */}
          <Grid item xs={12} sm={6} md={4}>
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
                  Vehicle Form
                </Typography>
                <Typography>
                  Fill out this form before meeting the client. It includes information about the vehicle
                  condition and cleanliness.
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
                  Go to Vehicle Form
                </Button>
              </CardActions>
            </Card>
          </Grid>
          
          {/* Job Form Card */}
          <Grid item xs={12} sm={6} md={4}>
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
                  Job Form
                </Typography>
                <Typography>
                  Fill out this form after completing the job. It includes information about the time spent
                  and materials used.
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
                  Go to Job Form
                </Button>
              </CardActions>
            </Card>
          </Grid>
          
          {/* Query Data Card */}
          <Grid item xs={12} sm={6} md={4}>
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
                  Query Data
                </Typography>
                <Typography>
                  Query and download data from the database. Filter by employee, job, or vehicle.
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
                  Go to Query Page
                </Button>
              </CardActions>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </div>
  )
}

export default Dashboard 