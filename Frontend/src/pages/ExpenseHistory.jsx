import { useState, useEffect } from 'react';
import { getExpenses } from '../api/expenseApi';

const ExpenseHistory = () => {
    const [expenses, setExpenses] = useState([]);
    const [filteredExpenses, setFilteredExpenses] = useState([]);
    const [filters, setFilters] = useState({ date: '', category: '' });
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 6;

    // ✅ Fetch all expenses
    useEffect(() => {
        const fetchExpenses = async () => {
            try {
                const data = await getExpenses();
                setExpenses(data);
                setFilteredExpenses(data);
            } catch {
                alert('Failed to fetch expenses.');
            }
        };
        fetchExpenses();
    }, []);

    // ✅ Apply filters
    useEffect(() => {
        const filtered = expenses.filter((expense) => {
            const matchesDate = filters.date
                ? expense.date === filters.date
                : true;
            const matchesCategory = filters.category
                ? expense.category.toLowerCase().includes(filters.category.toLowerCase())
                : true;
            return matchesDate && matchesCategory;
        });
        setFilteredExpenses(filtered);
        setCurrentPage(1); // Reset pagination
    }, [filters, expenses]);

    // ✅ Handle filter changes
    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters((prev) => ({ ...prev, [name]: value }));
    };

    // ✅ Pagination
    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentRows = filteredExpenses.slice(indexOfFirstRow, indexOfLastRow);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className="container mt-4">
            <h2 className="text-center mb-4">Expense History</h2>

            {/* Filter Inputs */}
            <div className="row mb-3">
                <div className="col-md-6">
                    <div className="form-floating">
                        <input
                            type="date"
                            name="date"
                            value={filters.date}
                            onChange={handleFilterChange}
                            className="form-control"
                        />
                        <label htmlFor="date">Filter by Date</label>
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="form-floating">
                        <input
                            type="text"
                            name="category"
                            value={filters.category}
                            onChange={handleFilterChange}
                            className="form-control"
                            placeholder="Filter by Category"
                        />
                        <label htmlFor="category">Filter by Category</label>
                    </div>
                </div>
            </div>

            {/* Expense History Table */}
            {currentRows.length === 0 ? (
                <p className="text-center">No expenses found.</p>
            ) : (
                <table className="table table-bordered table-hover">
                    <thead className="table-light">
                        <tr>
                            <th>S.No</th>
                            <th>Expense Name</th>
                            <th>Amount</th>
                            <th>Date</th>
                            <th>Category</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentRows.map((expense, index) => (
                            <tr key={expense.id}>
                                <td>{indexOfFirstRow + index + 1}</td>
                                <td>{expense.expense_name}</td>
                                <td>${expense.amount}</td>
                                <td>{expense.date}</td>
                                <td>{expense.category}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {/* Pagination */}
            <nav>
                <ul className="pagination justify-content-center">
                    {Array.from({ length: Math.ceil(filteredExpenses.length / rowsPerPage) }, (_, i) => (
                        <li
                            key={i}
                            className={`page-item ${i + 1 === currentPage ? 'active' : ''}`}
                        >
                            <button className="page-link" onClick={() => paginate(i + 1)}>
                                {i + 1}
                            </button>
                        </li>
                    ))}
                </ul>
            </nav>
        </div>
    );
};

export default ExpenseHistory;
