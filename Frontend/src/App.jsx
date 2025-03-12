// src/App.jsx
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import ExpenseHistory from './pages/ExpenseHistory';
import Reports from './pages/Reports';
import Expenses from './pages/Expenses';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="history" element={<ExpenseHistory />} />
        <Route path="reports" element={<Reports />} />
        <Route path="expense" element={<Expenses />} />
      </Route>
    </Routes>
  );
};

export default App;
