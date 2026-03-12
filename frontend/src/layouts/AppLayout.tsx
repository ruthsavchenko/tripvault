import { Outlet, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, IconButton, Box } from '@mui/material';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import LogoutIcon from '@mui/icons-material/Logout';
import { useAuth } from '../store/AuthContext';

export default function AppLayout() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="sticky">
        <Toolbar sx={{ gap: 1 }}>
          <FlightTakeoffIcon fontSize="small" sx={{ color: 'primary.main' }} />
          <Typography variant="h6" sx={{ flexGrow: 1, color: 'text.primary' }}>
            TripVault
          </Typography>
          <IconButton onClick={handleLogout} size="small" title="Log out">
            <LogoutIcon fontSize="small" />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Box component="main" sx={{ flexGrow: 1, p: { xs: 2, sm: 3 }, bgcolor: 'background.default' }}>
        <Outlet />
      </Box>
    </Box>
  );
}
