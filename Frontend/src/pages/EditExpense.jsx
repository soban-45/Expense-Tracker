// src/pages/EditExpense.jsx

import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { updateExpenseAsync } from '../features/expensesSlice';

const EditExpense = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Get the expense to be edited from Redux store
  const expense = useSelector((state) =>
    state.expenses.expenses.find((exp) => exp.id === id)
  );

  // State for form inputs
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [category, setCategory] = useState('');

  // Populate form with existing expense data
  useEffect(() => {
    if (expense) {
      setTitle(expense.title);
      setAmount(expense.amount);
      setDate(expense.date);
      setCategory(expense.category);
    }
  }, [expense]);

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !amount || !category) {
      alert('Please fill all required fields!');
      return;
    }
    dispatch(updateExpenseAsync({ id, title, amount, date, category }));
    alert('Expense updated successfully!');
    navigate('/history'); // Redirect to Expense History
  };

  if (!expense) {
    return <h2>Expense not found!</h2>;
  }

  return (
    <div>
      <h2>Edit Expense</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Expense Name"
          className="form-control mb-2"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="number"
          placeholder="Amount"
          className="form-control mb-2"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <input
          type="date"
          className="form-control mb-2"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <input
          type="text"
          placeholder="Category"
          className="form-control mb-2"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
        <button type="submit" className="btn btn-primary">Update Expense</button>
      </form>
    </div>
  );
};

export default EditExpense;
