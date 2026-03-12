import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardActionArea, Typography, Box } from '@mui/material';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import type { Trip } from '../../types/trip';

function formatDate(dateStr?: string) {
  if (!dateStr) return null;
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export default function TripCard({ trip }: { trip: Trip }) {
  const navigate = useNavigate();
  const start = formatDate(trip.startDate);
  const end = formatDate(trip.endDate);

  return (
    <Card>
      <CardActionArea onClick={() => navigate(`/trips/${trip.id}`)}>
        <CardContent>
          <Typography variant="h5" fontWeight={600} mb={0.5}>
            {trip.title}
          </Typography>
          {trip.description && (
            <Typography variant="body2" color="text.secondary" mb={1.5} noWrap>
              {trip.description}
            </Typography>
          )}
          {(start || end) && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
              <CalendarTodayIcon sx={{ fontSize: 13, color: 'text.secondary' }} />
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ textTransform: 'none', letterSpacing: 0 }}
              >
                {start ?? '—'}
                {end ? ` → ${end}` : ''}
              </Typography>
            </Box>
          )}
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
