import { useState, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import {
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Tab,
  FormHelperText,
} from '@mui/material'
import DownloadIcon from '@mui/icons-material/Download'

import {
  queryVehicleFormularies,
  queryJobFormularies,
  queryCombinedData,
  getVehicleTimestamps,
  QueryParams,
} from '../services/api'

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`query-tabpanel-${index}`}
      aria-labelledby={`query-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  )
}

const QueryPage = () => {
  const [tabValue, setTabValue] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [vehicleData, setVehicleData] = useState<any[]>([])
  const [jobData, setJobData] = useState<any[]>([])
  const [availableTimestamps, setAvailableTimestamps] = useState<string[]>([])
  const [isLoadingTimestamps, setIsLoadingTimestamps] = useState(false)
  
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<QueryParams>({
    defaultValues: {
      employee_id: undefined,
      job_id: undefined,
      vehicle_id: undefined,
      start_time: undefined,
      end_time: undefined,
      format: 'json',
    },
  })

  // Watch start_time to validate end_time
  const startTime = watch('start_time')

  // Fetch available timestamps on component mount
  useEffect(() => {
    const fetchTimestamps = async () => {
      try {
        setIsLoadingTimestamps(true)
        const timestamps = await getVehicleTimestamps()
        setAvailableTimestamps(timestamps || [])
      } catch (error) {
        console.error('Error fetching timestamps:', error)
      } finally {
        setIsLoadingTimestamps(false)
      }
    }

    fetchTimestamps()
  }, [])

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue)
  }

  const onSubmit = async (data: QueryParams) => {
    try {
      setIsLoading(true)
      
      if (data.format === 'excel') {
        // Handle Excel download based on current tab
        if (tabValue === 0) {
          await queryVehicleFormularies({ ...data, format: 'excel' })
        } else if (tabValue === 1) {
          await queryJobFormularies({ ...data, format: 'excel' })
        } else {
          await queryCombinedData({ ...data, format: 'excel' })
        }
      } else {
        // Handle JSON data retrieval based on current tab
        if (tabValue === 0) {
          const result = await queryVehicleFormularies(data)
          setVehicleData(result || [])
          setJobData([])
        } else if (tabValue === 1) {
          const result = await queryJobFormularies(data)
          setJobData(result || [])
          setVehicleData([])
        } else {
          const result = await queryCombinedData(data)
          setVehicleData(result?.vehicle_formularies || [])
          setJobData(result?.job_formularies || [])
        }
      }
    } catch (error) {
      console.error('Error querying data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="form-container">
      <Typography variant="h4" component="h1" className="page-title">
        Consultar Datos
      </Typography>
      
      <Typography variant="body1" paragraph>
        Utilice esta página para consultar y descargar datos de la base de datos. Puede filtrar por rango de tiempo u otros parámetros.
      </Typography>
      
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3}>
            {/* Time Range Filters */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Filtro de Rango de Tiempo
              </Typography>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Controller
                name="start_time"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.start_time} disabled={isLoadingTimestamps}>
                    <InputLabel>Hora de Inicio</InputLabel>
                    <Select
                      {...field}
                      label="Hora de Inicio"
                      value={field.value || ''}
                      onChange={(e) => {
                        field.onChange(e.target.value)
                        // Clear end_time if it's before the new start_time
                        const endTime = watch('end_time')
                        if (endTime && e.target.value && endTime < e.target.value) {
                          setValue('end_time', undefined)
                        }
                      }}
                    >
                      <MenuItem value="">
                        <em>Ninguno</em>
                      </MenuItem>
                      {availableTimestamps.map((timestamp) => (
                        <MenuItem key={timestamp} value={timestamp}>
                          {timestamp}
                        </MenuItem>
                      ))}
                    </Select>
                    {isLoadingTimestamps && <FormHelperText>Cargando marcas de tiempo disponibles...</FormHelperText>}
                    {errors.start_time && <FormHelperText>{errors.start_time.message}</FormHelperText>}
                  </FormControl>
                )}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Controller
                name="end_time"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.end_time} disabled={isLoadingTimestamps || !startTime}>
                    <InputLabel>Hora de Fin</InputLabel>
                    <Select
                      {...field}
                      label="Hora de Fin"
                      value={field.value || ''}
                    >
                      <MenuItem value="">
                        <em>Ninguno</em>
                      </MenuItem>
                      {availableTimestamps
                        .filter((timestamp) => !startTime || timestamp >= startTime)
                        .map((timestamp) => (
                          <MenuItem key={timestamp} value={timestamp}>
                            {timestamp}
                          </MenuItem>
                        ))}
                    </Select>
                    {!startTime && <FormHelperText>Por favor, seleccione primero una hora de inicio</FormHelperText>}
                    {errors.end_time && <FormHelperText>{errors.end_time.message}</FormHelperText>}
                  </FormControl>
                )}
              />
            </Grid>
            
            {/* Other Filters */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Filtros Adicionales (Opcional)
              </Typography>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Controller
                name="employee_id"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="ID del Empleado"
                    type="number"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    value={field.value || ''}
                    onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                  />
                )}
              />
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Controller
                name="job_id"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="ID del Trabajo"
                    type="number"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    value={field.value || ''}
                    onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                  />
                )}
              />
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Controller
                name="vehicle_id"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="ID del Vehículo"
                    type="number"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    value={field.value || ''}
                    onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                  />
                )}
              />
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Controller
                name="format"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth>
                    <InputLabel>Formato</InputLabel>
                    <Select {...field} label="Formato">
                      <MenuItem value="json">JSON (ver en navegador)</MenuItem>
                      <MenuItem value="excel">Excel (descargar)</MenuItem>
                    </Select>
                  </FormControl>
                )}
              />
            </Grid>
            
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={isLoading}
                  startIcon={isLoading ? <CircularProgress size={20} /> : <DownloadIcon />}
                >
                  {isLoading ? 'Cargando...' : 'Consultar Datos'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
      
      <Paper elevation={3}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="query tabs">
            <Tab label="Formularios de Vehículo" />
            <Tab label="Formularios de Trabajo" />
            <Tab label="Datos Combinados" />
          </Tabs>
        </Box>
        
        <TabPanel value={tabValue} index={0}>
          {vehicleData.length > 0 ? (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>ID del Empleado</TableCell>
                    <TableCell>Nombre del Empleado</TableCell>
                    <TableCell>ID del Trabajo</TableCell>
                    <TableCell>Lugar del Trabajo</TableCell>
                    <TableCell>ID del Vehículo</TableCell>
                    <TableCell>Condición del Vehículo</TableCell>
                    <TableCell>Limpieza del Vehículo</TableCell>
                    <TableCell>Comentarios</TableCell>
                    <TableCell>Marca de Tiempo</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {vehicleData.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell>{row.id}</TableCell>
                      <TableCell>{row.employee_id}</TableCell>
                      <TableCell>{row.employee_name}</TableCell>
                      <TableCell>{row.job_id}</TableCell>
                      <TableCell>{row.job_place}</TableCell>
                      <TableCell>{row.vehicle_id}</TableCell>
                      <TableCell>{row.vehicle_condition}</TableCell>
                      <TableCell>{row.vehicle_clean}</TableCell>
                      <TableCell>{row.comments}</TableCell>
                      <TableCell>{new Date(row.timestamp).toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography variant="body1" sx={{ p: 2 }}>
              No hay datos de formularios de vehículo para mostrar. Por favor, consulte la base de datos.
            </Typography>
          )}
        </TabPanel>
        
        <TabPanel value={tabValue} index={1}>
          {jobData.length > 0 ? (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>ID del Empleado</TableCell>
                    <TableCell>Nombre del Empleado</TableCell>
                    <TableCell>ID del Trabajo</TableCell>
                    <TableCell>Lugar del Trabajo</TableCell>
                    <TableCell>Tiempo de Desplazamiento</TableCell>
                    <TableCell>Tiempo de Trabajo</TableCell>
                    <TableCell>ID del Vehículo</TableCell>
                    <TableCell>Clavos Utilizados</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {jobData.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell>{row.id}</TableCell>
                      <TableCell>{row.employee_id}</TableCell>
                      <TableCell>{row.employee_name}</TableCell>
                      <TableCell>{row.job_id}</TableCell>
                      <TableCell>{row.job_place}</TableCell>
                      <TableCell>{row.time_to_commute}</TableCell>
                      <TableCell>{row.time_of_work}</TableCell>
                      <TableCell>{row.vehicle_id}</TableCell>
                      <TableCell>{row.nails_used}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography variant="body1" sx={{ p: 2 }}>
              No hay datos de formularios de trabajo para mostrar. Por favor, consulte la base de datos.
            </Typography>
          )}
        </TabPanel>
        
        <TabPanel value={tabValue} index={2}>
          <Typography variant="h6" gutterBottom>
            Formularios de Vehículo
          </Typography>
          {vehicleData.length > 0 ? (
            <TableContainer sx={{ mb: 4 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>ID del Empleado</TableCell>
                    <TableCell>Nombre del Empleado</TableCell>
                    <TableCell>ID del Trabajo</TableCell>
                    <TableCell>Lugar del Trabajo</TableCell>
                    <TableCell>ID del Vehículo</TableCell>
                    <TableCell>Condición del Vehículo</TableCell>
                    <TableCell>Limpieza del Vehículo</TableCell>
                    <TableCell>Marca de Tiempo</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {vehicleData.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell>{row.id}</TableCell>
                      <TableCell>{row.employee_id}</TableCell>
                      <TableCell>{row.employee_name}</TableCell>
                      <TableCell>{row.job_id}</TableCell>
                      <TableCell>{row.job_place}</TableCell>
                      <TableCell>{row.vehicle_id}</TableCell>
                      <TableCell>{row.vehicle_condition}</TableCell>
                      <TableCell>{row.vehicle_clean}</TableCell>
                      <TableCell>{new Date(row.timestamp).toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography variant="body1" sx={{ p: 2, mb: 4 }}>
              No hay datos de formularios de vehículo para mostrar. Por favor, consulte la base de datos.
            </Typography>
          )}
          
          <Typography variant="h6" gutterBottom>
            Formularios de Trabajo
          </Typography>
          {jobData.length > 0 ? (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>ID del Empleado</TableCell>
                    <TableCell>Nombre del Empleado</TableCell>
                    <TableCell>ID del Trabajo</TableCell>
                    <TableCell>Lugar del Trabajo</TableCell>
                    <TableCell>Tiempo de Desplazamiento</TableCell>
                    <TableCell>Tiempo de Trabajo</TableCell>
                    <TableCell>ID del Vehículo</TableCell>
                    <TableCell>Clavos Utilizados</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {jobData.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell>{row.id}</TableCell>
                      <TableCell>{row.employee_id}</TableCell>
                      <TableCell>{row.employee_name}</TableCell>
                      <TableCell>{row.job_id}</TableCell>
                      <TableCell>{row.job_place}</TableCell>
                      <TableCell>{row.time_to_commute}</TableCell>
                      <TableCell>{row.time_of_work}</TableCell>
                      <TableCell>{row.vehicle_id}</TableCell>
                      <TableCell>{row.nails_used}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography variant="body1" sx={{ p: 2 }}>
              No hay datos de formularios de trabajo para mostrar. Por favor, consulte la base de datos.
            </Typography>
          )}
        </TabPanel>
      </Paper>
    </div>
  )
}

export default QueryPage 