import { useState, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Divider,
  Tabs,
  Tab,
} from '@mui/material'
import { queryCombinedData, getAllCoches, getAllTrabajadores, getAllTrabajos } from '../services/api'

// Form data interface
interface FormData {
  dni_trabajador?: number;
  id_trabajo?: number;
  placa_coche?: number;
  fecha_inicio?: string;
  fecha_fin?: string;
  format?: 'json' | 'excel';
  password: string;
}

// Result data interfaces
interface FormularioCoche {
  tipo: string;
  placa_coche: number;
  marca_coche: string;
  modelo_coche: string;
  dni_trabajador: number;
  nombre_trabajador: string;
  apellido_trabajador: string;
  id_trabajo: number;
  cliente_trabajo: string;
  fecha_trabajo: string;
  fecha: string;
  hora_partida: string;
  estado_coche: string;
  otros?: string;
}

interface FormularioTrabajo {
  tipo: string;
  placa_coche: number;
  marca_coche: string;
  modelo_coche: string;
  dni_trabajador: number;
  nombre_trabajador: string;
  apellido_trabajador: string;
  id_trabajo: number;
  cliente_trabajo: string;
  fecha_trabajo: string;
  fecha: string;
  hora_final: string;
  horas_trabajadas: number;
  lugar_trabajo: string;
  tiempo_llegada: number;
  otros?: string;
}

interface CombinedData {
  formularios_coche: FormularioCoche[];
  formularios_trabajo: FormularioTrabajo[];
}

