import axios from 'axios'

// Create axios instance with base URL
const api = axios.create({
  baseURL: '/api',
})

// Types for entities
export interface Coche {
  placa: number
  marca: string
  modelo: string
  fecha_fabricacion: string
  fecha_compra: string
}

export interface CocheCreate extends Coche {
  password: string
}

export interface CocheUpdate {
  marca?: string
  modelo?: string
  fecha_fabricacion?: string
  fecha_compra?: string
  password: string
}

export interface Trabajador {
  dni: number
  nombre: string
  apellido: string
  fecha_nacimiento: string
  fecha_empleo: string
}

export interface TrabajadorCreate extends Trabajador {
  password: string
}

export interface TrabajadorUpdate {
  nombre?: string
  apellido?: string
  fecha_nacimiento?: string
  fecha_empleo?: string
  password: string
}

export interface Trabajo {
  id: number
  cliente: string
  fecha: string
}

export interface TrabajoCreate extends Trabajo {
  password: string
}

export interface TrabajoUpdate {
  cliente?: string
  fecha?: string
  password: string
}

export interface FormularioCoche {
  placa_coche: number
  dni_trabajador: number
  id_trabajo: number
  otros?: string
  fecha?: string
  hora_partida?: string
  estado_coche?: string
}

export interface FormularioTrabajo {
  placa_coche: number
  dni_trabajador: number
  id_trabajo: number
  otros?: string
  fecha?: string
  hora_final?: string
  horas_trabajadas?: number
  lugar_trabajo?: string
  tiempo_llegada?: number
}

export interface QueryParams {
  dni_trabajador?: number
  id_trabajo?: number
  placa_coche?: number
  fecha_inicio?: string
  fecha_fin?: string
  format?: 'json' | 'excel'
}

export interface CombinedDataResponse {
  formularios_coche: any[];
  formularios_trabajo: any[];
}

// API functions for Coche
export const createCoche = async (data: CocheCreate) => {
  try {
    const response = await api.post('/coche/', data)
    return response.data
  } catch (error) {
    console.error('Error creando coche:', error)
    throw error
  }
}

export const updateCoche = async (placa: number, data: CocheUpdate) => {
  try {
    const response = await api.put(`/coche/${placa}`, data)
    return response.data
  } catch (error) {
    console.error('Error actualizando coche:', error)
    throw error
  }
}

export const getCoche = async (placa: number) => {
  try {
    const response = await api.get(`/coche/${placa}`)
    return response.data
  } catch (error) {
    console.error('Error obteniendo coche:', error)
    throw error
  }
}

export const getAllCoches = async () => {
  try {
    const response = await api.get('/coches/')
    return response.data
  } catch (error) {
    console.error('Error obteniendo coches:', error)
    throw error
  }
}

// API functions for Trabajador
export const createTrabajador = async (data: TrabajadorCreate) => {
  try {
    const response = await api.post('/trabajador/', data)
    return response.data
  } catch (error) {
    console.error('Error creando trabajador:', error)
    throw error
  }
}

export const updateTrabajador = async (dni: number, data: TrabajadorUpdate) => {
  try {
    const response = await api.put(`/trabajador/${dni}`, data)
    return response.data
  } catch (error) {
    console.error('Error actualizando trabajador:', error)
    throw error
  }
}

export const getTrabajador = async (dni: number) => {
  try {
    const response = await api.get(`/trabajador/${dni}`)
    return response.data
  } catch (error) {
    console.error('Error obteniendo trabajador:', error)
    throw error
  }
}

export const getAllTrabajadores = async () => {
  try {
    const response = await api.get('/trabajadores/')
    return response.data
  } catch (error) {
    console.error('Error obteniendo trabajadores:', error)
    throw error
  }
}

// API functions for Trabajo
export const createTrabajo = async (data: TrabajoCreate) => {
  try {
    const response = await api.post('/trabajo/', data)
    return response.data
  } catch (error) {
    console.error('Error creando trabajo:', error)
    throw error
  }
}

export const updateTrabajo = async (id: number, data: TrabajoUpdate) => {
  try {
    const response = await api.put(`/trabajo/${id}`, data)
    return response.data
  } catch (error) {
    console.error('Error actualizando trabajo:', error)
    throw error
  }
}

export const getTrabajo = async (id: number) => {
  try {
    const response = await api.get(`/trabajo/${id}`)
    return response.data
  } catch (error) {
    console.error('Error obteniendo trabajo:', error)
    throw error
  }
}

export const getAllTrabajos = async () => {
  try {
    const response = await api.get('/trabajos/')
    return response.data
  } catch (error) {
    console.error('Error obteniendo trabajos:', error)
    throw error
  }
}

// API functions for FormularioCoche
export const createFormularioCoche = async (data: FormularioCoche) => {
  try {
    const response = await api.post('/formulario-coche/', data)
    return response.data
  } catch (error) {
    console.error('Error creando formulario de coche:', error)
    throw error
  }
}

export const getAllFormulariosCoche = async () => {
  try {
    const response = await api.get('/formularios-coche/')
    return response.data
  } catch (error) {
    console.error('Error obteniendo formularios de coche:', error)
    throw error
  }
}

// API functions for FormularioTrabajo
export const createFormularioTrabajo = async (data: FormularioTrabajo) => {
  try {
    const response = await api.post('/formulario-trabajo/', data)
    return response.data
  } catch (error) {
    console.error('Error creando formulario de trabajo:', error)
    throw error
  }
}

export const getAllFormulariosTrabajo = async () => {
  try {
    const response = await api.get('/formularios-trabajo/')
    return response.data
  } catch (error) {
    console.error('Error obteniendo formularios de trabajo:', error)
    throw error
  }
}

// Query combined data
export const queryCombinedData = async (params: QueryParams): Promise<CombinedDataResponse | null> => {
  try {
    if (params.format === 'excel') {
      // For Excel format, use a direct window.open to download the file
      const queryString = new URLSearchParams()
      if (params.dni_trabajador) queryString.append('dni_trabajador', params.dni_trabajador.toString())
      if (params.id_trabajo) queryString.append('id_trabajo', params.id_trabajo.toString())
      if (params.placa_coche) queryString.append('placa_coche', params.placa_coche.toString())
      if (params.fecha_inicio) queryString.append('fecha_inicio', params.fecha_inicio)
      if (params.fecha_fin) queryString.append('fecha_fin', params.fecha_fin)
      queryString.append('format', 'excel')
      
      window.open(`/api/query/combined-data?${queryString.toString()}`, '_blank')
      return null
    } else {
      const response = await api.get<CombinedDataResponse>('/query/combined-data', { params })
      console.log('API response data:', response.data);
      return response.data
    }
  } catch (error) {
    console.error('Error consultando datos combinados:', error)
    throw error
  }
} 