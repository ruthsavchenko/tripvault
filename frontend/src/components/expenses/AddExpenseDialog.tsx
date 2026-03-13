import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { Resolver } from 'react-hook-form';
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
  MenuItem,
} from '@mui/material';
import {
  useExpensesControllerCreate,
  getExpensesControllerFindAllQueryKey,
} from '../../api';
import type { CreateExpenseDtoCategory, CreateExpenseDto } from '../../api';

const CATEGORIES: { value: CreateExpenseDtoCategory; label: string }[] = [
  { value: 'accommodation', label: 'Accommodation' },
  { value: 'transport', label: 'Transport' },
  { value: 'food', label: 'Food' },
  { value: 'activities', label: 'Activities' },
  { value: 'other', label: 'Other' },
];

const schema = z.object({
  title: z.string().min(1, 'Title is required'),
  amount: z.coerce.number().positive('Must be positive'),
  category: z.enum(['accommodation', 'transport', 'food', 'activities', 'other']),
  date: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

interface Props {
  tripId: string;
  open: boolean;
  onClose: () => void;
}

export default function AddExpenseDialog({ tripId, open, onClose }: Props) {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema) as Resolver<FormData>,
    defaultValues: { category: 'other' },
  });

  const { mutate, isPending, isError } = useExpensesControllerCreate({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getExpensesControllerFindAllQueryKey(tripId) });
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
      <DialogTitle>Add expense</DialogTitle>
      <Box component="form" onSubmit={handleSubmit((values) => mutate({ tripId, data: values as CreateExpenseDto }))}>
        <DialogContent>
          <Stack spacing={2.5}>
            {isError && <Alert severity="error">Failed to add expense</Alert>}
            <TextField
              label="Title"
              fullWidth
              autoFocus
              {...register('title')}
              error={!!errors.title}
              helperText={errors.title?.message}
            />
            <Stack direction="row" spacing={2}>
              <TextField
                label="Amount"
                type="number"
                fullWidth
                slotProps={{ htmlInput: { step: '0.01', min: 0 } }}
                {...register('amount')}
                error={!!errors.amount}
                helperText={errors.amount?.message}
              />
              <Controller
                name="category"
                control={control}
                render={({ field }) => (
                  <TextField select label="Category" fullWidth {...field}>
                    {CATEGORIES.map((c) => (
                      <MenuItem key={c.value} value={c.value}>
                        {c.label}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </Stack>
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
