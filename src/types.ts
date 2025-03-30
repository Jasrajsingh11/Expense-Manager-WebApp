export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  description: string;
  date: string;
}

export interface Currency {
  code: string;
  symbol: string;
  name: string;
}

export interface Analysis {
  totalIncome: number;
  totalExpense: number;
  savings: number;
  topExpenses: {
    category: string;
    amount: number;
    percentage: number;
  }[];
}