const ConsultarDatos = () => {
  const [results, setResults] = useState<CombinedData>({ formularios_coche: [], formularios_trabajo: [] })
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingData, setIsLoadingData] = useState(true)
  const [coches, setCoches] = useState<any[]>([])
  const [trabajadores, setTrabajadores] = useState<any[]>([])
  const [trabajos, setTrabajos] = useState<any[]>([])
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false)
  const [passwordError, setPasswordError] = useState<string | null>(null)
  const [queryAction, setQueryAction] = useState<'query' | 'export'>('query')
  const [activeTab, setActiveTab] = useState(0)

  const CORRECT_PASSWORD = import.meta.env.VITE_APP_ACCESS_PASSWORD

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm<FormData>({
    defaultValues: {
      dni_trabajador: undefined,
      id_trabajo: undefined,
      placa_coche: undefined,
      fecha_inicio: '',
      fecha_fin: '',
      format: 'json',
      password: '',
    },
  })

  // Load coches, trabajadores, and trabajos on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [cochesData, trabajadoresData, trabajosData] = await Promise.all([
          getAllCoches(),
          getAllTrabajadores(),
          getAllTrabajos(),
        ])
        setCoches(cochesData)
        setTrabajadores(trabajadoresData)
        setTrabajos(trabajosData)
      } catch (err) {
        console.error('Error fetching data:', err)
      } finally {
        setIsLoadingData(false)
      }
    }

    fetchData()
  }, [])

  const handlePasswordSubmit = async () => {
    const password = watch('password')
    if (password === CORRECT_PASSWORD) {
      setPasswordDialogOpen(false)
      setPasswordError(null)
      
      if (queryAction === 'query') {
        await executeQuery()
      } else {
        await executeExport()
      }
    } else {
      setPasswordError('Contraseña incorrecta')
    }
  }

  const executeQuery = async () => {
    setIsLoading(true)
    try {
      const formData = watch()
      const { password, ...queryData } = formData
      
      // Debug log
      console.log("Query params:", queryData);
      
      // Format dates for user feedback
      let dateMessage = "";
      if (queryData.fecha_inicio) {
        const startDate = new Date(queryData.fecha_inicio);
        const formattedStartDate = `${startDate.getDate().toString().padStart(2, '0')}/${(startDate.getMonth() + 1).toString().padStart(2, '0')}/${startDate.getFullYear()}`;
        dateMessage += `desde ${formattedStartDate}`;
      }
      if (queryData.fecha_fin) {
        const endDate = new Date(queryData.fecha_fin);
        const formattedEndDate = `${endDate.getDate().toString().padStart(2, '0')}/${(endDate.getMonth() + 1).toString().padStart(2, '0')}/${endDate.getFullYear()}`;
        dateMessage += dateMessage ? ` hasta ${formattedEndDate}` : `hasta ${formattedEndDate}`;
      }
      
      const data = await queryCombinedData(queryData)
      setResults(data || { formularios_coche: [], formularios_trabajo: [] })
      
      // Show feedback about the search
      const totalResults = (data?.formularios_coche?.length || 0) + (data?.formularios_trabajo?.length || 0);
      if (totalResults === 0 && dateMessage) {
        alert(`No se encontraron resultados ${dateMessage}. Intente con un rango de fechas diferente.`);
      }
    } catch (error) {
      console.error('Error querying data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const executeExport = async () => {
    try {
      const formData = watch();
      const { password, ...queryData } = formData;
      
      // Debug log
      console.log("Export params:", queryData);
      
      // Generate a unique timestamp to prevent caching
      const timestamp = new Date().getTime();
      
      // Build the query string
      const queryString = new URLSearchParams();
      if (queryData.dni_trabajador) queryString.append('dni_trabajador', queryData.dni_trabajador.toString());
      if (queryData.id_trabajo) queryString.append('id_trabajo', queryData.id_trabajo.toString());
      if (queryData.placa_coche) queryString.append('placa_coche', queryData.placa_coche.toString());
      if (queryData.fecha_inicio) queryString.append('fecha_inicio', queryData.fecha_inicio);
      if (queryData.fecha_fin) queryString.append('fecha_fin', queryData.fecha_fin);
      queryString.append('format', 'excel');
      // Add timestamp to prevent caching
      queryString.append('_t', timestamp.toString());
      
      // Use direct window.open approach with _blank target
      const exportUrl = `/api/query/combined-data?${queryString.toString()}`;
      window.open(exportUrl, '_blank');
    } catch (error) {
      console.error('Error exporting data:', error);
      alert('Error al exportar los datos. Por favor, inténtelo de nuevo más tarde.');
    }
  }

  const onSubmit = async () => {
    setQueryAction('query')
    setPasswordDialogOpen(true)
  }

  const handleExport = () => {
    setQueryAction('export')
    setPasswordDialogOpen(true)
  }

  const handleClosePasswordDialog = () => {
    setPasswordDialogOpen(false)
    setPasswordError(null)
  }

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  if (isLoadingData) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom align="center">
        Consultar Datos
      </Typography>
      
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Filtros de Búsqueda
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Controller
                name="placa_coche"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    fullWidth
                    label="Coche (Placa)"
                    value={field.value || ''}
                    onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                  >
                    <MenuItem value="">Todos los coches</MenuItem>
                    {coches.map((coche) => (
                      <MenuItem key={coche.placa} value={coche.placa}>
                        {coche.placa} - {coche.marca} {coche.modelo}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Controller
                name="dni_trabajador"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    fullWidth
                    label="Trabajador (DNI)"
                    value={field.value || ''}
                    onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                  >
                    <MenuItem value="">Todos los trabajadores</MenuItem>
                    {trabajadores.map((trabajador) => (
                      <MenuItem key={trabajador.dni} value={trabajador.dni}>
                        {trabajador.dni} - {trabajador.nombre} {trabajador.apellido}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Controller
                name="id_trabajo"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    fullWidth
                    label="Trabajo (ID)"
                    value={field.value || ''}
                    onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                  >
                    <MenuItem value="">Todos los trabajos</MenuItem>
                    {trabajos.map((trabajo) => (
                      <MenuItem key={trabajo.id} value={trabajo.id}>
                        {trabajo.id} - {trabajo.cliente}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </Grid>
            
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }}>
                <Typography variant="subtitle2">Rango de Fechas</Typography>
              </Divider>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2, textAlign: 'center' }}>
                El filtro buscará trabajos realizados entre las fechas seleccionadas (formato DD/MM/AAAA).
              </Typography>
            </Grid>
            
            {/* Date range filters */}
            <Grid item xs={12} md={6}>
              <Controller
                name="fecha_inicio"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Fecha de Inicio"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    helperText="Filtrar desde esta fecha (inclusive)"
                    inputProps={{
                      max: "2050-12-31",
                      min: "1900-01-01"
                    }}
                  />
                )}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Controller
                name="fecha_fin"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Fecha de Fin"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    helperText="Filtrar hasta esta fecha (inclusive)"
                    inputProps={{
                      max: "2030-12-31",
                      min: "1900-01-01"
                    }}
                  />
                )}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                disabled={isLoading}
              >
                {isLoading ? <CircularProgress size={24} /> : 'Consultar'}
              </Button>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Button
                variant="outlined"
                color="primary"
                onClick={handleExport}
                fullWidth
                disabled={isLoading}
              >
                Exportar a Excel
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
      
      {(results.formularios_coche.length > 0 || results.formularios_trabajo.length > 0) && (
        <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            Resultados (Coches: {results.formularios_coche.length}, Trabajos: {results.formularios_trabajo.length})
          </Typography>
          
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
            <Tabs value={activeTab} onChange={handleTabChange} aria-label="Tabs de resultados">
              <Tab label={`Formularios Coche (${results.formularios_coche.length})`} />
              <Tab label={`Formularios Trabajo (${results.formularios_trabajo.length})`} />
            </Tabs>
          </Box>
          
          {/* Formularios Coche Table */}
          {activeTab === 0 && (
            <TableContainer>
              {results.formularios_coche.length > 0 ? (
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Placa Coche</TableCell>
                      <TableCell>Marca/Modelo</TableCell>
                      <TableCell>DNI Trabajador</TableCell>
                      <TableCell>Nombre Trabajador</TableCell>
                      <TableCell>ID Trabajo</TableCell>
                      <TableCell>Cliente</TableCell>
                      <TableCell>Fecha Trabajo</TableCell>
                      <TableCell>Fecha</TableCell>
                      <TableCell>Hora Partida</TableCell>
                      <TableCell>Estado Coche</TableCell>
                      <TableCell>Otros</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {results.formularios_coche.map((result, index) => (
                      <TableRow key={index}>
                        <TableCell>{result.placa_coche}</TableCell>
                        <TableCell>{result.marca_coche} {result.modelo_coche}</TableCell>
                        <TableCell>{result.dni_trabajador}</TableCell>
                        <TableCell>{result.nombre_trabajador} {result.apellido_trabajador}</TableCell>
                        <TableCell>{result.id_trabajo}</TableCell>
                        <TableCell>{result.cliente_trabajo}</TableCell>
                        <TableCell>{result.fecha_trabajo}</TableCell>
                        <TableCell>{result.fecha}</TableCell>
                        <TableCell>{result.hora_partida}</TableCell>
                        <TableCell>{result.estado_coche}</TableCell>
                        <TableCell>{result.otros}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <Typography variant="body1" align="center" sx={{ py: 3 }}>
                  No se encontraron formularios de coche con los filtros seleccionados.
                </Typography>
              )}
            </TableContainer>
          )}
          
          {/* Formularios Trabajo Table */}
          {activeTab === 1 && (
            <TableContainer>
              {results.formularios_trabajo.length > 0 ? (
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Placa Coche</TableCell>
                      <TableCell>Marca/Modelo</TableCell>
                      <TableCell>DNI Trabajador</TableCell>
                      <TableCell>Nombre Trabajador</TableCell>
                      <TableCell>ID Trabajo</TableCell>
                      <TableCell>Cliente</TableCell>
                      <TableCell>Fecha Trabajo</TableCell>
                      <TableCell>Fecha</TableCell>
                      <TableCell>Hora Final</TableCell>
                      <TableCell>Horas Trabajadas</TableCell>
                      <TableCell>Lugar Trabajo</TableCell>
                      <TableCell>Tiempo Llegada</TableCell>
                      <TableCell>Otros</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {results.formularios_trabajo.map((result, index) => (
                      <TableRow key={index}>
                        <TableCell>{result.placa_coche}</TableCell>
                        <TableCell>{result.marca_coche} {result.modelo_coche}</TableCell>
                        <TableCell>{result.dni_trabajador}</TableCell>
                        <TableCell>{result.nombre_trabajador} {result.apellido_trabajador}</TableCell>
                        <TableCell>{result.id_trabajo}</TableCell>
                        <TableCell>{result.cliente_trabajo}</TableCell>
                        <TableCell>{result.fecha_trabajo}</TableCell>
                        <TableCell>{result.fecha}</TableCell>
                        <TableCell>{result.hora_final}</TableCell>
                        <TableCell>{result.horas_trabajadas}</TableCell>
                        <TableCell>{result.lugar_trabajo}</TableCell>
                        <TableCell>{result.tiempo_llegada}</TableCell>
                        <TableCell>{result.otros}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <Typography variant="body1" align="center" sx={{ py: 3 }}>
                  No se encontraron formularios de trabajo con los filtros seleccionados.
                </Typography>
              )}
            </TableContainer>
          )}
        </Paper>
      )}
      
      {/* Password Dialog */}
      <Dialog open={passwordDialogOpen} onClose={handleClosePasswordDialog}>
        <DialogTitle>Verificación de Acceso</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Por favor, ingrese la contraseña para acceder a los datos.
          </DialogContentText>
          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                autoFocus
                margin="dense"
                label="Contraseña"
                type="password"
                fullWidth
                variant="outlined"
                error={!!passwordError}
                helperText={passwordError}
              />
            )}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePasswordDialog}>Cancelar</Button>
          <Button onClick={handlePasswordSubmit} variant="contained" color="primary">
            {queryAction === 'query' ? 'Consultar' : 'Exportar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default ConsultarDatos 