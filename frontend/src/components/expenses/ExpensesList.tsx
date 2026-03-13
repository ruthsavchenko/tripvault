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
  Chip,
  Divider,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import {
  useExpensesControllerFindAll,
  useExpensesControllerRemove,
  getExpensesControllerFindAllQueryKey,
} from '../../api';
import type { Expense, ExpenseCategory } from '../../types/trip';
import AddExpenseDialog from './AddExpenseDialog';

const CATEGORY_COLOR: Record<
  ExpenseCategory,
  'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning'
> = {
  accommodation: 'primary',
  transport: 'info',
  food: 'success',
  activities: 'secondary',
  other: 'default',
};

function formatDate(dateStr?: string) {
  if (!dateStr) return null;
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export default function ExpensesList({ tripId }: { tripId: string }) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useExpensesControllerFindAll(tripId);
  const expenses = (data as unknown as Expense[]) ?? [];

  const { mutate: remove } = useExpensesControllerRemove({
    mutation: {
      onSuccess: () =>
        queryClient.invalidateQueries({ queryKey: getExpensesControllerFindAllQueryKey(tripId) }),
    },
  });

  const total = expenses.reduce((sum, e) => sum + Number(e.amount), 0);

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Expenses
        </Typography>
        <Button
          size="small"
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={() => setDialogOpen(true)}
        >
          Add expense
        </Button>
      </Box>

      {isError && <Alert severity="error">Failed to load expenses</Alert>}

      {isLoading ? (
        <Stack spacing={1}>
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} variant="rounded" height={56} />
          ))}
        </Stack>
      ) : expenses.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 6, color: 'text.secondary' }}>
          <ReceiptLongIcon sx={{ fontSize: 40, mb: 1, opacity: 0.4 }} />
          <Typography variant="body2">No expenses yet</Typography>
        </Box>
      ) : (
        <>
          <List disablePadding>
            {expenses.map((expense, index) => (
              <ListItem
                key={expense.id}
                disablePadding
                sx={{
                  py: 1.25,
                  px: 0,
                  borderBottom: index < expenses.length - 1 ? '1px solid' : 'none',
                  borderColor: 'divider',
                }}
                secondaryAction={
                  <IconButton
                    edge="end"
                    size="small"
                    onClick={() => remove({ tripId, id: expense.id })}
                  >
                    <DeleteOutlineIcon fontSize="small" />
                  </IconButton>
                }
              >
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <span>{expense.title}</span>
                      <Chip
                        label={expense.category}
                        size="small"
                        color={CATEGORY_COLOR[expense.category]}
                        variant="outlined"
                        sx={{ height: 20, fontSize: 11 }}
                      />
                    </Box>
                  }
                  secondary={formatDate(expense.date) ?? undefined}
                  slotProps={{ primary: { fontWeight: 500 } }}
                />
                <Typography variant="body2" fontWeight={600} sx={{ mr: 5, whiteSpace: 'nowrap' }}>
                  {Number(expense.amount).toFixed(2)}
                </Typography>
              </ListItem>
            ))}
          </List>
          <Divider sx={{ mt: 1 }} />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', pt: 1.5 }}>
            <Typography variant="body2" color="text.secondary" mr={1}>
              Total:
            </Typography>
            <Typography variant="body2" fontWeight={700}>
              {total.toFixed(2)}
            </Typography>
          </Box>
        </>
      )}

      <AddExpenseDialog tripId={tripId} open={dialogOpen} onClose={() => setDialogOpen(false)} />
    </Box>
  );
}
