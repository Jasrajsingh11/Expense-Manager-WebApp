import React from 'react';
import { Transaction } from '../types';
import { ArrowUpCircle, ArrowDownCircle, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

interface Props {
  transactions: Transaction[];
  selectedCurrency: string;
  onDeleteTransaction: (id: string) => void;
}

export function TransactionList({ transactions, selectedCurrency, onDeleteTransaction }: Props) {
  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-xl font-semibold text-gray-800">Recent Transactions</h2>
      </div>
      <div className="divide-y divide-gray-100">
        {transactions.map((transaction) => (
          <div key={transaction.id} className="p-6 flex items-center gap-4 hover:bg-gray-50 transition-colors">
            <div className={`p-2 rounded-full ${
              transaction.type === 'income' ? 'bg-green-100' : 'bg-red-100'
            }`}>
              {transaction.type === 'income' ? (
                <ArrowUpCircle className="text-green-600" size={24} />
              ) : (
                <ArrowDownCircle className="text-red-600" size={24} />
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <p className="font-medium text-gray-900">{transaction.category}</p>
                <p className={`font-semibold ${
                  transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {transaction.type === 'income' ? '+' : '-'} {selectedCurrency} {transaction.amount.toFixed(2)}
                </p>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500">{transaction.description}</p>
                <p className="text-sm text-gray-500">
                  {format(new Date(transaction.date), 'MMM yyyy')}
                </p>
              </div>
            </div>
            <button 
              onClick={() => onDeleteTransaction(transaction.id)}
              className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
              title="Delete transaction"
            >
              <Trash2 size={18} />
            </button>
          </div>
        ))}
        {transactions.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            <p className="text-lg">No transactions yet</p>
            <p className="text-sm mt-1">Add your first transaction to get started</p>
          </div>
        )}
      </div>
    </div>
  );
}