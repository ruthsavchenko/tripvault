import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  Link,
  Stack,
} from '@mui/material';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import { useAuthControllerLogin } from '../api';
import { useAuth } from '../store/AuthContext';

interface AuthResponse {
  accessToken: string;
}

const schema = z.object({
  email: z.email('Invalid email'),
  password: z.string().min(1, 'Password is required'),
});

type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const { mutate, isPending } = useAuthControllerLogin({
    mutation: {
      onSuccess: (data) => {
        const token = (data as unknown as AuthResponse)?.accessToken;
        login(token);
        navigate('/trips', { replace: true });
      },
      onError: () => {
        setServerError('Invalid email or password');
      },
    },
  });

  const onSubmit = (values: FormData) => {
    setServerError(null);
    mutate({ data: values });
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* Left branding panel — hidden on mobile */}
      <Box
        sx={{
          flex: 1,
          display: { xs: 'none', md: 'flex' },
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          background: 'linear-gradient(135deg, #1a2e0a 0%, #2d4a12 50%, #4d7c0f 100%)',
          p: 6,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
          <FlightTakeoffIcon sx={{ fontSize: 44, color: '#fff' }} />
          <Typography variant="h3" fontWeight={800} color="#fff" letterSpacing={-1}>
            TripVault
          </Typography>
        </Box>
        <Typography
          variant="h6"
          color="rgba(255,255,255,0.65)"
          textAlign="center"
          maxWidth={320}
          lineHeight={1.7}
        >
          Plan your trips. Track expenses. Share moments with friends.
        </Typography>
        <Box sx={{ display: 'flex', gap: 1.5, mt: 5 }}>
          {[0, 1, 2, 3, 4].map((i) => (
            <Box
              key={i}
              sx={{
                width: i === 0 ? 24 : 8,
                height: 8,
                borderRadius: 4,
                bgcolor: i === 0 ? '#fff' : 'rgba(255,255,255,0.25)',
                transition: 'width 0.3s',
              }}
            />
          ))}
        </Box>
      </Box>

      {/* Right form panel */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          px: { xs: 3, sm: 6, md: 10 },
          py: 6,
          bgcolor: 'background.paper',
        }}
      >
        <Box sx={{ width: '100%', maxWidth: 400 }}>
          {/* Mobile-only logo */}
          <Box sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center', gap: 1, mb: 5 }}>
            <FlightTakeoffIcon color="primary" />
            <Typography variant="h6" fontWeight={700}>
              TripVault
            </Typography>
          </Box>

          <Typography variant="h4" fontWeight={700} mb={1}>
            Welcome back
          </Typography>
          <Typography variant="body1" color="text.secondary" mb={4}>
            Sign in to your account
          </Typography>

          {serverError && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {serverError}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
            <Stack spacing={2.5}>
              <TextField
                label="Email"
                type="email"
                fullWidth
                {...register('email')}
                error={!!errors.email}
                helperText={errors.email?.message}
              />
              <TextField
                label="Password"
                type="password"
                fullWidth
                {...register('password')}
                error={!!errors.password}
                helperText={errors.password?.message}
              />
              <Button
                type="submit"
                variant="contained"
                fullWidth
                size="large"
                loading={isPending}
                sx={{ py: 1.5, mt: 0.5 }}
              >
                Log in
              </Button>
            </Stack>
          </Box>

          <Typography variant="body2" textAlign="center" mt={3} color="text.secondary">
            No account?{' '}
            <Link component={RouterLink} to="/register" fontWeight={600} underline="hover">
              Register
            </Link>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
