import { useState } from 'react';
import { AppBar, Toolbar, Button, Menu, MenuItem, Box } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

// Forms submenu items
const formPages = [
  { name: 'Formulario de Coche', path: '/formulario-coche' },
  { name: 'Formulario de Trabajo', path: '/formulario-trabajo' },
];

// Private data submenu items
const privateDataPages = [
  { name: 'Coches', path: '/datos-privados/coches' },
  { name: 'Trabajadores', path: '/datos-privados/trabajadores' },
  { name: 'Trabajos', path: '/datos-privados/trabajos' },
];

const Navbar = () => {
  const [formsAnchorEl, setFormsAnchorEl] = useState<null | HTMLElement>(null);
  const [privateDataAnchorEl, setPrivateDataAnchorEl] = useState<null | HTMLElement>(null);

  const handleFormsClick = (event: React.MouseEvent<HTMLElement>) => {
    setFormsAnchorEl(event.currentTarget);
  };

  const handleFormsClose = () => {
    setFormsAnchorEl(null);
  };

  const handlePrivateDataClick = (event: React.MouseEvent<HTMLElement>) => {
    setPrivateDataAnchorEl(event.currentTarget);
  };

  const handlePrivateDataClose = () => {
    setPrivateDataAnchorEl(null);
  };

  return (
    <AppBar position="static">
      <Toolbar sx={{ gap: 1 }}>
        <Button
          component={RouterLink}
          to="/"
          color="inherit"
        >
          INICIO
        </Button>

        <Box sx={{ position: 'relative' }}>
          <Button
            color="inherit"
            onClick={handleFormsClick}
            endIcon={<KeyboardArrowDownIcon />}
          >
            FORMULARIOS
          </Button>
          <Menu
            anchorEl={formsAnchorEl}
            open={Boolean(formsAnchorEl)}
            onClose={handleFormsClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}
          >
            {formPages.map((page) => (
              <MenuItem
                key={page.name}
                component={RouterLink}
                to={page.path}
                onClick={handleFormsClose}
                sx={{
                  color: 'var(--text-primary)',
                  fontFamily: 'Montserrat, sans-serif',
                  '&:hover': {
                    backgroundColor: 'rgba(0, 51, 102, 0.04)',
                  }
                }}
              >
                {page.name}
              </MenuItem>
            ))}
          </Menu>
        </Box>

        <Box sx={{ position: 'relative' }}>
          <Button
            color="inherit"
            onClick={handlePrivateDataClick}
            endIcon={<KeyboardArrowDownIcon />}
          >
            DATOS PRIVADOS
          </Button>
          <Menu
            anchorEl={privateDataAnchorEl}
            open={Boolean(privateDataAnchorEl)}
            onClose={handlePrivateDataClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}
          >
            {privateDataPages.map((page) => (
              <MenuItem
                key={page.name}
                component={RouterLink}
                to={page.path}
                onClick={handlePrivateDataClose}
                sx={{
                  color: 'var(--text-primary)',
                  fontFamily: 'Montserrat, sans-serif',
                  '&:hover': {
                    backgroundColor: 'rgba(0, 51, 102, 0.04)',
                  }
                }}
              >
                {page.name}
              </MenuItem>
            ))}
          </Menu>
        </Box>

        <Button
          component={RouterLink}
          to="/consultar"
          color="inherit"
        >
          CONSULTAR DATOS
        </Button>

        <Button
          component={RouterLink}
          to="/estadisticas"
          color="inherit"
        >
          ESTADÍSTICAS
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar; 