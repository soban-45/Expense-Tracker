import axios from 'axios';

const API_URL = 'http://localhost:8000/expenses/';

// ✅ Fetch all expenses
export const getExpenses = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching expenses:', error);
    throw error;
  }
};

// ✅ Add a new expense
export const createExpense = async (expenseData) => {
  try {
    const response = await axios.post(API_URL, expenseData);
    return response.data;
  } catch (error) {
    console.error('Error creating expense:', error);
    throw error;
  }
};

// ✅ Update an expense by ID
export const updateExpense = async (id, expenseData) => {
  try {
    const response = await axios.put(`${API_URL}?id=${id}`, expenseData);
    return response.data;
  } catch (error) {
    console.error('Error updating expense:', error);
    throw error;
  }
};

// ✅ Delete an expense by ID
export const deleteExpense = async (id) => {
  try {
    await axios.delete(`${API_URL}?id=${id}`);
  } catch (error) {
    console.error('Error deleting expense:', error);
    throw error;
  }
};
