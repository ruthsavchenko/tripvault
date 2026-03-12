import { useState } from 'react';
import { Box, Typography, Button, Grid, Skeleton, Alert } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useTripsControllerFindAll } from '../api';
import type { Trip } from '../types/trip';
import TripCard from '../components/trips/TripCard';
import CreateTripDialog from '../components/trips/CreateTripDialog';

export default function TripsPage() {
  const [dialogOpen, setDialogOpen] = useState(false);

  const { data, isLoading, isError } = useTripsControllerFindAll();
  const trips = (data as unknown as Trip[]) ?? [];

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Typography variant="h2" sx={{ flexGrow: 1 }}>
          My trips
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setDialogOpen(true)}>
          New trip
        </Button>
      </Box>

      {isError && (
        <Alert severity="error" sx={{ mb: 3 }}>
          Failed to load trips
        </Alert>
      )}

      {isLoading ? (
        <Grid container spacing={2}>
          {[1, 2, 3].map((i) => (
            <Grid key={i} size={{ xs: 12, sm: 6, md: 4 }}>
              <Skeleton variant="rounded" height={120} />
            </Grid>
          ))}
        </Grid>
      ) : trips.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 12, color: 'text.secondary' }}>
          <Typography variant="h3" mb={1}>
            No trips yet
          </Typography>
          <Typography variant="body1">Create your first trip to get started</Typography>
        </Box>
      ) : (
        <Grid container spacing={2}>
          {trips.map((trip) => (
            <Grid key={trip.id} size={{ xs: 12, sm: 6, md: 4 }}>
              <TripCard trip={trip} />
            </Grid>
          ))}
        </Grid>
      )}

      <CreateTripDialog open={dialogOpen} onClose={() => setDialogOpen(false)} />
    </Box>
  );
}
