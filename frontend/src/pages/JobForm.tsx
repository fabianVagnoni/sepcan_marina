import { useState } from 'react'
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
} from '@mui/material'
import { toast } from 'react-toastify'

import { submitJobForm, JobFormData } from '../services/api'

const JobForm = () => {
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<JobFormData>({
    defaultValues: {
      employee_id: undefined,
      employee_name: '',
      job_id: undefined,
      job_place: '',
      time_to_commute: 0,
      time_of_work: 0,
      vehicle_id: undefined,
      nails_used: 0,
    },
  })

  const onSubmit = async (data: JobFormData) => {
    try {
      setIsSubmitting(true)
      await submitJobForm(data)
      toast.success('¡Formulario de trabajo enviado con éxito!')
      reset()
      navigate('/')
    } catch (error: any) {
      toast.error(`Error: ${error.response?.data?.detail || 'Error al enviar el formulario'}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="form-container">
      <Typography variant="h4" component="h1" className="page-title">
        Formulario de Trabajo
      </Typography>
      
      <Typography variant="body1" paragraph>
        Por favor, complete este formulario después de terminar el trabajo. Este formulario recopila información sobre los detalles del trabajo.
      </Typography>
      
      <Paper elevation={3} sx={{ p: 3 }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3}>
            {/* Employee Information */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Información del Empleado
              </Typography>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Controller
                name="employee_id"
                control={control}
                rules={{ required: 'El ID del empleado es obligatorio' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="ID del Empleado"
                    type="number"
                    fullWidth
                    error={!!errors.employee_id}
                    helperText={errors.employee_id?.message}
                    InputLabelProps={{ shrink: true }}
                    value={field.value || ''}
                    onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : '')}
                  />
                )}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Controller
                name="employee_name"
                control={control}
                rules={{ required: 'El nombre del empleado es obligatorio' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Nombre del Empleado"
                    fullWidth
                    error={!!errors.employee_name}
                    helperText={errors.employee_name?.message}
                  />
                )}
              />
            </Grid>
            
            {/* Job Information */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Información del Trabajo
              </Typography>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Controller
                name="job_id"
                control={control}
                rules={{ required: 'El ID del trabajo es obligatorio' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="ID del Trabajo"
                    type="number"
                    fullWidth
                    error={!!errors.job_id}
                    helperText={errors.job_id?.message}
                    InputLabelProps={{ shrink: true }}
                    value={field.value || ''}
                    onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : '')}
                  />
                )}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Controller
                name="job_place"
                control={control}
                rules={{ required: 'El lugar del trabajo es obligatorio' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Lugar del Trabajo"
                    fullWidth
                    error={!!errors.job_place}
                    helperText={errors.job_place?.message}
                  />
                )}
              />
            </Grid>
            
            {/* Vehicle Information */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Información del Vehículo
              </Typography>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Controller
                name="vehicle_id"
                control={control}
                rules={{ required: 'El ID del vehículo es obligatorio' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="ID del Vehículo"
                    type="number"
                    fullWidth
                    error={!!errors.vehicle_id}
                    helperText={errors.vehicle_id?.message}
                    InputLabelProps={{ shrink: true }}
                    value={field.value || ''}
                    onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : '')}
                  />
                )}
              />
            </Grid>
            
            {/* Time and Materials */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Tiempo y Materiales
              </Typography>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Controller
                name="time_to_commute"
                control={control}
                rules={{ 
                  required: 'El tiempo de desplazamiento es obligatorio',
                  min: { value: 0, message: 'El tiempo de desplazamiento debe ser positivo' }
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Tiempo de Desplazamiento (horas)"
                    type="number"
                    fullWidth
                    error={!!errors.time_to_commute}
                    helperText={errors.time_to_commute?.message}
                    InputLabelProps={{ shrink: true }}
                    inputProps={{ step: 0.25 }}
                    value={field.value || ''}
                    onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : '')}
                  />
                )}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Controller
                name="time_of_work"
                control={control}
                rules={{ 
                  required: 'El tiempo de trabajo es obligatorio',
                  min: { value: 0, message: 'El tiempo de trabajo debe ser positivo' }
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Tiempo de Trabajo (horas)"
                    type="number"
                    fullWidth
                    error={!!errors.time_of_work}
                    helperText={errors.time_of_work?.message}
                    InputLabelProps={{ shrink: true }}
                    inputProps={{ step: 0.25 }}
                    value={field.value || ''}
                    onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : '')}
                  />
                )}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Controller
                name="nails_used"
                control={control}
                rules={{ 
                  required: 'El número de clavos es obligatorio',
                  min: { value: 0, message: 'El número de clavos debe ser positivo' }
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Clavos Utilizados"
                    type="number"
                    fullWidth
                    error={!!errors.nails_used}
                    helperText={errors.nails_used?.message}
                    InputLabelProps={{ shrink: true }}
                    value={field.value || ''}
                    onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : '')}
                  />
                )}
              />
            </Grid>
            
            <Grid item xs={12}>
              <Box className="form-actions">
                <Button
                  variant="outlined"
                  onClick={() => navigate('/')}
                  disabled={isSubmitting}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={isSubmitting}
                  startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
                >
                  {isSubmitting ? 'Enviando...' : 'Enviar'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </div>
  )
}

export default JobForm 