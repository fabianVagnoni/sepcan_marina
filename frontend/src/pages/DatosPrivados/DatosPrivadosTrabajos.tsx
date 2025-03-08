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
import { getAllTrabajos, createTrabajo, updateTrabajo, getTrabajo } from '../../services/api'

interface TrabajoData {
  id: number
  cliente: string
  fecha: string
  password: string
}

const DatosPrivadosTrabajos = () => {
  const [trabajos, setTrabajos] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [dataLoading, setDataLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [formData, setFormData] = useState<TrabajoData>({
    id: 0,
    cliente: '',
    fecha: '',
    password: '',
  })
  const [dialogOpen, setDialogOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false)
  const [selectedTrabajo, setSelectedTrabajo] = useState<number | null>(null)
  const [passwordError, setPasswordError] = useState<string | null>(null)

  const CORRECT_PASSWORD = "MiViejoSanJuan2024"

  // Load trabajos on component mount
  useEffect(() => {
    fetchTrabajos()
  }, [])

  const fetchTrabajos = async () => {
    setDataLoading(true)
    try {
      const data = await getAllTrabajos()
      setTrabajos(data)
    } catch (err) {
      console.error('Error fetching trabajos:', err)
      setError('Error al cargar los trabajos. Por favor, inténtelo de nuevo más tarde.')
    } finally {
      setDataLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    
    if (name === 'id') {
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

  const handleOpenDialog = (isEdit: boolean = false, id?: number) => {
    if (isEdit && id) {
      setPasswordDialogOpen(true)
      setSelectedTrabajo(id)
      setIsEditing(true)
    } else {
      // New trabajo
      setFormData({
        id: 0,
        cliente: '',
        fecha: '',
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
      
      if (selectedTrabajo) {
        try {
          const trabajoData = await getTrabajo(selectedTrabajo)
          setFormData({
            ...trabajoData,
            password: '',
          })
          setDialogOpen(true)
        } catch (err) {
          console.error('Error fetching trabajo details:', err)
          setError('Error al obtener los detalles del trabajo.')
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
    setSelectedTrabajo(null)
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
        await updateTrabajo(formData.id, {
          cliente: formData.cliente,
          fecha: formData.fecha,
          password: formData.password,
        })
        setSuccess('Trabajo actualizado exitosamente')
      } else {
        await createTrabajo(formData)
        setSuccess('Trabajo creado exitosamente')
      }
      
      setDialogOpen(false)
      fetchTrabajos()
    } catch (err: any) {
      console.error('Error saving trabajo:', err)
      setError(err.response?.data?.detail || 'Error al guardar el trabajo. Por favor, inténtelo de nuevo.')
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
          Gestión de Trabajos
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Nuevo Trabajo
        </Button>
      </Box>
      
      <Paper elevation={3} sx={{ p: 3 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Cliente</TableCell>
                <TableCell>Fecha</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {trabajos.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    No hay trabajos registrados
                  </TableCell>
                </TableRow>
              ) : (
                trabajos.map((trabajo) => (
                  <TableRow key={trabajo.id}>
                    <TableCell>{trabajo.id}</TableCell>
                    <TableCell>{trabajo.cliente}</TableCell>
                    <TableCell>{trabajo.fecha}</TableCell>
                    <TableCell>
                      <IconButton
                        color="primary"
                        onClick={() => handleOpenDialog(true, trabajo.id)}
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
        <DialogTitle>{isEditing ? 'Editar Trabajo' : 'Nuevo Trabajo'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="ID"
                name="id"
                type="number"
                value={formData.id}
                onChange={handleChange}
                required
                disabled={isEditing}
                helperText="ID del trabajo"
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Cliente"
                name="cliente"
                value={formData.cliente}
                onChange={handleChange}
                required
                helperText="Nombre del cliente"
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Fecha"
                name="fecha"
                value={formData.fecha}
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
                helperText={isEditing ? "Contraseña para confirmar la edición" : "Contraseña para el trabajo"}
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
            Por favor, ingrese la contraseña para editar este trabajo.
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

export default DatosPrivadosTrabajos 