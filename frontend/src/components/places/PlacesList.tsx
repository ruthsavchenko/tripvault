import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import {
  Box,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Skeleton,
  Stack,
  Alert,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import PlaceIcon from '@mui/icons-material/Place';
import {
  usePlacesControllerFindAll,
  usePlacesControllerRemove,
  getPlacesControllerFindAllQueryKey,
} from '../../api';
import type { Place } from '../../types/trip';
import AddPlaceDialog from './AddPlaceDialog';

function formatDate(dateStr?: string) {
  if (!dateStr) return null;
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export default function PlacesList({ tripId }: { tripId: string }) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = usePlacesControllerFindAll(tripId);
  const places = (data as unknown as Place[]) ?? [];

  const { mutate: remove } = usePlacesControllerRemove({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getPlacesControllerFindAllQueryKey(tripId) });
      },
    },
  });

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Places
        </Typography>
        <Button
          size="small"
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={() => setDialogOpen(true)}
        >
          Add place
        </Button>
      </Box>

      {isError && <Alert severity="error">Failed to load places</Alert>}

      {isLoading ? (
        <Stack spacing={1}>
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} variant="rounded" height={56} />
          ))}
        </Stack>
      ) : places.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 6, color: 'text.secondary' }}>
          <PlaceIcon sx={{ fontSize: 40, mb: 1, opacity: 0.4 }} />
          <Typography variant="body2">No places yet</Typography>
        </Box>
      ) : (
        <List disablePadding>
          {places.map((place, index) => (
            <ListItem
              key={place.id}
              disablePadding
              sx={{
                py: 1.25,
                px: 0,
                borderBottom: index < places.length - 1 ? '1px solid' : 'none',
                borderColor: 'divider',
              }}
              secondaryAction={
                <IconButton
                  edge="end"
                  size="small"
                  onClick={() => remove({ tripId, id: place.id })}
                >
                  <DeleteOutlineIcon fontSize="small" />
                </IconButton>
              }
            >
              <ListItemText
                primary={place.name}
                secondary={
                  [place.address, formatDate(place.date)].filter(Boolean).join(' · ') || undefined
                }
                slotProps={{ primary: { fontWeight: 500 } }}
              />
            </ListItem>
          ))}
        </List>
      )}

      <AddPlaceDialog tripId={tripId} open={dialogOpen} onClose={() => setDialogOpen(false)} />
    </Box>
  );
}
