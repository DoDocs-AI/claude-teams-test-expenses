import { useState, useEffect } from 'react';
import { categoriesApi } from '../api/categories';
import { getCategoryColor } from '../utils/categoryColors';
import { Button } from '../components/Button';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { useToast } from '../context/ToastContext';
import type { Category } from '../types';

export function CategoriesPage() {
  const { addToast } = useToast();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Add form
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [addError, setAddError] = useState('');
  const [adding, setAdding] = useState(false);

  // Delete
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchCategories = async () => {
    setLoading(true);
    setError(false);
    try {
      const data = await categoriesApi.list();
      setCategories(data);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const defaultCategories = categories.filter((c) => c.isDefault);
  const customCategories = categories.filter((c) => !c.isDefault);

  const handleAdd = async () => {
    const name = newName.trim();
    if (!name) {
      setAddError('Category name is required.');
      return;
    }
    if (name.length > 50) {
      setAddError('Category name must be 50 characters or less.');
      return;
    }
    setAdding(true);
    setAddError('');
    try {
      await categoriesApi.create({ name });
      addToast('Category added.', 'success');
      setNewName('');
      setShowAddForm(false);
      fetchCategories();
    } catch (err: unknown) {
      const error = err as { error?: string };
      if (error?.error === 'CATEGORY_EXISTS') {
        setAddError('A category with this name already exists.');
      } else {
        setAddError('Could not save category. Please try again.');
      }
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await categoriesApi.delete(deleteTarget.id);
      addToast('Category deleted.', 'success');
      setDeleteTarget(null);
      fetchCategories();
    } catch {
      addToast('Could not delete category. Please try again.', 'error');
    } finally {
      setDeleting(false);
    }
  };

  const rowStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px 16px',
    borderBottom: '1px solid var(--color-border)',
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1>Categories</h1>
        {!showAddForm && (
          <Button onClick={() => setShowAddForm(true)}>+ Add Category</Button>
        )}
      </div>

      {loading ? (
        <p style={{ color: 'var(--color-text-secondary)', textAlign: 'center', padding: 40 }}>Loading categories...</p>
      ) : error ? (
        <div style={{ textAlign: 'center', padding: 40 }}>
          <p style={{ color: 'var(--color-danger)', marginBottom: 12 }}>Could not load categories.</p>
          <Button variant="secondary" onClick={fetchCategories}>Retry</Button>
        </div>
      ) : (
        <>
          {/* Default categories */}
          <div
            style={{
              backgroundColor: 'var(--color-surface)',
              borderRadius: 'var(--radius-card)',
              boxShadow: 'var(--shadow-card)',
              marginBottom: 24,
              overflow: 'hidden',
            }}
          >
            <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--color-border)' }}>
              <h3>Default Categories</h3>
            </div>
            {defaultCategories.map((cat) => (
              <div key={cat.id} style={rowStyle}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: getCategoryColor(cat.name) }} />
                  <span>{cat.name}</span>
                </div>
                <span style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>Default</span>
              </div>
            ))}
          </div>

          {/* Custom categories */}
          <div
            style={{
              backgroundColor: 'var(--color-surface)',
              borderRadius: 'var(--radius-card)',
              boxShadow: 'var(--shadow-card)',
              overflow: 'hidden',
            }}
          >
            <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--color-border)' }}>
              <h3>Custom Categories</h3>
            </div>

            {/* Add form */}
            {showAddForm && (
              <div style={{ padding: 16, borderBottom: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg)' }}>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => { setNewName(e.target.value); setAddError(''); }}
                    placeholder="Category name"
                    maxLength={50}
                    aria-label="New category name"
                    autoFocus
                    onKeyDown={(e) => { if (e.key === 'Enter') handleAdd(); }}
                    style={{
                      flex: 1,
                      height: 36,
                      padding: '0 12px',
                      border: `1px solid ${addError ? 'var(--color-danger)' : 'var(--color-border)'}`,
                      borderRadius: 'var(--radius-input)',
                    }}
                  />
                  <Button onClick={handleAdd} loading={adding} style={{ height: 36 }}>Save</Button>
                  <Button variant="secondary" onClick={() => { setShowAddForm(false); setNewName(''); setAddError(''); }} style={{ height: 36 }}>Cancel</Button>
                </div>
                {addError && (
                  <p style={{ color: 'var(--color-danger)', fontSize: 12, marginTop: 4 }}>{addError}</p>
                )}
              </div>
            )}

            {customCategories.length === 0 && !showAddForm ? (
              <div style={{ padding: 24, textAlign: 'center', color: 'var(--color-text-secondary)' }}>
                No custom categories yet.
              </div>
            ) : (
              customCategories.map((cat) => (
                <div key={cat.id} style={rowStyle}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: getCategoryColor(cat.name) }} />
                    <span>{cat.name}</span>
                  </div>
                  <div style={{ display: 'flex', gap: 4 }}>
                    <button
                      onClick={() => setDeleteTarget(cat)}
                      title="Delete"
                      style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, color: 'var(--color-danger)' }}
                    >
                      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete Category"
        message={`Delete category '${deleteTarget?.name}'? Expenses using this category will be reassigned to 'Other'.`}
        confirmLabel="Delete"
        confirmVariant="danger"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />
    </div>
  );
}
