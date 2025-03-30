import React, { useState, useEffect } from 'react';
import { Wallet, BarChart } from 'lucide-react';
import { Transaction, Currency } from './types';
import { currencies } from './data/currencies';
import { TransactionForm } from './components/TransactionForm';
import { TransactionList } from './components/TransactionList';
import { Analysis } from './components/Analysis';
import { WelcomePage } from './components/WelcomePage';

function App() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>(currencies[0]);
  const [currentPage, setCurrentPage] = useState<'transactions' | 'analysis'>('transactions');
  const [userName, setUserName] = useState('');
  const [isNameModalOpen, setIsNameModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showWelcome, setShowWelcome] = useState(true);

  useEffect(() => {
    // Show welcome page for 3 seconds
    const timer = setTimeout(() => {
      setShowWelcome(false);
      setIsNameModalOpen(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleAddTransaction = (transaction: Transaction) => {
    setTransactions((prev) => [transaction, ...prev]);
  };

  const handleDeleteTransaction = (id: string) => {
    setTransactions((prev) => prev.filter(transaction => transaction.id !== id));
  };

  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userName.trim()) {
      setIsNameModalOpen(false);
    }
  };

  if (showWelcome) {
    return <WelcomePage />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Name Modal */}
      {isNameModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-xl shadow-xl max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Welcome to Expense Manager</h2>
            <form onSubmit={handleNameSubmit}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Please enter your name
              </label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Your name"
                required
              />
              <button
                type="submit"
                className="mt-6 w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors shadow-md font-medium"
              >
                Continue
              </button>
            </form>
          </div>
        </div>
      )}

      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center gap-4">
              <h1 className="text-3xl font-bold text-gray-900">Expense Manager</h1>
              {userName && (
                <span className="text-lg text-gray-600">Welcome, {userName}</span>
              )}
            </div>
            <select
              value={selectedCurrency.code}
              onChange={(e) => {
                const currency = currencies.find((c) => c.code === e.target.value);
                if (currency) setSelectedCurrency(currency);
              }}
              className="rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-2"
            >
              {currencies.map((currency) => (
                <option key={currency.code} value={currency.code}>
                  {currency.code} ({currency.symbol})
                </option>
              ))}
            </select>
          </div>
        </div>
      </header>

      <nav className="bg-white shadow-sm mt-1 sticky top-[76px] z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-4 py-4">
            <button
              onClick={() => setCurrentPage('transactions')}
              className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                currentPage === 'transactions'
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Wallet className="mr-2" size={20} />
              Transactions
            </button>
            <button
              onClick={() => setCurrentPage('analysis')}
              className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                currentPage === 'analysis'
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <BarChart className="mr-2" size={20} />
              Analysis
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentPage === 'transactions' ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <TransactionForm
              onAddTransaction={handleAddTransaction}
              selectedCurrency={selectedCurrency.symbol}
              selectedDate={selectedDate}
              onDateChange={setSelectedDate}
            />
            <TransactionList
              transactions={transactions}
              selectedCurrency={selectedCurrency.symbol}
              onDeleteTransaction={handleDeleteTransaction}
            />
          </div>
        ) : (
          <Analysis
            transactions={transactions}
            selectedCurrency={selectedCurrency.symbol}
            userName={userName}
            selectedDate={selectedDate}
            onDateChange={setSelectedDate}
          />
        )}
      </main>
    </div>
  );
}

export default App;