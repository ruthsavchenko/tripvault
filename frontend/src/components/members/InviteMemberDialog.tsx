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
  Alert,
  Box,
} from '@mui/material';
import { useMembersControllerInvite, getMembersControllerFindAllQueryKey } from '../../api';

const schema = z.object({
  email: z.string().email('Invalid email'),
});

type FormData = z.infer<typeof schema>;

interface Props {
  tripId: string;
  open: boolean;
  onClose: () => void;
}

export default function InviteMemberDialog({ tripId, open, onClose }: Props) {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const { mutate, isPending, isError, error } = useMembersControllerInvite({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getMembersControllerFindAllQueryKey(tripId) });
        reset();
        onClose();
      },
    },
  });

  const handleClose = () => {
    reset();
    onClose();
  };

  const errorMessage =
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    isError ? ((error as any)?.response?.data?.message ?? 'Failed to invite member') : null;

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
      <DialogTitle>Invite member</DialogTitle>
      <Box component="form" onSubmit={handleSubmit((values) => mutate({ tripId, data: values }))}>
        <DialogContent>
          {errorMessage && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {errorMessage}
            </Alert>
          )}
          <TextField
            label="Email"
            type="email"
            fullWidth
            autoFocus
            {...register('email')}
            error={!!errors.email}
            helperText={errors.email?.message}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button variant="outlined" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" loading={isPending}>
            Invite
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}
