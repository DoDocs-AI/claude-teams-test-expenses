import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';
import { reportsApi } from '../api/reports';
import { expensesApi } from '../api/expenses';
import { formatCurrency, formatShortDate, getMonthName, getShortMonthName } from '../utils/format';
import { getCategoryColor } from '../utils/categoryColors';
import { CategoryBadge } from '../components/CategoryBadge';
import { CardSkeleton } from '../components/Skeleton';
import { Button } from '../components/Button';
import type { MonthlySummary, CategoryBreakdown, MonthlyTrend, Expense } from '../types';

export function DashboardPage() {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());

  const [summary, setSummary] = useState<MonthlySummary | null>(null);
  const [categoryData, setCategoryData] = useState<CategoryBreakdown[]>([]);
  const [trendData, setTrendData] = useState<MonthlyTrend[]>([]);
  const [recentExpenses, setRecentExpenses] = useState<Expense[]>([]);

  const [loadingSummary, setLoadingSummary] = useState(true);
  const [loadingCategory, setLoadingCategory] = useState(true);
  const [loadingTrend, setLoadingTrend] = useState(true);
  const [loadingRecent, setLoadingRecent] = useState(true);

  const [errorSummary, setErrorSummary] = useState(false);
  const [errorCategory, setErrorCategory] = useState(false);
  const [errorTrend, setErrorTrend] = useState(false);
  const [errorRecent, setErrorRecent] = useState(false);

  const fetchSummary = async () => {
    setLoadingSummary(true);
    setErrorSummary(false);
    try {
      const data = await reportsApi.summary({ month, year });
      setSummary(data);
    } catch {
      setErrorSummary(true);
    } finally {
      setLoadingSummary(false);
    }
  };

  const fetchCategory = async () => {
    setLoadingCategory(true);
    setErrorCategory(false);
    try {
      const data = await reportsApi.byCategory({ month, year });
      setCategoryData(data);
    } catch {
      setErrorCategory(true);
    } finally {
      setLoadingCategory(false);
    }
  };

  const fetchTrend = async () => {
    setLoadingTrend(true);
    setErrorTrend(false);
    try {
      const data = await reportsApi.monthlyTrend({ year });
      setTrendData(data);
    } catch {
      setErrorTrend(true);
    } finally {
      setLoadingTrend(false);
    }
  };

  const fetchRecent = async () => {
    setLoadingRecent(true);
    setErrorRecent(false);
    try {
      const data = await expensesApi.list({ page: 0, size: 5 });
      setRecentExpenses(data.content);
    } catch {
      setErrorRecent(true);
    } finally {
      setLoadingRecent(false);
    }
  };

  useEffect(() => {
    fetchSummary();
    fetchCategory();
    fetchTrend();
    fetchRecent();
  }, [month, year]);

  const changeMonth = (delta: number) => {
    let m = month + delta;
    let y = year;
    if (m > 12) { m = 1; y++; }
    if (m < 1) { m = 12; y--; }
    setMonth(m);
    setYear(y);
  };

  const cardStyle: React.CSSProperties = {
    padding: 20,
    backgroundColor: 'var(--color-surface)',
    borderRadius: 'var(--radius-card)',
    boxShadow: 'var(--shadow-card)',
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <h1>Dashboard</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button onClick={() => changeMonth(-1)} style={{ background: 'none', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-btn)', padding: '6px 10px', cursor: 'pointer' }}>&lt;</button>
          <span style={{ minWidth: 140, textAlign: 'center', fontWeight: 500 }}>{getMonthName(month)} {year}</span>
          <button onClick={() => changeMonth(1)} style={{ background: 'none', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-btn)', padding: '6px 10px', cursor: 'pointer' }}>&gt;</button>
        </div>
      </div>

      {/* Summary cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 24 }}>
        {loadingSummary ? (
          <>
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </>
        ) : errorSummary ? (
          <div style={{ ...cardStyle, gridColumn: '1 / -1' }}>
            <p style={{ color: 'var(--color-danger)' }}>Failed to load summary.</p>
            <Button variant="secondary" onClick={fetchSummary} style={{ marginTop: 8 }}>Retry</Button>
          </div>
        ) : summary ? (
          <>
            <div style={cardStyle}>
              <p style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginBottom: 4 }}>Total Spent</p>
              <p style={{ fontSize: 20, fontWeight: 600, fontFamily: 'var(--font-mono)' }}>{formatCurrency(summary.totalSpent)}</p>
            </div>
            <div style={cardStyle}>
              <p style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginBottom: 4 }}>Budget Remaining</p>
              <p style={{
                fontSize: 20,
                fontWeight: 600,
                fontFamily: 'var(--font-mono)',
                color: summary.budgetRemaining !== null
                  ? (summary.budgetRemaining >= 0 ? 'var(--color-success)' : 'var(--color-danger)')
                  : 'var(--color-text-secondary)',
              }}>
                {summary.budgetRemaining !== null ? formatCurrency(summary.budgetRemaining) : 'No budget'}
              </p>
            </div>
            <div style={cardStyle}>
              <p style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginBottom: 4 }}>Transactions</p>
              <p style={{ fontSize: 20, fontWeight: 600 }}>{summary.transactionCount}</p>
            </div>
            <div style={cardStyle}>
              <p style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginBottom: 4 }}>Top Category</p>
              {summary.topCategory ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                  <span style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: getCategoryColor(summary.topCategory.name) }} />
                  <span style={{ fontWeight: 600 }}>{summary.topCategory.name}</span>
                </div>
              ) : (
                <p style={{ color: 'var(--color-text-secondary)' }}>-</p>
              )}
            </div>
          </>
        ) : null}
      </div>

      {/* Charts row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 16, marginBottom: 24 }}>
        {/* Category Breakdown */}
        <div style={cardStyle}>
          <h3 style={{ marginBottom: 16 }}>Category Breakdown</h3>
          {loadingCategory ? (
            <div style={{ height: 250, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <p style={{ color: 'var(--color-text-secondary)' }}>Loading...</p>
            </div>
          ) : errorCategory ? (
            <div>
              <p style={{ color: 'var(--color-danger)' }}>Failed to load.</p>
              <Button variant="secondary" onClick={fetchCategory} style={{ marginTop: 8 }}>Retry</Button>
            </div>
          ) : categoryData.length === 0 ? (
            <div style={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <p style={{ color: 'var(--color-text-secondary)' }}>No spending data for this month</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={categoryData}
                  dataKey="totalAmount"
                  nameKey="category.name"
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={90}
                  paddingAngle={2}
                >
                  {categoryData.map((entry) => (
                    <Cell key={entry.category.id} fill={getCategoryColor(entry.category.name)} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                <Legend
                  formatter={(value: string) => {
                    const item = categoryData.find((c) => c.category.name === value);
                    return `${value} (${item?.percentage.toFixed(1)}%)`;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Monthly Trend */}
        <div style={cardStyle}>
          <h3 style={{ marginBottom: 16 }}>Monthly Trend</h3>
          {loadingTrend ? (
            <div style={{ height: 250, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <p style={{ color: 'var(--color-text-secondary)' }}>Loading...</p>
            </div>
          ) : errorTrend ? (
            <div>
              <p style={{ color: 'var(--color-danger)' }}>Failed to load.</p>
              <Button variant="secondary" onClick={fetchTrend} style={{ marginTop: 8 }}>Retry</Button>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis
                  dataKey="month"
                  tickFormatter={(m: number) => getShortMonthName(m)}
                />
                <YAxis tickFormatter={(v: number) => `$${v}`} />
                <Tooltip
                  formatter={(value) => formatCurrency(Number(value))}
                  labelFormatter={(m) => `${getMonthName(Number(m))} ${year}`}
                />
                <Bar dataKey="totalSpent" fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Recent Expenses */}
      <div style={cardStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h3>Recent Expenses</h3>
          <Link to="/expenses" style={{ fontSize: 13, fontWeight: 500 }}>View All &gt;</Link>
        </div>
        {loadingRecent ? (
          <p style={{ color: 'var(--color-text-secondary)' }}>Loading...</p>
        ) : errorRecent ? (
          <div>
            <p style={{ color: 'var(--color-danger)' }}>Failed to load.</p>
            <Button variant="secondary" onClick={fetchRecent} style={{ marginTop: 8 }}>Retry</Button>
          </div>
        ) : recentExpenses.length === 0 ? (
          <p style={{ color: 'var(--color-text-secondary)' }}>No expenses yet.</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <tbody>
              {recentExpenses.map((exp) => (
                <tr key={exp.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <td style={{ padding: '10px 8px 10px 0', color: 'var(--color-text-secondary)', whiteSpace: 'nowrap' }}>
                    {formatShortDate(exp.date)}
                  </td>
                  <td style={{ padding: '10px 8px' }}>
                    <CategoryBadge name={exp.category.name} />
                  </td>
                  <td style={{ padding: '10px 8px', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {exp.description || '-'}
                  </td>
                  <td style={{ padding: '10px 0 10px 8px', textAlign: 'right', fontFamily: 'var(--font-mono)', fontWeight: 500 }}>
                    {formatCurrency(exp.amount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
