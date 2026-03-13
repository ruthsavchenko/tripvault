import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQueryClient } from '@tanstack/react-query';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Stack,
  Alert,
  Box,
} from '@mui/material';
import { usePlacesControllerCreate, getPlacesControllerFindAllQueryKey } from '../../api';

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  address: z.string().optional(),
  date: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

interface Props {
  tripId: string;
  open: boolean;
  onClose: () => void;
}

export default function AddPlaceDialog({ tripId, open, onClose }: Props) {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const { mutate, isPending, isError } = usePlacesControllerCreate({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getPlacesControllerFindAllQueryKey(tripId) });
        reset();
        onClose();
      },
    },
  });

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>Add place</DialogTitle>
      <Box component="form" onSubmit={handleSubmit((values) => mutate({ tripId, data: values }))}>
        <DialogContent>
          <Stack spacing={2.5}>
            {isError && <Alert severity="error">Failed to add place</Alert>}
            <TextField
              label="Name"
              fullWidth
              autoFocus
              {...register('name')}
              error={!!errors.name}
              helperText={errors.name?.message}
            />
            <TextField label="Address" fullWidth {...register('address')} />
            <TextField
              label="Description"
              fullWidth
              multiline
              rows={2}
              {...register('description')}
            />
            <TextField
              label="Date"
              type="date"
              fullWidth
              slotProps={{ inputLabel: { shrink: true } }}
              {...register('date')}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button variant="outlined" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" loading={isPending}>
            Add
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}
