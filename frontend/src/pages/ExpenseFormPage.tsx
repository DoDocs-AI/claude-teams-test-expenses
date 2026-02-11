import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { expensesApi } from '../api/expenses';
import { categoriesApi } from '../api/categories';
import { useToast } from '../context/ToastContext';
import { Input } from '../components/Input';
import { Select } from '../components/Select';
import { Button } from '../components/Button';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { todayString } from '../utils/format';
import type { Category } from '../types';

export function ExpenseFormPage() {
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [categories, setCategories] = useState<Category[]>([]);
  const [amount, setAmount] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [date, setDate] = useState(todayString());
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(isEdit);
  const [showDelete, setShowDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    categoriesApi.list().then(setCategories).catch(() => {
      addToast('Failed to load categories.', 'error');
    });
  }, []);

  useEffect(() => {
    if (isEdit && id) {
      setLoadingData(true);
      expensesApi
        .get(Number(id))
        .then((exp) => {
          setAmount(String(exp.amount));
          setCategoryId(String(exp.category.id));
          setDate(exp.date);
          setDescription(exp.description || '');
        })
        .catch(() => {
          addToast('Failed to load expense.', 'error');
          navigate('/expenses');
        })
        .finally(() => setLoadingData(false));
    }
  }, [id, isEdit]);

  const validate = () => {
    const errs: Record<string, string> = {};
    const amt = parseFloat(amount);
    if (!amount || isNaN(amt) || amt <= 0) errs.amount = 'Amount must be a positive number';
    if (!categoryId) errs.categoryId = 'Please select a category';
    if (!date) {
      errs.date = 'Date is required';
    } else if (date > todayString()) {
      errs.date = 'Date cannot be in the future';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const payload = {
        amount: parseFloat(amount),
        categoryId: Number(categoryId),
        date,
        description: description || undefined,
      };

      if (isEdit && id) {
        await expensesApi.update(Number(id), payload);
        addToast('Expense updated.', 'success');
      } else {
        await expensesApi.create(payload);
        addToast('Expense added.', 'success');
      }
      navigate('/expenses');
    } catch {
      addToast(isEdit ? 'Could not update expense. Please try again.' : 'Could not save expense. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    setDeleting(true);
    try {
      await expensesApi.delete(Number(id));
      addToast('Expense deleted.', 'success');
      navigate('/expenses');
    } catch {
      addToast('Could not delete expense. Please try again.', 'error');
    } finally {
      setDeleting(false);
      setShowDelete(false);
    }
  };

  if (loadingData) {
    return (
      <div style={{ padding: 40, textAlign: 'center' }}>
        <p style={{ color: 'var(--color-text-secondary)' }}>Loading...</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 480, margin: '0 auto' }}>
      <h1 style={{ marginBottom: 24 }}>{isEdit ? 'Edit Expense' : 'Add Expense'}</h1>

      <div
        style={{
          backgroundColor: 'var(--color-surface)',
          borderRadius: 'var(--radius-card)',
          boxShadow: 'var(--shadow-card)',
          padding: 24,
        }}
      >
        <form onSubmit={handleSubmit}>
          <Input
            label="Amount *"
            type="number"
            step="0.01"
            min="0.01"
            prefix="$"
            placeholder="0.00"
            aria-label="Expense amount in dollars"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            error={errors.amount}
          />

          <Select
            label="Category *"
            aria-label="Expense category"
            placeholder="Select a category"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            options={categories.map((c) => ({ value: c.id, label: c.name }))}
            error={errors.categoryId}
          />

          <Input
            label="Date *"
            type="date"
            aria-label="Expense date"
            value={date}
            max={todayString()}
            onChange={(e) => setDate(e.target.value)}
            error={errors.date}
          />

          <Input
            label="Description (optional)"
            type="text"
            maxLength={200}
            placeholder="What was this expense for?"
            aria-label="Expense description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 24 }}>
            <Button variant="ghost" type="button" onClick={() => navigate('/expenses')}>
              Cancel
            </Button>
            <Button type="submit" loading={loading}>
              {isEdit ? 'Save Changes' : 'Save Expense'}
            </Button>
          </div>
        </form>

        {isEdit && (
          <div style={{ marginTop: 24, paddingTop: 16, borderTop: '1px solid var(--color-border)', textAlign: 'center' }}>
            <Button variant="danger" onClick={() => setShowDelete(true)}>
              Delete Expense
            </Button>
          </div>
        )}
      </div>

      <ConfirmDialog
        open={showDelete}
        title="Delete Expense"
        message="Are you sure you want to delete this expense? This action cannot be undone."
        confirmLabel="Delete"
        confirmVariant="danger"
        onConfirm={handleDelete}
        onCancel={() => setShowDelete(false)}
        loading={deleting}
      />
    </div>
  );
}
