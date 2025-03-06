import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
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
  FormHelperText,
  Box,
  CircularProgress,
} from '@mui/material'
import { toast } from 'react-toastify'

import { submitVehicleForm, VehicleFormData } from '../services/api'

const conditionOptions = ['perfecto', 'bueno', 'malo', 'crítico']

const VehicleForm = () => {
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<VehicleFormData>({
    defaultValues: {
      employee_id: undefined,
      employee_name: '',
      job_id: undefined,
      job_place: '',
      vehicle_id: undefined,
      vehicle_condition: 'bueno',
      vehicle_clean: 'bueno',
      comments: '',
      timestamp: new Date().toISOString(),
    },
  })

  const onSubmit = async (data: VehicleFormData) => {
    try {
      setIsSubmitting(true)
      // Update timestamp to current time
      data.timestamp = new Date().toISOString()
      
      await submitVehicleForm(data)
      toast.success('¡Formulario de vehículo enviado con éxito!')
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
        Formulario de Vehículo
      </Typography>
      
      <Typography variant="body1" paragraph>
        Por favor, complete este formulario antes de reunirse con el cliente. Este formulario recopila información sobre el vehículo que está utilizando.
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
            
            <Grid item xs={12} md={4}>
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
            
            <Grid item xs={12} md={4}>
              <Controller
                name="vehicle_condition"
                control={control}
                rules={{ required: 'La condición del vehículo es obligatoria' }}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.vehicle_condition}>
                    <InputLabel>Condición del Vehículo</InputLabel>
                    <Select {...field} label="Condición del Vehículo">
                      {conditionOptions.map((option) => (
                        <MenuItem key={option} value={option}>
                          {option.charAt(0).toUpperCase() + option.slice(1)}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.vehicle_condition && (
                      <FormHelperText>{errors.vehicle_condition.message}</FormHelperText>
                    )}
                  </FormControl>
                )}
              />
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Controller
                name="vehicle_clean"
                control={control}
                rules={{ required: 'La limpieza del vehículo es obligatoria' }}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.vehicle_clean}>
                    <InputLabel>Limpieza del Vehículo</InputLabel>
                    <Select {...field} label="Limpieza del Vehículo">
                      {conditionOptions.map((option) => (
                        <MenuItem key={option} value={option}>
                          {option.charAt(0).toUpperCase() + option.slice(1)}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.vehicle_clean && (
                      <FormHelperText>{errors.vehicle_clean.message}</FormHelperText>
                    )}
                  </FormControl>
                )}
              />
            </Grid>
            
            <Grid item xs={12}>
              <Controller
                name="comments"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Comentarios"
                    multiline
                    rows={4}
                    fullWidth
                    placeholder="Cualquier comentario adicional sobre el vehículo..."
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

export default VehicleForm 