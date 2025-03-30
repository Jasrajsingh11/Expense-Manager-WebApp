import React from 'react';
import { Transaction } from '../types';
import { PieChart, TrendingDown, Lightbulb, Download, Calendar } from 'lucide-react';
import { format, startOfMonth, endOfMonth, parseISO } from 'date-fns';
import { jsPDF } from 'jspdf';
import DatePicker from 'react-datepicker';

interface Props {
  transactions: Transaction[];
  selectedCurrency: string;
  userName: string;
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

export function Analysis({ transactions, selectedCurrency, userName, selectedDate, onDateChange }: Props) {
  // Filter transactions by selected month
  const filteredTransactions = transactions.filter(t => {
    const transactionDate = parseISO(t.date);
    return transactionDate >= startOfMonth(selectedDate) && 
           transactionDate <= endOfMonth(selectedDate);
  });

  const totalIncome = filteredTransactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = filteredTransactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const savings = totalIncome - totalExpense;

  const expensesByCategory = filteredTransactions
    .filter((t) => t.type === 'expense')
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);

  const allExpenses = Object.entries(expensesByCategory)
    .sort(([, a], [, b]) => b - a)
    .map(([category, amount]) => ({
      category,
      amount,
      percentage: totalExpense > 0 ? (amount / totalExpense) * 100 : 0,
    }));

  const topExpenses = allExpenses.slice(0, 3);

