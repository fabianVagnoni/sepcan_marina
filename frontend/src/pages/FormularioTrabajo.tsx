import { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  MenuItem,
  Snackbar,
  Alert,
  CircularProgress,
} from '@mui/material'
import { createFormularioTrabajo, getAllCoches, getAllTrabajadores, getAllTrabajos } from '../services/api'

interface FormData {
  placa_coche: number
  dni_trabajador: number
  id_trabajo: number
  otros: string
  fecha: string
  hora_final: string
  horas_trabajadas: number
  lugar_trabajo: string
  tiempo_llegada: number
}

const FormularioTrabajo = () => {
  const [formData, setFormData] = useState<FormData>({
    placa_coche: 0,
    dni_trabajador: 0,
    id_trabajo: 0,
    otros: '',
    fecha: '',
    hora_final: '',
    horas_trabajadas: 0,
    lugar_trabajo: '',
    tiempo_llegada: 0,
  })

  const [coches, setCoches] = useState<any[]>([])
  const [trabajadores, setTrabajadores] = useState<any[]>([])
  const [trabajos, setTrabajos] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [dataLoading, setDataLoading] = useState(true)

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
        setError('Error al cargar los datos. Por favor, inténtelo de nuevo más tarde.')
      } finally {
        setDataLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    
    // Convert numeric values
    if (['placa_coche', 'dni_trabajador', 'id_trabajo', 'tiempo_llegada'].includes(name)) {
      setFormData({
        ...formData,
        [name]: parseInt(value) || 0,
      })
    } else if (name === 'horas_trabajadas') {
      setFormData({
        ...formData,
        [name]: parseFloat(value) || 0,
      })
    } else {
      setFormData({
        ...formData,
        [name]: value,
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      await createFormularioTrabajo(formData)
      setSuccess(true)
      // Reset form
      setFormData({
        placa_coche: 0,
        dni_trabajador: 0,
        id_trabajo: 0,
        otros: '',
        fecha: '',
        hora_final: '',
        horas_trabajadas: 0,
        lugar_trabajo: '',
        tiempo_llegada: 0,
      })
    } catch (err: any) {
      console.error('Error submitting form:', err)
      setError(err.response?.data?.detail || 'Error al enviar el formulario. Por favor, inténtelo de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  const handleCloseSnackbar = () => {
    setSuccess(false)
    setError(null)
  }

  if (dataLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom align="center">
        Formulario de Trabajo
      </Typography>
      <Paper elevation={3} sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                select
                fullWidth
                label="Coche (Placa)"
                name="placa_coche"
                value={formData.placa_coche || ''}
                onChange={handleChange}
                required
                helperText="Seleccione la placa del coche"
              >
                <MenuItem value={0} disabled>
                  Seleccione un coche
                </MenuItem>
                {coches.map((coche) => (
                  <MenuItem key={coche.placa} value={coche.placa}>
                    {coche.placa} - {coche.marca} {coche.modelo}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                select
                fullWidth
                label="Trabajador (DNI)"
                name="dni_trabajador"
                value={formData.dni_trabajador || ''}
                onChange={handleChange}
                required
                helperText="Seleccione el DNI del trabajador"
              >
                <MenuItem value={0} disabled>
                  Seleccione un trabajador
                </MenuItem>
                {trabajadores.map((trabajador) => (
                  <MenuItem key={trabajador.dni} value={trabajador.dni}>
                    {trabajador.dni} - {trabajador.nombre} {trabajador.apellido}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                select
                fullWidth
                label="Trabajo (ID)"
                name="id_trabajo"
                value={formData.id_trabajo || ''}
                onChange={handleChange}
                required
                helperText="Seleccione el ID del trabajo"
              >
                <MenuItem value={0} disabled>
                  Seleccione un trabajo
                </MenuItem>
                {trabajos.map((trabajo) => (
                  <MenuItem key={trabajo.id} value={trabajo.id}>
                    {trabajo.id} - {trabajo.cliente}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Fecha"
                name="fecha"
                value={formData.fecha}
                onChange={handleChange}
                placeholder="DD/MM/AAAA"
                helperText="Ingrese la fecha (ej: 07/02/2003)"
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Hora Final"
                name="hora_final"
                value={formData.hora_final}
                onChange={handleChange}
                placeholder="HH:MM"
                helperText="Ingrese la hora final (ej: 17:05)"
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Horas Trabajadas"
                name="horas_trabajadas"
                type="number"
                value={formData.horas_trabajadas}
                onChange={handleChange}
                inputProps={{ step: 0.1 }}
                helperText="Ingrese las horas trabajadas (ej: 1.5)"
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Lugar del Trabajo"
                name="lugar_trabajo"
                value={formData.lugar_trabajo}
                onChange={handleChange}
                helperText="Ingrese el lugar del trabajo (ej: Arinaga)"
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Tiempo para Llegar (minutos)"
                name="tiempo_llegada"
                type="number"
                value={formData.tiempo_llegada}
                onChange={handleChange}
                helperText="Ingrese el tiempo para llegar en minutos (ej: 45)"
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Otros detalles"
                name="otros"
                value={formData.otros}
                onChange={handleChange}
                multiline
                rows={4}
                helperText="Ingrese cualquier detalle adicional sobre el trabajo"
              />
            </Grid>
            
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                disabled={loading}
                sx={{ mt: 2 }}
              >
                {loading ? <CircularProgress size={24} /> : 'Enviar Formulario'}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
      
      <Snackbar open={success} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          ¡Formulario enviado con éxito!
        </Alert>
      </Snackbar>
      
      <Snackbar open={!!error} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default FormularioTrabajo 