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
      toast.success('Job form submitted successfully!')
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
        Job Form
      </Typography>
      
      <Typography variant="body1" paragraph>
        Please fill out this form after completing the job. This form collects information about the job details.
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
            
            <Grid item xs={12} md={6}>
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
            
            {/* Time and Materials */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Time and Materials
              </Typography>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Controller
                name="time_to_commute"
                control={control}
                rules={{ 
                  required: 'Commute time is required',
                  min: { value: 0, message: 'Commute time must be positive' }
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Time to Commute (hours)"
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
                  required: 'Work time is required',
                  min: { value: 0, message: 'Work time must be positive' }
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Time of Work (hours)"
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
                  required: 'Number of nails is required',
                  min: { value: 0, message: 'Number of nails must be positive' }
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Nails Used"
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

export default JobForm 