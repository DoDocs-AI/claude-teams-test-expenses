import { useState, useEffect } from 'react';
import { budgetsApi } from '../api/budgets';
import { formatCurrency, getMonthName } from '../utils/format';
import { Button } from '../components/Button';
import { useToast } from '../context/ToastContext';
import type { Budget } from '../types';

export function BudgetPage() {
  const { addToast } = useToast();
  const now = new Date();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();

  const [budget, setBudget] = useState<Budget | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Edit mode
  const [editing, setEditing] = useState(false);
  const [editAmount, setEditAmount] = useState('');
  const [editError, setEditError] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchBudget = async () => {
    setLoading(true);
    setError(false);
    try {
      const data = await budgetsApi.getMonthly({ month, year });
      setBudget(data);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBudget();
  }, []);

  const handleSave = async () => {
    const amt = parseFloat(editAmount);
    if (isNaN(amt) || amt <= 0) {
      setEditError('Please enter a valid positive number.');
      return;
    }
    setSaving(true);
    setEditError('');
    try {
      const data = await budgetsApi.setMonthly({ month, year, amount: amt });
      setBudget(data);
      addToast('Budget updated.', 'success');
      setEditing(false);
    } catch {
      addToast('Could not save budget. Please try again.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const startEdit = () => {
    setEditAmount(budget?.amount != null ? String(budget.amount) : '');
    setEditError('');
    setEditing(true);
  };

  const getProgressColor = (pct: number) => {
    if (pct > 100) return 'var(--color-danger)';
    if (pct > 75) return 'var(--color-warning)';
    return 'var(--color-success)';
  };

  const cardStyle: React.CSSProperties = {
    backgroundColor: 'var(--color-surface)',
    borderRadius: 'var(--radius-card)',
    boxShadow: 'var(--shadow-card)',
    padding: 24,
    marginBottom: 16,
  };

  if (loading) {
    return (
      <div>
        <h1 style={{ marginBottom: 24 }}>Monthly Budget</h1>
        <p style={{ color: 'var(--color-text-secondary)', textAlign: 'center', padding: 40 }}>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h1 style={{ marginBottom: 24 }}>Monthly Budget</h1>
        <div style={{ textAlign: 'center', padding: 40 }}>
          <p style={{ color: 'var(--color-danger)', marginBottom: 12 }}>Could not load budget.</p>
          <Button variant="secondary" onClick={fetchBudget}>Retry</Button>
        </div>
      </div>
    );
  }

  const hasBudget = budget && budget.amount !== null;
  const spent = budget?.spent ?? 0;
  const remaining = budget?.remaining ?? null;
  const budgetAmount = budget?.amount ?? 0;
  const spentPct = hasBudget ? (spent / budgetAmount) * 100 : 0;

  return (
    <div>
      <h1 style={{ marginBottom: 24 }}>Monthly Budget</h1>

      {/* Budget display/edit */}
      <div style={cardStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h3>Current Monthly Budget</h3>
          {!editing && hasBudget && (
            <Button variant="secondary" onClick={startEdit}>Edit</Button>
          )}
        </div>

        {!hasBudget && !editing ? (
          <div style={{ textAlign: 'center', padding: 20 }}>
            <p style={{ color: 'var(--color-text-secondary)', marginBottom: 16 }}>You haven't set a monthly budget yet.</p>
            <Button onClick={() => { setEditAmount(''); setEditing(true); }}>Set Budget</Button>
          </div>
        ) : editing ? (
          <div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <span style={{ color: 'var(--color-text-secondary)' }}>$</span>
              <input
                type="number"
                step="0.01"
                min="0"
                value={editAmount}
                onChange={(e) => { setEditAmount(e.target.value); setEditError(''); }}
                autoFocus
                style={{
                  flex: 1,
                  height: 40,
                  padding: '0 12px',
                  border: `1px solid ${editError ? 'var(--color-danger)' : 'var(--color-border)'}`,
                  borderRadius: 'var(--radius-input)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: 20,
                }}
              />
              <Button onClick={handleSave} loading={saving}>Save</Button>
              <Button variant="secondary" onClick={() => setEditing(false)}>Cancel</Button>
            </div>
            {editError && (
              <p style={{ color: 'var(--color-danger)', fontSize: 12, marginTop: 4 }}>{editError}</p>
            )}
          </div>
        ) : (
          <p style={{ fontSize: 28, fontWeight: 600, fontFamily: 'var(--font-mono)', color: 'var(--color-text)' }}>
            {formatCurrency(budgetAmount)}
          </p>
        )}
      </div>

      {/* Monthly summary */}
      {hasBudget && (
        <div style={cardStyle}>
          <h3 style={{ marginBottom: 16 }}>{getMonthName(month)} {year} Summary</h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 20 }}>
            <div>
              <p style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginBottom: 4 }}>Budget</p>
              <p style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{formatCurrency(budgetAmount)}</p>
            </div>
            <div>
              <p style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginBottom: 4 }}>Spent</p>
              <p style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{formatCurrency(spent)}</p>
            </div>
            <div>
              <p style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginBottom: 4 }}>Remaining</p>
              <p style={{
                fontFamily: 'var(--font-mono)',
                fontWeight: 600,
                color: remaining !== null && remaining >= 0 ? 'var(--color-success)' : 'var(--color-danger)',
              }}>
                {remaining !== null ? formatCurrency(remaining) : '-'}
              </p>
            </div>
          </div>

          {/* Progress bar */}
          <div style={{ position: 'relative' }}>
            <div
              style={{
                width: '100%',
                height: 12,
                backgroundColor: 'var(--color-border)',
                borderRadius: 6,
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  width: `${Math.min(spentPct, 100)}%`,
                  height: '100%',
                  backgroundColor: getProgressColor(spentPct),
                  borderRadius: 6,
                  transition: 'width 0.3s ease',
                }}
              />
            </div>
            <p style={{ textAlign: 'right', fontSize: 12, color: 'var(--color-text-secondary)', marginTop: 4 }}>
              {spentPct.toFixed(0)}%
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
