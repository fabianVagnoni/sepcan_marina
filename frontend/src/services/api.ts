import axios from 'axios'

// Create axios instance with base URL
const api = axios.create({
  baseURL: '/api',
})

// Types for form data
export interface VehicleFormData {
  employee_id: number
  employee_name: string
  job_id: number
  job_place: string
  vehicle_id: number
  vehicle_condition: string
  vehicle_clean: string
  comments?: string
  timestamp: string
}

export interface JobFormData {
  employee_id: number
  employee_name: string
  job_id: number
  job_place: string
  time_to_commute: number
  time_of_work: number
  vehicle_id: number
  nails_used: number
}

export interface QueryParams {
  employee_id?: number
  job_id?: number
  vehicle_id?: number
  format?: 'json' | 'excel'
}

// API functions
export const submitVehicleForm = async (data: VehicleFormData) => {
  try {
    const response = await api.post('/vehicle-formulary/', data)
    return response.data
  } catch (error) {
    console.error('Error submitting vehicle form:', error)
    throw error
  }
}

export const submitJobForm = async (data: JobFormData) => {
  try {
    const response = await api.post('/job-formulary/', data)
    return response.data
  } catch (error) {
    console.error('Error submitting job form:', error)
    throw error
  }
}

export const queryVehicleFormularies = async (params: QueryParams) => {
  try {
    if (params.format === 'excel') {
      // For Excel format, use a direct window.open to download the file
      const queryString = new URLSearchParams()
      if (params.employee_id) queryString.append('employee_id', params.employee_id.toString())
      if (params.job_id) queryString.append('job_id', params.job_id.toString())
      if (params.vehicle_id) queryString.append('vehicle_id', params.vehicle_id.toString())
      queryString.append('format', 'excel')
      
      window.open(`/api/query/vehicle-formularies?${queryString.toString()}`, '_blank')
      return null
    } else {
      const response = await api.get('/query/vehicle-formularies', { params })
      return response.data
    }
  } catch (error) {
    console.error('Error querying vehicle formularies:', error)
    throw error
  }
}

export const queryJobFormularies = async (params: QueryParams) => {
  try {
    if (params.format === 'excel') {
      // For Excel format, use a direct window.open to download the file
      const queryString = new URLSearchParams()
      if (params.employee_id) queryString.append('employee_id', params.employee_id.toString())
      if (params.job_id) queryString.append('job_id', params.job_id.toString())
      if (params.vehicle_id) queryString.append('vehicle_id', params.vehicle_id.toString())
      queryString.append('format', 'excel')
      
      window.open(`/api/query/job-formularies?${queryString.toString()}`, '_blank')
      return null
    } else {
      const response = await api.get('/query/job-formularies', { params })
      return response.data
    }
  } catch (error) {
    console.error('Error querying job formularies:', error)
    throw error
  }
}

export const queryCombinedData = async (params: QueryParams) => {
  try {
    if (params.format === 'excel') {
      // For Excel format, use a direct window.open to download the file
      const queryString = new URLSearchParams()
      if (params.employee_id) queryString.append('employee_id', params.employee_id.toString())
      if (params.job_id) queryString.append('job_id', params.job_id.toString())
      if (params.vehicle_id) queryString.append('vehicle_id', params.vehicle_id.toString())
      queryString.append('format', 'excel')
      
      window.open(`/api/query/combined-data?${queryString.toString()}`, '_blank')
      return null
    } else {
      const response = await api.get('/query/combined-data', { params })
      return response.data
    }
  } catch (error) {
    console.error('Error querying combined data:', error)
    throw error
  }
} 