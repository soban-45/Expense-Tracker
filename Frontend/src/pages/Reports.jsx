import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getExpenses } from '../api/expenseApi';

const Reports = () => {
  const [expenses, setExpenses] = useState([]);
  const [reportType, setReportType] = useState('monthly');

  // ✅ Fetch Expenses from API
  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const data = await getExpenses();
        setExpenses(data);
      } catch {
        alert('Failed to fetch expenses.');
      }
    };
    fetchExpenses();
  }, []);

  // ✅ Helper: Group expenses by month or year
  const groupExpensesBy = (type) => {
    const groupedData = {};
    expenses.forEach((expense) => {
      const date = new Date(expense.date);
      const key = type === 'monthly'
        ? `${date.getFullYear()}-${date.getMonth() + 1}`
        : `${date.getFullYear()}`;

      if (!groupedData[key]) groupedData[key] = 0;
      groupedData[key] += Number(expense.amount);
    });

    return Object.entries(groupedData).map(([label, value]) => ({ label, value }));
  };

  // ✅ Helper: Get total expenses by category
  const getCategoryTotals = () => {
    const categoryTotals = {};
    expenses.forEach((expense) => {
      if (!categoryTotals[expense.category]) {
        categoryTotals[expense.category] = 0;
      }
      categoryTotals[expense.category] += Number(expense.amount);
    });
    return Object.entries(categoryTotals);
  };

  const reportData = groupExpensesBy(reportType);

  // ✅ Download Report as CSV
  const downloadReport = () => {
    const header = 'Category,Amount\n';
    const rows = getCategoryTotals()
      .map(([category, amount]) => `${category},${amount}`)
      .join('\n');

    const csvContent = `data:text/csv;charset=utf-8,${header}${rows}`;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'expense_report.csv');
    document.body.appendChild(link);
    link.click();
  };

  return (
    <div>
      <h2 className="text-center">Expense Reports</h2>

      {/* ✅ Report Type Switcher */}
      <div className="mb-3">
        <button
          className={`btn ${reportType === 'monthly' ? 'btn-primary' : 'btn-secondary'} me-2`}
          onClick={() => setReportType('monthly')}
        >
          Monthly Report
        </button>
        <button
          className={`btn ${reportType === 'yearly' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setReportType('yearly')}
        >
          Yearly Report
        </button>
      </div>

      {/* ✅ Bar Chart */}
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={reportData}>
          <XAxis dataKey="label" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="value" fill="#82ca9d" />
        </BarChart>
      </ResponsiveContainer>



      {/* ✅ Download Report Button */}
      <button className="btn btn-success" onClick={downloadReport}>
        Download Report (CSV)
      </button>
    </div>
  );
};

export default Reports;
