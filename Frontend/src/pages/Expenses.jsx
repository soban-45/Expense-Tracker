import { useState, useEffect } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import {
    getExpenses,
    createExpense,
    updateExpense,
    deleteExpense,
} from '../api/expenseApi';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



const Expenses = () => {
    const [expenses, setExpenses] = useState([]);
    const [formData, setFormData] = useState({
        expense_name: '',
        amount: '',
        date: new Date().toISOString().split('T')[0],
        category: '',
    });
    const [editId, setEditId] = useState(null);
    const [deleteId, setDeleteId] = useState(null);

    // Predefined categories
    const categories = [
        'Food & Dining',
        'Transportation',
        'Utilities',
        'Entertainment',
        'Health & Fitness',
        'Shopping',
        'Education',
        'Travel',
        'Other',
    ];

    // Fetch Expenses (Current Month)
    const fetchExpenses = async () => {
        try {
            const data = await getExpenses();
            const currentMonth = new Date().getMonth();
            const currentYear = new Date().getFullYear();

            const monthlyExpenses = data.filter((expense) => {
                const expenseDate = new Date(expense.date);
                return (
                    expenseDate.getMonth() === currentMonth &&
                    expenseDate.getFullYear() === currentYear
                );
            });

            setExpenses(monthlyExpenses);
        } catch {
            toast.error('Failed to fetch expenses.');
        }
    };

    useEffect(() => {
        fetchExpenses();
    }, []);

    // Handle Input Changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Create or Update Expense
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editId) {
                await updateExpense(editId, formData);
                toast.success('Expense updated successfully!');
            } else {
                await createExpense(formData);
                toast.success('Expense added successfully!');
            }

            setFormData({
                expense_name: '',
                amount: '',
                date: new Date().toISOString().split('T')[0],
                category: '',
            });
            setEditId(null);
            fetchExpenses();
        } catch {
            toast.error('Failed to save expense.');
        }
    };

    // Populate Form for Editing
    const handleEdit = (expense) => {
        setEditId(expense.id);
        setFormData({
            expense_name: expense.expense_name,
            amount: expense.amount,
            date: expense.date,
            category: expense.category,
        });
    };

    // Open Delete Confirmation Modal
    const openDeleteModal = (id) => {
        setDeleteId(id);
    };

    // Delete Expense
    const confirmDelete = async () => {
        try {
            await deleteExpense(deleteId);
            toast.success('Expense deleted successfully!');
            setDeleteId(null);
            fetchExpenses();
        } catch {
            toast.error('Failed to delete expense.');
        }
    };

    return (
        <div className="container mt-4">

            {/* Centered Heading */}
            <h2 className="text-center">{editId ? 'Edit Expense' : 'Add Expense'}</h2>

            {/* Expense Form */}
            <form onSubmit={handleSubmit} className="row g-2 align-items-center mb-4">
                <div className="col">
                    <div className="form-floating">
                        <input
                            type="text"
                            name="expense_name"
                            placeholder="Expense Name"
                            value={formData.expense_name}
                            onChange={handleChange}
                            className="form-control"
                            required
                        />
                        <label>Expense Name</label>
                    </div>
                </div>

                <div className="col">
                    <div className="form-floating">
                        <input
                            type="number"
                            name="amount"
                            placeholder="Amount"
                            value={formData.amount}
                            onChange={handleChange}
                            className="form-control"
                            required
                        />
                        <label>Amount</label>
                    </div>
                </div>

                <div className="col">
                    <div className="form-floating">
                        <input
                            type="date"
                            name="date"
                            value={formData.date}
                            onChange={handleChange}
                            className="form-control"
                            required
                        />
                        <label>Date</label>
                    </div>
                </div>

                <div className="col">
                    <div className="form-floating">
                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            className="form-select"
                            required
                        >
                            <option value="">Select Category</option>
                            {categories.map((category) => (
                                <option key={category} value={category}>
                                    {category}
                                </option>
                            ))}
                        </select>
                        <label>Category</label>
                    </div>
                </div>

                <div className="col-auto">
                    <button type="submit" className="btn btn-primary">
                        {editId ? 'Update' : 'Add'}
                    </button>
                </div>
            </form>

            {/* Expense List */}
            <h3 className="text-center">Expense List (Current Month)</h3>

            {expenses.length === 0 ? (
                <p className="text-center">No expenses available for this month.</p>
            ) : (
                <div className="table-container" style={{ overflowY: 'auto', maxHeight: '350px' }}>
                    <table className="table table-bordered mt-3">
                        <thead className="table-light" style={{ position: 'sticky', top: 0, background: 'white' }}>
                            <tr>
                                <th>Name</th>
                                <th>Amount</th>
                                <th>Date</th>
                                <th>Category</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {expenses.map((expense) => (
                                <tr key={expense.id}>
                                    <td>{expense.expense_name}</td>
                                    <td>${expense.amount}</td>
                                    <td>{expense.date}</td>
                                    <td>{expense.category}</td>
                                    <td>
                                        <button
                                            onClick={() => handleEdit(expense)}
                                            className="btn btn-link p-0 me-2"
                                        >
                                            <FaEdit size={18} />
                                        </button>
                                        <button
                                            onClick={() => openDeleteModal(expense.id)}
                                            className="btn btn-link p-0 text-danger"
                                        >
                                            <FaTrash size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deleteId && (
                <div className="modal show d-block" tabIndex="-1">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Confirm Delete</h5>
                                <button onClick={() => setDeleteId(null)} className="btn-close"></button>
                            </div>
                            <div className="modal-body">
                                <p>Are you sure you want to delete this expense?</p>
                            </div>
                            <div className="modal-footer">
                                <button onClick={() => setDeleteId(null)} className="btn btn-secondary">
                                    Cancel
                                </button>
                                <button onClick={confirmDelete} className="btn btn-danger">
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default Expenses;
