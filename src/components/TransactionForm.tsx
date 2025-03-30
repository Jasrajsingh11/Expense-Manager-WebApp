import React, { useState } from 'react';
import { PlusCircle, Calendar } from 'lucide-react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { Transaction } from '../types';
import { categories } from '../data/categories';

interface Props {
  onAddTransaction: (transaction: Transaction) => void;
  selectedCurrency: string;
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

export function TransactionForm({ onAddTransaction, selectedCurrency, selectedDate, onDateChange }: Props) {
  const [type, setType] = useState<'income' | 'expense'>('income');
  
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    
    const transaction: Transaction = {
      id: crypto.randomUUID(),
      type,
      amount: Number(formData.get('amount')),
      category: formData.get('category') as string,
      description: formData.get('description') as string,
      date: selectedDate.toISOString(),
    };
    
    onAddTransaction(transaction);
    form.reset();
    // Don't reset the type after submission
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
      <div className="flex gap-4 mb-6">
        <button
          type="button"
          onClick={() => setType('income')}
          className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
            type === 'income'
              ? 'bg-green-500 text-white shadow-md hover:bg-green-600'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Income
        </button>
        <button
          type="button"
          onClick={() => setType('expense')}
          className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
            type === 'expense'
              ? 'bg-red-500 text-white shadow-md hover:bg-red-600'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Expense
        </button>
      </div>

      <div className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Amount ({selectedCurrency})</label>
          <input
            type="number"
            name="amount"
            required
            min="0"
            step="0.01"
            placeholder="Enter amount"
            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-3"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
          <select
            name="category"
            required
            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-3"
          >
            {categories[type].map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
          <div className="relative">
            <DatePicker
              selected={selectedDate}
              onChange={onDateChange}
              dateFormat="MMMM yyyy"
              showMonthYearPicker
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-3"
            />
            <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
          <input
            type="text"
            name="description"
            required
            placeholder="Enter description"
            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-3"
          />
        </div>

        <button
          type="submit"
          className="w-full flex items-center justify-center gap-2 bg-blue-500 text-white px-4 py-3 rounded-lg hover:bg-blue-600 transition-colors shadow-md font-medium mt-6"
        >
          <PlusCircle size={20} />
          Add {type === 'income' ? 'Income' : 'Expense'}
        </button>
      </div>
    </form>
  );
}