import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm, Controller } from 'react-hook-form'
import {
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  Box,
  CircularProgress,
  MenuItem,
} from '@mui/material'
import { toast } from 'react-toastify'

import { 
  createFormularioCoche, 
  FormularioCoche, 
  getAllCoches, 
  getAllTrabajadores, 
  getAllTrabajos 
} from '../services/api'

const VehicleForm = () => {
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [coches, setCoches] = useState<any[]>([])
  const [trabajadores, setTrabajadores] = useState<any[]>([])
  const [trabajos, setTrabajos] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  
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
      } catch (error) {
        console.error('Error fetching data:', error)
        toast.error('Error al cargar los datos')
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchData()
  }, [])
  
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormularioCoche>({
    defaultValues: {
      placa_coche: 0,
      dni_trabajador: 0,
      id_trabajo: 0,
      otros: '',
    },
  })

  const onSubmit = async (data: FormularioCoche) => {
    setIsSubmitting(true)
    try {
      await createFormularioCoche(data)
      toast.success('Formulario enviado con éxito')
      reset()
      navigate('/')
    } catch (error) {
      console.error('Error submitting form:', error)
      toast.error('Error al enviar el formulario')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Paper elevation={3} sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        Formulario de Coche
      </Typography>
      
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Controller
              name="placa_coche"
              control={control}
              rules={{ required: 'Este campo es obligatorio' }}
              render={({ field }) => (
                <TextField
                  {...field}
                  select
                  fullWidth
                  label="Coche (Placa)"
                  error={!!errors.placa_coche}
                  helperText={errors.placa_coche?.message}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                >
                  <MenuItem value={0} disabled>Seleccione un coche</MenuItem>
                  {coches.map((coche) => (
                    <MenuItem key={coche.placa} value={coche.placa}>
                      {coche.placa} - {coche.marca} {coche.modelo}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Controller
              name="dni_trabajador"
              control={control}
              rules={{ required: 'Este campo es obligatorio' }}
              render={({ field }) => (
                <TextField
                  {...field}
                  select
                  fullWidth
                  label="Trabajador (DNI)"
                  error={!!errors.dni_trabajador}
                  helperText={errors.dni_trabajador?.message}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                >
                  <MenuItem value={0} disabled>Seleccione un trabajador</MenuItem>
                  {trabajadores.map((trabajador) => (
                    <MenuItem key={trabajador.dni} value={trabajador.dni}>
                      {trabajador.dni} - {trabajador.nombre} {trabajador.apellido}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Controller
              name="id_trabajo"
              control={control}
              rules={{ required: 'Este campo es obligatorio' }}
              render={({ field }) => (
                <TextField
                  {...field}
                  select
                  fullWidth
                  label="Trabajo (ID)"
                  error={!!errors.id_trabajo}
                  helperText={errors.id_trabajo?.message}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                >
                  <MenuItem value={0} disabled>Seleccione un trabajo</MenuItem>
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
            <Controller
              name="otros"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Otros detalles"
                  multiline
                  rows={4}
                  helperText="Ingrese cualquier detalle adicional sobre el coche"
                />
              )}
            />
          </Grid>
          
          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={isSubmitting}
              sx={{ mt: 2 }}
            >
              {isSubmitting ? <CircularProgress size={24} /> : 'Enviar Formulario'}
            </Button>
          </Grid>
        </Grid>
      </form>
    </Paper>
  )
}

export default VehicleForm 