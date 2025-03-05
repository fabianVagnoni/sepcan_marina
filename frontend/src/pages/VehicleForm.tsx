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

const conditionOptions = ['perfect', 'good', 'bad', 'critical']

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
      vehicle_condition: 'good',
      vehicle_clean: 'good',
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
      toast.success('Vehicle form submitted successfully!')
      reset()
      navigate('/')
    } catch (error: any) {
      toast.error(`Error: ${error.response?.data?.detail || 'Failed to submit form'}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="form-container">
      <Typography variant="h4" component="h1" className="page-title">
        Vehicle Form
      </Typography>
      
      <Typography variant="body1" paragraph>
        Please fill out this form before meeting the client. This form collects information about the vehicle you are using.
      </Typography>
      
      <Paper elevation={3} sx={{ p: 3 }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3}>
            {/* Employee Information */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Employee Information
              </Typography>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Controller
                name="employee_id"
                control={control}
                rules={{ required: 'Employee ID is required' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Employee ID"
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
                rules={{ required: 'Employee name is required' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Employee Name"
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
                Job Information
              </Typography>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Controller
                name="job_id"
                control={control}
                rules={{ required: 'Job ID is required' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Job ID"
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
                rules={{ required: 'Job place is required' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Job Place"
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
                Vehicle Information
              </Typography>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Controller
                name="vehicle_id"
                control={control}
                rules={{ required: 'Vehicle ID is required' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Vehicle ID"
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
                rules={{ required: 'Vehicle condition is required' }}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.vehicle_condition}>
                    <InputLabel>Vehicle Condition</InputLabel>
                    <Select {...field} label="Vehicle Condition">
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
                rules={{ required: 'Vehicle cleanliness is required' }}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.vehicle_clean}>
                    <InputLabel>Vehicle Cleanliness</InputLabel>
                    <Select {...field} label="Vehicle Cleanliness">
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
                    label="Comments"
                    multiline
                    rows={4}
                    fullWidth
                    placeholder="Any additional comments about the vehicle..."
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
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={isSubmitting}
                  startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit'}
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