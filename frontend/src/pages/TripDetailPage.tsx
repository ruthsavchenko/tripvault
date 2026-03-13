import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Tabs, Tab, IconButton, Skeleton, Alert, Divider } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { useTripsControllerFindOne } from '../api';
import type { Trip } from '../types/trip';
import PlacesList from '../components/places/PlacesList';
import ExpensesList from '../components/expenses/ExpensesList';
import MembersList from '../components/members/MembersList';

function formatDate(dateStr?: string) {
  if (!dateStr) return null;
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export default function TripDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [tab, setTab] = useState(0);

  const { data, isLoading, isError } = useTripsControllerFindOne(id!);
  const trip = data as unknown as Trip | undefined;

  const start = formatDate(trip?.startDate);
  const end = formatDate(trip?.endDate);

  if (isError) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        Trip not found or access denied
      </Alert>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 1 }}>
        <IconButton onClick={() => navigate('/trips')} sx={{ mt: 0.25 }}>
          <ArrowBackIcon />
        </IconButton>
        <Box sx={{ flexGrow: 1 }}>
          {isLoading ? (
            <>
              <Skeleton width={220} height={36} />
              <Skeleton width={140} height={20} />
            </>
          ) : (
            <>
              <Typography variant="h2">{trip?.title}</Typography>
              {trip?.description && (
                <Typography variant="body2" color="text.secondary" mt={0.25}>
                  {trip.description}
                </Typography>
              )}
              {(start || end) && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mt: 0.5 }}>
                  <CalendarTodayIcon sx={{ fontSize: 13, color: 'text.secondary' }} />
                  <Typography variant="caption" color="text.secondary" sx={{ letterSpacing: 0 }}>
                    {start ?? '—'}
                    {end ? ` → ${end}` : ''}
                  </Typography>
                </Box>
              )}
            </>
          )}
        </Box>
      </Box>

      <Divider sx={{ mb: 0 }} />

      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 3 }}>
        <Tab label="Places" />
        <Tab label="Expenses" />
        <Tab label="Members" />
      </Tabs>

      {id && (
        <>
          {tab === 0 && <PlacesList tripId={id} />}
          {tab === 1 && <ExpensesList tripId={id} />}
          {tab === 2 && <MembersList tripId={id} />}
        </>
      )}
    </Box>
  );
}
