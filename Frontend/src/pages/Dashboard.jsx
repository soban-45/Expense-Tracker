// src/pages/Dashboard.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PieChart, Pie, Cell, Tooltip, Legend, LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { getExpenses } from '../api/expenseApi';

const Dashboard = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch expenses from the backend
  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const data = await getExpenses();
        setExpenses(data);
      } catch (err) {
        console.error('Error fetching expenses:', err);
        setError('Failed to fetch expenses.');
      } finally {
        setLoading(false);
      }
    };

    fetchExpenses();
  }, []);

  // Calculate current month and year
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  // Filter expenses for the current month
  const monthlyExpenses = expenses.filter((expense) => {
    const expenseDate = new Date(expense.date);
    return expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear;
  });

  // Calculate total monthly expense
  const totalExpense = monthlyExpenses.reduce((acc, item) => acc + Number(item.amount), 0);

  // Group expenses by category for PieChart
  const categoryData = monthlyExpenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + Number(expense.amount);
    return acc;
  }, {});

  // Prepare Pie Chart Data
  const pieData = Object.entries(categoryData).map(([category, amount]) => ({
    name: category,
    value: amount,
  }));

  // Group expenses by month for LineChart (Jan to Dec)
  const monthlyExpenseData = Array(12).fill(0);
  expenses.forEach((expense) => {
    const expenseDate = new Date(expense.date);
    if (expenseDate.getFullYear() === currentYear) {
      const monthIndex = expenseDate.getMonth();
      monthlyExpenseData[monthIndex] += Number(expense.amount);
    }
  });

  // Prepare Line Chart Data
  const lineChartData = monthlyExpenseData.map((value, index) => ({
    month: new Date(2025, index).toLocaleString('default', { month: 'short' }),
    value,
  }));

  // Chart Colors
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-5">Dashboard</h2>
      <h4>Total Expense (This Month): ${totalExpense}</h4>

      <div className="row mt-5">
        {/* Pie Chart (Category-wise Breakdown) */}
        <div className="col-md-6 d-flex justify-content-center">
          {pieData.length > 0 ? (
            <PieChart width={400} height={300}>
              <Pie
                data={pieData}
                cx={200}
                cy={150}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label
              >
                {pieData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          ) : (
            <p>No expenses recorded for this month.</p>
          )}
        </div>

        {/* Line Chart (Monthly Trend) */}
        <div className="col-md-6">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={lineChartData} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="value" stroke="#8884d8" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Add Expense Button */}
      <div className="text-center mt-4">
        <Link to="/expense" className="btn btn-success">
          Add Expense
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
