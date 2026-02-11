import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { expensesApi } from '../api/expenses';
import { categoriesApi } from '../api/categories';
import { formatCurrency, formatDate } from '../utils/format';
import { CategoryBadge } from '../components/CategoryBadge';
import { Button } from '../components/Button';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { useToast } from '../context/ToastContext';
import type { Expense, Category, PaginatedResponse } from '../types';

export function ExpensesPage() {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [expenses, setExpenses] = useState<PaginatedResponse<Expense> | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [page, setPage] = useState(0);
  const pageSize = 10;

  // Filters
  const [filterCategory, setFilterCategory] = useState('');
  const [filterStartDate, setFilterStartDate] = useState('');
  const [filterEndDate, setFilterEndDate] = useState('');
  const [appliedFilters, setAppliedFilters] = useState<{
    category?: number;
    startDate?: string;
    endDate?: string;
  }>({});

  // Delete
  const [deleteTarget, setDeleteTarget] = useState<Expense | null>(null);
  const [deleting, setDeleting] = useState(false);

  const hasActiveFilters = appliedFilters.category || appliedFilters.startDate || appliedFilters.endDate;

  const fetchExpenses = async () => {
    setLoading(true);
    setError(false);
    try {
      const data = await expensesApi.list({
        page,
        size: pageSize,
        ...appliedFilters,
      });
      setExpenses(data);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    categoriesApi.list().then(setCategories).catch(() => {});
  }, []);

  useEffect(() => {
    fetchExpenses();
  }, [page, appliedFilters]);

  const applyFilters = () => {
    setPage(0);
    setAppliedFilters({
      category: filterCategory ? Number(filterCategory) : undefined,
      startDate: filterStartDate || undefined,
      endDate: filterEndDate || undefined,
    });
  };

  const clearFilters = () => {
    setFilterCategory('');
    setFilterStartDate('');
    setFilterEndDate('');
    setPage(0);
    setAppliedFilters({});
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await expensesApi.delete(deleteTarget.id);
      addToast('Expense deleted.', 'success');
      setDeleteTarget(null);
      fetchExpenses();
    } catch {
      addToast('Could not delete expense. Please try again.', 'error');
    } finally {
      setDeleting(false);
    }
  };

  const renderPagination = () => {
    if (!expenses || expenses.totalPages <= 1) return null;
    const start = page * pageSize + 1;
    const end = Math.min((page + 1) * pageSize, expenses.totalElements);
    return (
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 16, flexWrap: 'wrap', gap: 8 }}>
        <span style={{ color: 'var(--color-text-secondary)', fontSize: 13 }}>
          Showing {start}-{end} of {expenses.totalElements}
        </span>
        <div style={{ display: 'flex', gap: 4 }}>
          <button
            disabled={page === 0}
            onClick={() => setPage(page - 1)}
            style={{
              padding: '6px 12px',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-btn)',
              background: 'var(--color-surface)',
              cursor: page === 0 ? 'not-allowed' : 'pointer',
              opacity: page === 0 ? 0.5 : 1,
            }}
          >
            Previous
          </button>
          {Array.from({ length: expenses.totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setPage(i)}
              style={{
                padding: '6px 12px',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-btn)',
                background: i === page ? 'var(--color-primary)' : 'var(--color-surface)',
                color: i === page ? '#fff' : 'var(--color-text)',
                cursor: 'pointer',
              }}
            >
              {i + 1}
            </button>
          ))}
          <button
            disabled={page >= expenses.totalPages - 1}
            onClick={() => setPage(page + 1)}
            style={{
              padding: '6px 12px',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-btn)',
              background: 'var(--color-surface)',
              cursor: page >= expenses.totalPages - 1 ? 'not-allowed' : 'pointer',
              opacity: page >= expenses.totalPages - 1 ? 0.5 : 1,
            }}
          >
            Next
          </button>
        </div>
      </div>
    );
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
        <h1>Expenses</h1>
        <Button onClick={() => navigate('/expenses/new')}>+ Add Expense</Button>
      </div>

      {/* Filters */}
      <div
        style={{
          display: 'flex',
          gap: 12,
          flexWrap: 'wrap',
          alignItems: 'end',
          padding: 16,
          backgroundColor: 'var(--color-surface)',
          borderRadius: 'var(--radius-card)',
          boxShadow: 'var(--shadow-card)',
          marginBottom: 16,
        }}
      >
        <div>
          <label style={{ display: 'block', fontSize: 12, color: 'var(--color-text-secondary)', marginBottom: 4 }}>Category</label>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            style={{
              height: 36,
              padding: '0 8px',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-input)',
              backgroundColor: 'var(--color-surface)',
            }}
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label style={{ display: 'block', fontSize: 12, color: 'var(--color-text-secondary)', marginBottom: 4 }}>From</label>
          <input
            type="date"
            value={filterStartDate}
            onChange={(e) => setFilterStartDate(e.target.value)}
            style={{
              height: 36,
              padding: '0 8px',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-input)',
            }}
          />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: 12, color: 'var(--color-text-secondary)', marginBottom: 4 }}>To</label>
          <input
            type="date"
            value={filterEndDate}
            onChange={(e) => setFilterEndDate(e.target.value)}
            style={{
              height: 36,
              padding: '0 8px',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-input)',
            }}
          />
        </div>
        <Button variant="secondary" onClick={applyFilters} style={{ height: 36 }}>Apply</Button>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--color-primary)',
              cursor: 'pointer',
              fontSize: 13,
              padding: '8px 0',
            }}
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Content */}
      {loading ? (
        <div style={{ padding: 40, textAlign: 'center' }}>
          <p style={{ color: 'var(--color-text-secondary)' }}>Loading expenses...</p>
        </div>
      ) : error ? (
        <div style={{ padding: 40, textAlign: 'center' }}>
          <p style={{ color: 'var(--color-danger)', marginBottom: 12 }}>Could not load expenses. Please try again.</p>
          <Button variant="secondary" onClick={fetchExpenses}>Retry</Button>
        </div>
      ) : !expenses || expenses.totalElements === 0 ? (
        <div style={{ padding: 60, textAlign: 'center' }}>
          {hasActiveFilters ? (
            <>
              <p style={{ color: 'var(--color-text-secondary)', marginBottom: 8 }}>No expenses match your filters.</p>
              <button
                onClick={clearFilters}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--color-primary)',
                  cursor: 'pointer',
                  fontSize: 14,
                }}
              >
                Clear filters
              </button>
            </>
          ) : (
            <>
              <svg width="48" height="48" fill="none" stroke="var(--color-text-secondary)" strokeWidth={1} viewBox="0 0 24 24" style={{ marginBottom: 12, opacity: 0.5 }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <p style={{ color: 'var(--color-text-secondary)', marginBottom: 16 }}>No expenses yet. Start tracking your spending!</p>
              <Button onClick={() => navigate('/expenses/new')}>Add Your First Expense</Button>
            </>
          )}
        </div>
      ) : (
        <div
          style={{
            backgroundColor: 'var(--color-surface)',
            borderRadius: 'var(--radius-card)',
            boxShadow: 'var(--shadow-card)',
            overflow: 'hidden',
          }}
        >
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--color-border)' }}>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, color: 'var(--color-text-secondary)', fontWeight: 500 }}>Date</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, color: 'var(--color-text-secondary)', fontWeight: 500 }}>Category</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, color: 'var(--color-text-secondary)', fontWeight: 500 }}>Description</th>
                <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: 12, color: 'var(--color-text-secondary)', fontWeight: 500 }}>Amount</th>
                <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: 12, color: 'var(--color-text-secondary)', fontWeight: 500, width: 80 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {expenses.content.map((exp, i) => (
                <tr
                  key={exp.id}
                  onClick={() => navigate(`/expenses/${exp.id}/edit`)}
                  style={{
                    borderBottom: '1px solid var(--color-border)',
                    backgroundColor: i % 2 === 0 ? 'var(--color-surface)' : 'var(--color-bg)',
                    cursor: 'pointer',
                    transition: 'background-color 0.1s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-primary-light)')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = i % 2 === 0 ? 'var(--color-surface)' : 'var(--color-bg)')}
                >
                  <td style={{ padding: '12px 16px', whiteSpace: 'nowrap' }}>{formatDate(exp.date)}</td>
                  <td style={{ padding: '12px 16px' }}><CategoryBadge name={exp.category.name} /></td>
                  <td style={{ padding: '12px 16px', maxWidth: 250, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{exp.description || '-'}</td>
                  <td style={{ padding: '12px 16px', textAlign: 'right', fontFamily: 'var(--font-mono)', fontWeight: 500 }}>{formatCurrency(exp.amount)}</td>
                  <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                    <button
                      onClick={(e) => { e.stopPropagation(); navigate(`/expenses/${exp.id}/edit`); }}
                      title="Edit"
                      style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, color: 'var(--color-text-secondary)' }}
                    >
                      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125" />
                      </svg>
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); setDeleteTarget(exp); }}
                      title="Delete"
                      style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, color: 'var(--color-danger)' }}
                    >
                      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={{ padding: '0 16px 16px' }}>
            {renderPagination()}
          </div>
        </div>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete Expense"
        message="Are you sure you want to delete this expense? This action cannot be undone."
        confirmLabel="Delete"
        confirmVariant="danger"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />
    </div>
  );
}
