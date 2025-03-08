import { useState } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Button,
  MenuItem,
  Popover,
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import BuildIcon from '@mui/icons-material/Build'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'

// Main navigation items
const mainPages = [
  { name: 'Inicio', path: '/' },
]

// Forms submenu items
const formPages = [
  { name: 'Formulario de Coche', path: '/formulario-coche' },
  { name: 'Formulario de Trabajo', path: '/formulario-trabajo' },
]

// Private data submenu items
const privateDataPages = [
  { name: 'Coches', path: '/datos-privados/coches' },
  { name: 'Trabajadores', path: '/datos-privados/trabajadores' },
  { name: 'Trabajos', path: '/datos-privados/trabajos' },
]

const Navbar = () => {
  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null)
  const [formsAnchorEl, setFormsAnchorEl] = useState<null | HTMLElement>(null)
  const [privateDataAnchorEl, setPrivateDataAnchorEl] = useState<null | HTMLElement>(null)

  // Mobile menu handlers
  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget)
  }

  const handleCloseNavMenu = () => {
    setAnchorElNav(null)
  }

  // Forms dropdown handlers
  const handleFormsClick = (event: React.MouseEvent<HTMLElement>) => {
    setFormsAnchorEl(event.currentTarget)
  }

  const handleFormsClose = () => {
    setFormsAnchorEl(null)
  }

  // Private data dropdown handlers
  const handlePrivateDataClick = (event: React.MouseEvent<HTMLElement>) => {
    setPrivateDataAnchorEl(event.currentTarget)
  }

  const handlePrivateDataClose = () => {
    setPrivateDataAnchorEl(null)
  }

  const formsOpen = Boolean(formsAnchorEl)
  const privateDataOpen = Boolean(privateDataAnchorEl)

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* Logo for desktop */}
          <BuildIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
          <Typography
            variant="h6"
            noWrap
            component={RouterLink}
            to="/"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            SEPCAN MARINA
          </Typography>

          {/* Mobile menu */}
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="menu"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              {/* Main pages */}
              {mainPages.map((page) => (
                <MenuItem 
                  key={page.name} 
                  onClick={handleCloseNavMenu}
                  component={RouterLink}
                  to={page.path}
                >
                  <Typography textAlign="center">{page.name}</Typography>
                </MenuItem>
              ))}
              
              {/* Forms submenu */}
              <MenuItem onClick={handleCloseNavMenu}>
                <Typography textAlign="center" component={RouterLink} to="/formularios">Formularios</Typography>
              </MenuItem>
              
              {/* Forms items */}
              {formPages.map((page) => (
                <MenuItem 
                  key={page.name} 
                  onClick={handleCloseNavMenu}
                  component={RouterLink}
                  to={page.path}
                  sx={{ pl: 4 }}
                >
                  <Typography textAlign="center">{page.name}</Typography>
                </MenuItem>
              ))}
              
              {/* Private data submenu */}
              <MenuItem onClick={handleCloseNavMenu}>
                <Typography textAlign="center" component={RouterLink} to="/datos-privados">Datos Privados</Typography>
              </MenuItem>
              
              {/* Private data items */}
              {privateDataPages.map((page) => (
                <MenuItem 
                  key={page.name} 
                  onClick={handleCloseNavMenu}
                  component={RouterLink}
                  to={page.path}
                  sx={{ pl: 4 }}
                >
                  <Typography textAlign="center">{page.name}</Typography>
                </MenuItem>
              ))}
              
              {/* Query data */}
              <MenuItem 
                onClick={handleCloseNavMenu}
                component={RouterLink}
                to="/consultar"
              >
                <Typography textAlign="center">Consultar Datos</Typography>
              </MenuItem>
            </Menu>
          </Box>

          {/* Logo for mobile */}
          <BuildIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
          <Typography
            variant="h5"
            noWrap
            component={RouterLink}
            to="/"
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            SEPCAN MARINA
          </Typography>

          {/* Desktop menu */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {/* Main pages */}
            {mainPages.map((page) => (
              <Button
                key={page.name}
                component={RouterLink}
                to={page.path}
                onClick={handleCloseNavMenu}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                {page.name}
              </Button>
            ))}
            
            {/* Forms dropdown */}
            <Button
              onClick={handleFormsClick}
              sx={{ my: 2, color: 'white', display: 'flex', alignItems: 'center' }}
              endIcon={<KeyboardArrowDownIcon />}
            >
              Formularios
            </Button>
            <Popover
              open={formsOpen}
              anchorEl={formsAnchorEl}
              onClose={handleFormsClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
            >
              <Box sx={{ py: 1 }}>
                {formPages.map((page) => (
                  <MenuItem
                    key={page.name}
                    component={RouterLink}
                    to={page.path}
                    onClick={handleFormsClose}
                  >
                    {page.name}
                  </MenuItem>
                ))}
              </Box>
            </Popover>
            
            {/* Private data dropdown */}
            <Button
              onClick={handlePrivateDataClick}
              sx={{ my: 2, color: 'white', display: 'flex', alignItems: 'center' }}
              endIcon={<KeyboardArrowDownIcon />}
            >
              Datos Privados
            </Button>
            <Popover
              open={privateDataOpen}
              anchorEl={privateDataAnchorEl}
              onClose={handlePrivateDataClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
            >
              <Box sx={{ py: 1 }}>
                {privateDataPages.map((page) => (
                  <MenuItem
                    key={page.name}
                    component={RouterLink}
                    to={page.path}
                    onClick={handlePrivateDataClose}
                  >
                    {page.name}
                  </MenuItem>
                ))}
              </Box>
            </Popover>
            
            {/* Query data */}
            <Button
              component={RouterLink}
              to="/consultar"
              onClick={handleCloseNavMenu}
              sx={{ my: 2, color: 'white', display: 'block' }}
            >
              Consultar Datos
            </Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  )
}

export default Navbar 