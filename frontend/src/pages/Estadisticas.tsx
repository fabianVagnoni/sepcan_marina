import { useState, useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  TextField,
  CircularProgress,
  useTheme,
  Alert,
  Grid
} from '@mui/material';
import axios from 'axios';
import Plotly from 'plotly.js-dist';

const CORRECT_PASSWORD = "MiViejoSanJuan2024";

interface PlotData {
  distribution: any;
  monthly: any;
  timeline: any;
}

const Estadisticas = () => {
  const theme = useTheme();
  const distributionPlotRef = useRef<HTMLDivElement>(null);
  const monthlyPlotRef = useRef<HTMLDivElement>(null);
  const timelinePlotRef = useRef<HTMLDivElement>(null);
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(true);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [plotData, setPlotData] = useState<PlotData | null>(null);

  useEffect(() => {
    if (isAuthorized) {
      fetchData();
    }
  }, [isAuthorized]);

  useEffect(() => {
    if (plotData) {
      renderPlots();
    }
  }, [plotData, theme.palette]);

  const handlePasswordSubmit = () => {
    if (password === CORRECT_PASSWORD) {
      setIsAuthorized(true);
      setIsPasswordDialogOpen(false);
      setPasswordError(null);
    } else {
      setPasswordError('Contraseña incorrecta');
    }
  };

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const [distributionRes, monthlyRes, timelineRes] = await Promise.all([
        axios.get('/api/statistics/jobs-distribution'),
        axios.get('/api/statistics/monthly-distribution'),
        axios.get('/api/statistics/timeline')
      ]);
      
      setPlotData({
        distribution: distributionRes.data,
        monthly: monthlyRes.data,
        timeline: timelineRes.data
      });
    } catch (error) {
      console.error('Error loading statistics:', error);
      if (axios.isAxiosError(error)) {
        console.error('Response data:', error.response?.data);
        setError(error.response?.data?.detail || 'Error al cargar las estadísticas');
      } else {
        setError('Error al cargar las estadísticas');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const renderPlots = async () => {
    if (!plotData) return;

    try {
      // Distribution plot
      if (distributionPlotRef.current) {
        const distributionLayout = {
          ...plotData.distribution.layout,
          paper_bgcolor: theme.palette.background.paper,
          plot_bgcolor: theme.palette.background.paper,
          font: {
            ...plotData.distribution.layout?.font,
            color: theme.palette.text.primary
          }
        };

        await Plotly.newPlot(
          distributionPlotRef.current,
          plotData.distribution.data,
          distributionLayout,
          { displayModeBar: false, responsive: true }
        );
      }

      // Monthly distribution plot
      if (monthlyPlotRef.current) {
        const monthlyLayout = {
          ...plotData.monthly.layout,
          paper_bgcolor: theme.palette.background.paper,
          plot_bgcolor: theme.palette.background.paper,
          font: {
            ...plotData.monthly.layout?.font,
            color: theme.palette.text.primary
          }
        };

        await Plotly.newPlot(
          monthlyPlotRef.current,
          plotData.monthly.data,
          monthlyLayout,
          { displayModeBar: false, responsive: true }
        );
      }

      // Timeline plot
      if (timelinePlotRef.current) {
        const timelineLayout = {
          ...plotData.timeline.layout,
          paper_bgcolor: theme.palette.background.paper,
          plot_bgcolor: theme.palette.background.paper,
          font: {
            ...plotData.timeline.layout?.font,
            color: theme.palette.text.primary
          }
        };

        await Plotly.newPlot(
          timelinePlotRef.current,
          plotData.timeline.data,
          timelineLayout,
          { displayModeBar: false, responsive: true }
        );
      }
    } catch (plotError) {
      console.error("Error creating plots:", plotError);
      setError('Error al crear las gráficas');
    }
  };

  // Clean up plots on unmount
  useEffect(() => {
    return () => {
      if (distributionPlotRef.current) Plotly.purge(distributionPlotRef.current);
      if (monthlyPlotRef.current) Plotly.purge(monthlyPlotRef.current);
      if (timelinePlotRef.current) Plotly.purge(timelinePlotRef.current);
    };
  }, []);

  return (
    <Box sx={{ pb: 4 }}>
      <Typography 
        variant="h4" 
        gutterBottom 
        align="center"
        sx={{
          fontWeight: 'bold',
          color: theme.palette.primary.main,
          mb: 4
        }}
      >
        Estadísticas de Trabajos
      </Typography>

      {/* Password Dialog */}
      <Dialog 
        open={isPasswordDialogOpen} 
        onClose={() => {}}
        PaperProps={{
          sx: {
            borderRadius: 2,
            p: 1
          }
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>Verificación de Acceso</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Por favor, ingrese la contraseña para acceder a las estadísticas.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Contraseña"
            type="password"
            fullWidth
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={!!passwordError}
            helperText={passwordError}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handlePasswordSubmit();
              }
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2
              }
            }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 1 }}>
          <Button 
            onClick={handlePasswordSubmit} 
            variant="contained" 
            color="primary"
            sx={{
              borderRadius: 2,
              px: 3
            }}
          >
            Acceder
          </Button>
        </DialogActions>
      </Dialog>

      {isAuthorized && (
        <Grid container spacing={3}>
          {error && (
            <Grid item xs={12}>
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            </Grid>
          )}
          
          {isLoading ? (
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                <CircularProgress size={40} thickness={4} />
              </Box>
            </Grid>
          ) : (
            <>
              <Grid item xs={12}>
                <Paper 
                  elevation={3} 
                  sx={{ 
                    p: 3,
                    borderRadius: 3,
                    backgroundColor: theme.palette.background.paper,
                    boxShadow: theme.shadows[3]
                  }}
                >
                  <Box 
                    ref={distributionPlotRef}
                    sx={{ 
                      height: '400px',
                      width: '100%',
                      visibility: error ? 'hidden' : 'visible'
                    }}
                  />
                </Paper>
              </Grid>
              <Grid item xs={12} md={6}>
                <Paper 
                  elevation={3} 
                  sx={{ 
                    p: 3,
                    borderRadius: 3,
                    backgroundColor: theme.palette.background.paper,
                    boxShadow: theme.shadows[3]
                  }}
                >
                  <Box 
                    ref={monthlyPlotRef}
                    sx={{ 
                      height: '400px',
                      width: '100%',
                      visibility: error ? 'hidden' : 'visible'
                    }}
                  />
                </Paper>
              </Grid>
              <Grid item xs={12} md={6}>
                <Paper 
                  elevation={3} 
                  sx={{ 
                    p: 3,
                    borderRadius: 3,
                    backgroundColor: theme.palette.background.paper,
                    boxShadow: theme.shadows[3]
                  }}
                >
                  <Box 
                    ref={timelinePlotRef}
                    sx={{ 
                      height: '400px',
                      width: '100%',
                      visibility: error ? 'hidden' : 'visible'
                    }}
                  />
                </Paper>
              </Grid>
            </>
          )}
        </Grid>
      )}
    </Box>
  );
};

export default Estadisticas; 