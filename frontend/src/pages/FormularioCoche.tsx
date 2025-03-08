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
import { createFormularioCoche, getAllCoches, getAllTrabajadores, getAllTrabajos } from '../services/api'

interface FormData {
  placa_coche: number
  dni_trabajador: number
  id_trabajo: number
  otros: string
  fecha: string
  hora_partida: string
  estado_coche: string
}

const FormularioCoche = () => {
  const [formData, setFormData] = useState<FormData>({
    placa_coche: 0,
    dni_trabajador: 0,
    id_trabajo: 0,
    otros: '',
    fecha: '',
    hora_partida: '',
    estado_coche: '',
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
    if (['placa_coche', 'dni_trabajador', 'id_trabajo'].includes(name)) {
      setFormData({
        ...formData,
        [name]: parseInt(value) || 0,
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
      await createFormularioCoche(formData)
      setSuccess(true)
      // Reset form
      setFormData({
        placa_coche: 0,
        dni_trabajador: 0,
        id_trabajo: 0,
        otros: '',
        fecha: '',
        hora_partida: '',
        estado_coche: '',
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
        Formulario de Coche
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
                label="Hora de Partida"
                name="hora_partida"
                value={formData.hora_partida}
                onChange={handleChange}
                placeholder="HH:MM"
                helperText="Ingrese la hora de partida (ej: 17:05)"
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                select
                fullWidth
                label="Estado del Coche"
                name="estado_coche"
                value={formData.estado_coche}
                onChange={handleChange}
                helperText="Seleccione el estado del coche"
              >
                <MenuItem value="">Seleccione un estado</MenuItem>
                <MenuItem value="Limpio">Limpio</MenuItem>
                <MenuItem value="Muy Limpio">Muy Limpio</MenuItem>
                <MenuItem value="Sucio">Sucio</MenuItem>
                <MenuItem value="Muy Sucio">Muy Sucio</MenuItem>
              </TextField>
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
                helperText="Ingrese cualquier detalle adicional sobre el coche"
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

export default FormularioCoche 