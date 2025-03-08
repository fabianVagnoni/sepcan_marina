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
import { getAllCoches, createCoche, updateCoche, getCoche } from '../../services/api'

interface CocheData {
  placa: number
  marca: string
  modelo: string
  fecha_fabricacion: string
  fecha_compra: string
  password: string
}

const DatosPrivadosCoches = () => {
  const [coches, setCoches] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [dataLoading, setDataLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [formData, setFormData] = useState<CocheData>({
    placa: 0,
    marca: '',
    modelo: '',
    fecha_fabricacion: '',
    fecha_compra: '',
    password: '',
  })
  const [dialogOpen, setDialogOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false)
  const [selectedCoche, setSelectedCoche] = useState<number | null>(null)
  const [passwordError, setPasswordError] = useState<string | null>(null)

  const CORRECT_PASSWORD = "MiViejoSanJuan2024"

  // Load coches on component mount
  useEffect(() => {
    fetchCoches()
  }, [])

  const fetchCoches = async () => {
    setDataLoading(true)
    try {
      const data = await getAllCoches()
      setCoches(data)
    } catch (err) {
      console.error('Error fetching coches:', err)
      setError('Error al cargar los coches. Por favor, inténtelo de nuevo más tarde.')
    } finally {
      setDataLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    
    if (name === 'placa') {
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

  const handleOpenDialog = (isEdit: boolean = false, placa?: number) => {
    if (isEdit && placa) {
      setPasswordDialogOpen(true)
      setSelectedCoche(placa)
      setIsEditing(true)
    } else {
      // New coche
      setFormData({
        placa: 0,
        marca: '',
        modelo: '',
        fecha_fabricacion: '',
        fecha_compra: '',
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
      
      if (selectedCoche) {
        try {
          const cocheData = await getCoche(selectedCoche)
          setFormData({
            ...cocheData,
            password: '',
          })
          setDialogOpen(true)
        } catch (err) {
          console.error('Error fetching coche details:', err)
          setError('Error al obtener los detalles del coche.')
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
    setSelectedCoche(null)
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
        await updateCoche(formData.placa, {
          marca: formData.marca,
          modelo: formData.modelo,
          fecha_fabricacion: formData.fecha_fabricacion,
          fecha_compra: formData.fecha_compra,
          password: formData.password,
        })
        setSuccess('Coche actualizado exitosamente')
      } else {
        await createCoche(formData)
        setSuccess('Coche creado exitosamente')
      }
      
      setDialogOpen(false)
      fetchCoches()
    } catch (err: any) {
      console.error('Error saving coche:', err)
      setError(err.response?.data?.detail || 'Error al guardar el coche. Por favor, inténtelo de nuevo.')
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
          Gestión de Coches
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Nuevo Coche
        </Button>
      </Box>
      
      <Paper elevation={3} sx={{ p: 3 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Placa</TableCell>
                <TableCell>Marca</TableCell>
                <TableCell>Modelo</TableCell>
                <TableCell>Fecha de Fabricación</TableCell>
                <TableCell>Fecha de Compra</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {coches.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    No hay coches registrados
                  </TableCell>
                </TableRow>
              ) : (
                coches.map((coche) => (
                  <TableRow key={coche.placa}>
                    <TableCell>{coche.placa}</TableCell>
                    <TableCell>{coche.marca}</TableCell>
                    <TableCell>{coche.modelo}</TableCell>
                    <TableCell>{coche.fecha_fabricacion}</TableCell>
                    <TableCell>{coche.fecha_compra}</TableCell>
                    <TableCell>
                      <IconButton
                        color="primary"
                        onClick={() => handleOpenDialog(true, coche.placa)}
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
        <DialogTitle>{isEditing ? 'Editar Coche' : 'Nuevo Coche'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Placa"
                name="placa"
                type="number"
                value={formData.placa}
                onChange={handleChange}
                required
                disabled={isEditing}
                helperText="Número de placa del coche"
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Marca"
                name="marca"
                value={formData.marca}
                onChange={handleChange}
                required
                helperText="Marca del coche"
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Modelo"
                name="modelo"
                value={formData.modelo}
                onChange={handleChange}
                required
                helperText="Modelo del coche"
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Fecha de Fabricación"
                name="fecha_fabricacion"
                value={formData.fecha_fabricacion}
                onChange={handleChange}
                required
                helperText="Formato: DD/MM/AAAA"
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Fecha de Compra"
                name="fecha_compra"
                value={formData.fecha_compra}
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
                helperText={isEditing ? "Contraseña para confirmar la edición" : "Contraseña para el coche"}
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
            Por favor, ingrese la contraseña para editar este coche.
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

export default DatosPrivadosCoches 