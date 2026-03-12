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
import type { AxiosError } from 'axios';
import { useAuthControllerRegister } from '../api';

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.email('Invalid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

type FormData = z.infer<typeof schema>;

export default function RegisterPage() {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const { mutate, isPending } = useAuthControllerRegister({
    mutation: {
      onSuccess: () => {
        navigate('/login');
      },
      onError: (error: AxiosError<{ message: string | string[] }>) => {
        const message = error?.response?.data?.message;
        setServerError(
          Array.isArray(message) ? message.join(', ') : (message ?? 'Registration failed'),
        );
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
            Create account
          </Typography>
          <Typography variant="body1" color="text.secondary" mb={4}>
            Start planning your adventures
          </Typography>

          {serverError && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {serverError}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
            <Stack spacing={2.5}>
              <TextField
                label="Name"
                fullWidth
                {...register('name')}
                error={!!errors.name}
                helperText={errors.name?.message}
              />
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
                Register
              </Button>
            </Stack>
          </Box>

          <Typography variant="body2" textAlign="center" mt={3} color="text.secondary">
            Already have an account?{' '}
            <Link component={RouterLink} to="/login" fontWeight={600} underline="hover">
              Log in
            </Link>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
