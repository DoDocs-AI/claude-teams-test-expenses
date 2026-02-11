import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { authApi } from '../api/auth';
import { Input } from '../components/Input';
import { Button } from '../components/Button';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!email.trim()) errs.email = 'Email is required';
    if (!password.trim()) errs.password = 'Password is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setServerError('');
    if (!validate()) return;

    setLoading(true);
    try {
      const response = await authApi.login({ email, password });
      login(response.token, response.user);
      addToast('Welcome back!', 'success');
      navigate('/dashboard');
    } catch (err: unknown) {
      const error = err as { error?: string; message?: string };
      if (error?.error === 'INVALID_CREDENTIALS') {
        setServerError('Invalid email or password.');
      } else {
        setServerError('Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: 'var(--color-bg)',
        padding: 16,
      }}
    >
      <div style={{ width: '100%', maxWidth: 400 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--color-primary)"
            strokeWidth={1.5}
            style={{ marginBottom: 8 }}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
          </svg>
          <h1>Expense Tracker</h1>
        </div>

        <div
          style={{
            backgroundColor: 'var(--color-surface)',
            borderRadius: 'var(--radius-card)',
            boxShadow: 'var(--shadow-card)',
            padding: 24,
          }}
        >
          {serverError && (
            <div
              style={{
                padding: '10px 12px',
                backgroundColor: '#FEF2F2',
                border: '1px solid #FECACA',
                borderRadius: 'var(--radius-input)',
                color: 'var(--color-danger)',
                fontSize: 13,
                marginBottom: 16,
              }}
            >
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              aria-label="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
              onBlur={() => {
                if (!email.trim()) setErrors((p) => ({ ...p, email: 'Email is required' }));
                else setErrors((p) => { const { email: _, ...rest } = p; return rest; });
              }}
            />
            <Input
              label="Password"
              type="password"
              placeholder="Enter your password"
              aria-label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
              onBlur={() => {
                if (!password.trim()) setErrors((p) => ({ ...p, password: 'Password is required' }));
                else setErrors((p) => { const { password: _, ...rest } = p; return rest; });
              }}
            />
            <Button
              type="submit"
              loading={loading}
              style={{ width: '100%', marginTop: 8 }}
            >
              Log In
            </Button>
          </form>

          <p style={{ textAlign: 'center', marginTop: 16, color: 'var(--color-text-secondary)' }}>
            Don't have an account?{' '}
            <Link to="/register">Create account</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