  const incomeByCategory = filteredTransactions
    .filter((t) => t.type === 'income')
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);

  const allIncome = Object.entries(incomeByCategory)
    .sort(([, a], [, b]) => b - a)
    .map(([category, amount]) => ({
      category,
      amount,
      percentage: totalIncome > 0 ? (amount / totalIncome) * 100 : 0,
    }));

  const suggestions = {
    Housing: "Consider roommates or a smaller place to reduce rent/mortgage",
    Transportation: "Use public transport or carpool to save on fuel costs",
    Food: "Cook meals at home and plan your grocery shopping",
    Utilities: "Install energy-efficient appliances and monitor usage",
    Entertainment: "Look for free events and activities in your area",
    Shopping: "Make a shopping list and stick to it, wait for sales",
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    let yPos = margin;

    // Header with title
    doc.setFillColor(52, 152, 219);
    doc.rect(0, 0, pageWidth, 40, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('Expense Analysis Report', pageWidth / 2, 25, { align: 'center' });
    
    yPos = 50;
    
    // User info and date
    doc.setTextColor(0);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text(`Report for: ${userName}`, margin, yPos);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(14);
    doc.text(`Period: ${format(selectedDate, 'MMMM yyyy')}`, margin, yPos + 10);
    
    yPos += 30;

    // Financial Summary
    doc.setFillColor(245, 247, 250);
    doc.rect(margin, yPos, pageWidth - (margin * 2), 50, 'F');
    
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('Financial Summary', margin + 5, yPos + 15);
    
    doc.setFontSize(14);
    doc.setFont('helvetica', 'normal');
    const summaryData = [
      `Total Income: ${selectedCurrency}${totalIncome.toFixed(2)}`,
      `Total Expenses: ${selectedCurrency}${totalExpense.toFixed(2)}`,
      `Net Savings: ${selectedCurrency}${savings.toFixed(2)}`
    ];
    
    summaryData.forEach((text, index) => {
      doc.text(text, margin + 10, yPos + 30 + (index * 10));
    });
    
    yPos += 70;

    // Income Breakdown
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('Income Breakdown', margin, yPos);
    yPos += 10;

    // Table headers for income
    doc.setFillColor(46, 204, 113); // Green for income
    doc.rect(margin, yPos, pageWidth - (margin * 2), 10, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.text('Category', margin + 5, yPos + 7);
    doc.text('Amount', pageWidth - 80, yPos + 7);
    doc.text('Percentage', pageWidth - 40, yPos + 7);
    
    // Table content for income
    yPos += 15;
    doc.setTextColor(0);
    
    if (allIncome.length === 0) {
      doc.setFont('helvetica', 'italic');
      doc.text("No income recorded for this period", margin + 5, yPos);
      yPos += 15;
    } else {
      allIncome.forEach((income) => {
        doc.setFont('helvetica', 'normal');
        doc.text(income.category, margin + 5, yPos);
        doc.text(`${selectedCurrency}${income.amount.toFixed(2)}`, pageWidth - 80, yPos);
        doc.text(`${income.percentage.toFixed(1)}%`, pageWidth - 40, yPos);
        yPos += 10;
      });
      yPos += 10;
    }

    // Top Expenses
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('Top 3 Expenses', margin, yPos);
    yPos += 10;

    // Table headers for top expenses
    doc.setFillColor(231, 76, 60); // Red for expenses
    doc.rect(margin, yPos, pageWidth - (margin * 2), 10, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.text('Category', margin + 5, yPos + 7);
    doc.text('Amount', pageWidth - 80, yPos + 7);
    doc.text('Percentage', pageWidth - 40, yPos + 7);
    
    // Table content for top expenses
    yPos += 15;
    doc.setTextColor(0);
    
    if (topExpenses.length === 0) {
      doc.setFont('helvetica', 'italic');
      doc.text("No expenses recorded for this period", margin + 5, yPos);
      yPos += 15;
    } else {
      topExpenses.forEach((expense) => {
        doc.setFont('helvetica', 'normal');
        doc.text(expense.category, margin + 5, yPos);
        doc.text(`${selectedCurrency}${expense.amount.toFixed(2)}`, pageWidth - 80, yPos);
        doc.text(`${expense.percentage.toFixed(1)}%`, pageWidth - 40, yPos);
        yPos += 10;
      });
      yPos += 10;
    }

    // All Other Expenses
    if (allExpenses.length > 3) {
      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      doc.text('Other Expenses', margin, yPos);
      yPos += 10;

      // Table headers for other expenses
      doc.setFillColor(149, 165, 166); // Gray for other expenses
      doc.rect(margin, yPos, pageWidth - (margin * 2), 10, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(12);
      doc.text('Category', margin + 5, yPos + 7);
      doc.text('Amount', pageWidth - 80, yPos + 7);
      doc.text('Percentage', pageWidth - 40, yPos + 7);
      
      // Table content for other expenses
      yPos += 15;
      doc.setTextColor(0);
      
      allExpenses.slice(3).forEach((expense) => {
        doc.setFont('helvetica', 'normal');
        doc.text(expense.category, margin + 5, yPos);
        doc.text(`${selectedCurrency}${expense.amount.toFixed(2)}`, pageWidth - 80, yPos);
        doc.text(`${expense.percentage.toFixed(1)}%`, pageWidth - 40, yPos);
        yPos += 10;
      });
      yPos += 10;
    }

    // Check if we need a new page for suggestions
    if (yPos > doc.internal.pageSize.getHeight() - 100) {
      doc.addPage();
      yPos = margin;
    }

    // Suggestions Section
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.text('Suggestions for Improvement', margin, yPos);
    yPos += 15;

    doc.setFontSize(12);
    topExpenses.forEach(({ category }) => {
      const suggestion = suggestions[category as keyof typeof suggestions] || 
        "Track your spending in this category and look for areas to cut back.";
      
      doc.setFont('helvetica', 'bold');
      doc.text(`${category}:`, margin, yPos);
      yPos += 7;
      
      doc.setFont('helvetica', 'normal');
      const lines = doc.splitTextToSize(suggestion, pageWidth - (margin * 2) - 20);
      doc.text(lines, margin + 10, yPos);
      yPos += lines.length * 7 + 5;
    });

    doc.save(`expense-report-${format(selectedDate, 'MMM-yyyy')}.pdf`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold text-gray-800">Analysis Report</h2>
          <div className="relative">
            <DatePicker
              selected={selectedDate}
              onChange={onDateChange}
              dateFormat="MMMM yyyy"
              showMonthYearPicker
              className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          </div>
        </div>
        <button
          onClick={handleDownloadPDF}
          className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors shadow-md"
        >
          <Download size={20} />
          Download PDF
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">Total Income</h3>
          <p className="text-2xl text-green-600">
            {selectedCurrency} {totalIncome.toFixed(2)}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">Total Expenses</h3>
          <p className="text-2xl text-red-600">
            {selectedCurrency} {totalExpense.toFixed(2)}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">Savings</h3>
          <p className={`text-2xl ${savings >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {selectedCurrency} {savings.toFixed(2)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center gap-2 mb-4">
            <TrendingDown className="text-blue-500" />
            <h3 className="text-lg font-semibold">Top Expenses</h3>
          </div>
          <div className="space-y-4">
            {topExpenses.map(({ category, amount, percentage }) => (
              <div key={category}>
                <div className="flex justify-between mb-1">
                  <span className="font-medium">{category}</span>
                  <span>{selectedCurrency} {amount.toFixed(2)} ({percentage.toFixed(1)}%)</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-500 rounded-full h-2"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center gap-2 mb-4">
            <PieChart className="text-purple-500" />
            <h3 className="text-lg font-semibold">All Expenses</h3>
          </div>
         
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center gap-2 mb-4">
          <Lightbulb className="text-yellow-500" />
          <h3 className="text-lg font-semibold">Suggestions to Reduce Expenses</h3>
        </div>
        <div className="space-y-4">
          {topExpenses.map(({ category }) => (
            <div key={category} className="p-4 bg-yellow-50 rounded-lg">
              <h4 className="font-medium mb-2">{category}</h4>
              <p className="text-gray-600">{suggestions[category as keyof typeof suggestions] || "Track your spending in this category and look for areas to cut back."}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}