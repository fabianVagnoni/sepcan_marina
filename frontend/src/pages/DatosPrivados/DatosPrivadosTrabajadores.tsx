import { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Snackbar,
  Alert,
  IconButton,
} from '@mui/material'
import { Add as AddIcon, Edit as EditIcon } from '@mui/icons-material'
import { getAllTrabajadores, createTrabajador, updateTrabajador, getTrabajador } from '../../services/api'

interface TrabajadorData {
  dni: number
  nombre: string
  apellido: string
  fecha_nacimiento: string
  fecha_empleo: string
  password: string
}

const DatosPrivadosTrabajadores = () => {
  const [trabajadores, setTrabajadores] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [dataLoading, setDataLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [formData, setFormData] = useState<TrabajadorData>({
    dni: 0,
    nombre: '',
    apellido: '',
    fecha_nacimiento: '',
    fecha_empleo: '',
    password: '',
  })
  const [dialogOpen, setDialogOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false)
  const [selectedTrabajador, setSelectedTrabajador] = useState<number | null>(null)
  const [passwordError, setPasswordError] = useState<string | null>(null)

  const CORRECT_PASSWORD = "MiViejoSanJuan2024"

  // Load trabajadores on component mount
  useEffect(() => {
    fetchTrabajadores()
  }, [])

  const fetchTrabajadores = async () => {
    setDataLoading(true)
    try {
      const data = await getAllTrabajadores()
      setTrabajadores(data)
    } catch (err) {
      console.error('Error fetching trabajadores:', err)
      setError('Error al cargar los trabajadores. Por favor, inténtelo de nuevo más tarde.')
    } finally {
      setDataLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    
    if (name === 'dni') {
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

  const handleOpenDialog = (isEdit: boolean = false, dni?: number) => {
    if (isEdit && dni) {
      setPasswordDialogOpen(true)
      setSelectedTrabajador(dni)
      setIsEditing(true)
    } else {
      // New trabajador
      setFormData({
        dni: 0,
        nombre: '',
        apellido: '',
        fecha_nacimiento: '',
        fecha_empleo: '',
        password: '',
      })
      setDialogOpen(true)
      setIsEditing(false)
    }
  }

  const handlePasswordSubmit = async () => {
    if (formData.password === CORRECT_PASSWORD) {
      setPasswordDialogOpen(false)
      setPasswordError(null)
      
      if (selectedTrabajador) {
        try {
          const trabajadorData = await getTrabajador(selectedTrabajador)
          setFormData({
            ...trabajadorData,
            password: '',
          })
          setDialogOpen(true)
        } catch (err) {
          console.error('Error fetching trabajador details:', err)
          setError('Error al obtener los detalles del trabajador.')
        }
      }
    } else {
      setPasswordError('Contraseña incorrecta')
    }
  }

  const handleCloseDialog = () => {
    setDialogOpen(false)
  }

  const handleClosePasswordDialog = () => {
    setPasswordDialogOpen(false)
    setPasswordError(null)
    setSelectedTrabajador(null)
  }

  const handleSubmit = async () => {
    setLoading(true)
    setError(null)
    
    try {
      // Verify password for both create and update operations
      if (formData.password !== CORRECT_PASSWORD) {
        setError('Contraseña incorrecta. No se puede guardar los cambios.');
        setLoading(false);
        return;
      }
      
      if (isEditing) {
        await updateTrabajador(formData.dni, {
          nombre: formData.nombre,
          apellido: formData.apellido,
          fecha_nacimiento: formData.fecha_nacimiento,
          fecha_empleo: formData.fecha_empleo,
          password: formData.password,
        })
        setSuccess('Trabajador actualizado exitosamente')
      } else {
        await createTrabajador(formData)
        setSuccess('Trabajador creado exitosamente')
      }
      
      setDialogOpen(false)
      fetchTrabajadores()
    } catch (err: any) {
      console.error('Error saving trabajador:', err)
      setError(err.response?.data?.detail || 'Error al guardar el trabajador. Por favor, inténtelo de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  const handleCloseSnackbar = () => {
    setError(null)
    setSuccess(null)
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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          Gestión de Trabajadores
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Nuevo Trabajador
        </Button>
      </Box>
      
      <Paper elevation={3} sx={{ p: 3 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>DNI</TableCell>
                <TableCell>Nombre</TableCell>
                <TableCell>Apellido</TableCell>
                <TableCell>Fecha de Nacimiento</TableCell>
                <TableCell>Fecha de Empleo</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {trabajadores.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    No hay trabajadores registrados
                  </TableCell>
                </TableRow>
              ) : (
                trabajadores.map((trabajador) => (
                  <TableRow key={trabajador.dni}>
                    <TableCell>{trabajador.dni}</TableCell>
                    <TableCell>{trabajador.nombre}</TableCell>
                    <TableCell>{trabajador.apellido}</TableCell>
                    <TableCell>{trabajador.fecha_nacimiento}</TableCell>
                    <TableCell>{trabajador.fecha_empleo}</TableCell>
                    <TableCell>
                      <IconButton
                        color="primary"
                        onClick={() => handleOpenDialog(true, trabajador.dni)}
                      >
                        <EditIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      
      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>{isEditing ? 'Editar Trabajador' : 'Nuevo Trabajador'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="DNI"
                name="dni"
                type="number"
                value={formData.dni}
                onChange={handleChange}
                required
                disabled={isEditing}
                helperText="Número de DNI del trabajador"
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                required
                helperText="Nombre del trabajador"
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Apellido"
                name="apellido"
                value={formData.apellido}
                onChange={handleChange}
                required
                helperText="Apellido del trabajador"
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Fecha de Nacimiento"
                name="fecha_nacimiento"
                value={formData.fecha_nacimiento}
                onChange={handleChange}
                required
                helperText="Formato: DD/MM/AAAA"
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Fecha de Empleo"
                name="fecha_empleo"
                value={formData.fecha_empleo}
                onChange={handleChange}
                required
                helperText="Formato: DD/MM/AAAA"
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Contraseña"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
                helperText={isEditing ? "Contraseña para confirmar la edición" : "Contraseña para el trabajador"}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            color="primary"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : isEditing ? 'Actualizar' : 'Crear'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Password Dialog */}
      <Dialog open={passwordDialogOpen} onClose={handleClosePasswordDialog}>
        <DialogTitle>Verificación de Acceso</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Por favor, ingrese la contraseña para editar este trabajador.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            name="password"
            label="Contraseña"
            type="password"
            fullWidth
            variant="outlined"
            value={formData.password}
            onChange={handleChange}
            error={!!passwordError}
            helperText={passwordError}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePasswordDialog}>Cancelar</Button>
          <Button onClick={handlePasswordSubmit} variant="contained" color="primary">
            Continuar
          </Button>
        </DialogActions>
      </Dialog>
      
      <Snackbar open={!!error} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
      
      <Snackbar open={!!success} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          {success}
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default DatosPrivadosTrabajadores 