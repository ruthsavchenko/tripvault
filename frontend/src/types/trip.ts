export interface Trip {
  id: string;
  title: string;
  description?: string;
  startDate?: string;
  endDate?: string;
}

export interface Place {
  id: string;
  name: string;
  description?: string;
  address?: string;
  date?: string;
  tripId: string;
}

export type ExpenseCategory = 'accommodation' | 'transport' | 'food' | 'activities' | 'other';

export interface Expense {
  id: string;
  title: string;
  amount: number;
  category: ExpenseCategory;
  date?: string;
  tripId: string;
}

export interface Member {
  id: string;
  role: 'owner' | 'viewer';
  userId: string;
  tripId: string;
  joinedAt: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}
