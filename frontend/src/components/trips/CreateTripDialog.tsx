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
import { useTripsControllerCreate, getTripsControllerFindAllQueryKey } from '../../api';

const schema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function CreateTripDialog({ open, onClose }: Props) {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const { mutate, isPending, isError } = useTripsControllerCreate({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getTripsControllerFindAllQueryKey() });
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
      <DialogTitle>New trip</DialogTitle>
      <Box component="form" onSubmit={handleSubmit((values) => mutate({ data: values }))}>
        <DialogContent>
          <Stack spacing={2.5}>
            {isError && <Alert severity="error">Failed to create trip</Alert>}
            <TextField
              label="Title"
              fullWidth
              autoFocus
              {...register('title')}
              error={!!errors.title}
              helperText={errors.title?.message}
            />
            <TextField
              label="Description"
              fullWidth
              multiline
              rows={3}
              {...register('description')}
            />
            <Stack direction="row" spacing={2}>
              <TextField
                label="Start date"
                type="date"
                fullWidth
                slotProps={{ inputLabel: { shrink: true } }}
                {...register('startDate')}
              />
              <TextField
                label="End date"
                type="date"
                fullWidth
                slotProps={{ inputLabel: { shrink: true } }}
                {...register('endDate')}
              />
            </Stack>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button variant="outlined" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" loading={isPending}>
            Create
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}
