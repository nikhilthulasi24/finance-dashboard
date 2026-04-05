import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { AlertCircle, TrendingUp } from 'lucide-react'
import { useFinance } from '../context/FinanceContext'

function Insights() {
  const { transactions, getIncome, getExpenses } = useFinance()

  // Highest spending category
  const spendingByCategory = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc: any, t) => {
      const existing = acc.find((item: any) => item.category === t.category)
      if (existing) {
        existing.total += t.amount
        existing.count += 1
      } else {
        acc.push({ category: t.category, total: t.amount, count: 1 })
      }
      return acc
    }, [])
    .sort((a: any, b: any) => b.total - a.total)

  // Monthly comparison
  const monthlyData = transactions.reduce((acc: any, t) => {
    const month = new Date(t.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    const existing = acc.find((item: any) => item.month === month)
    if (existing) {
      if (t.type === 'income') existing.income += t.amount
      else existing.expense += t.amount
    } else {
      acc.push({
        month,
        income: t.type === 'income' ? t.amount : 0,
        expense: t.type === 'expense' ? t.amount : 0,
      })
    }
    return acc
  }, [])

  const income = getIncome()
  const expenses = getExpenses()
  const balance = income - expenses
  const savingsRate = income > 0 ? ((income - expenses) / income * 100).toFixed(1) : '0'

  const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#06b6d4', '#6366f1']

  return (
    <div className="fade-in space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass rounded-xl p-6 border border-white/20 dark:border-slate-700/30">
          <h3 className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">Savings Rate</h3>
          <p className="text-3xl font-bold text-green-600">{savingsRate}%</p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Of income saved</p>
        </div>

        <div className="glass rounded-xl p-6 border border-white/20 dark:border-slate-700/30">
          <h3 className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">Avg Monthly Income</h3>
          <p className="text-3xl font-bold text-blue-600">${(income / (monthlyData.length || 1)).toFixed(0)}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Per month</p>
        </div>

        <div className="glass rounded-xl p-6 border border-white/20 dark:border-slate-700/30">
          <h3 className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">Avg Monthly Expense</h3>
          <p className="text-3xl font-bold text-red-600">${(expenses / (monthlyData.length || 1)).toFixed(0)}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Per month</p>
        </div>

        <div className="glass rounded-xl p-6 border border-white/20 dark:border-slate-700/30">
          <h3 className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">Total Transactions</h3>
          <p className="text-3xl font-bold text-purple-600">{transactions.length}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Recorded</p>
        </div>
      </div>

      {/* Top Spending Categories */}
      {spendingByCategory.length > 0 && (
        <div className="glass rounded-xl p-6 border border-white/20 dark:border-slate-700/30">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-red-500" />
            Top Spending Categories
          </h3>
          <div className="space-y-3">
            {spendingByCategory.slice(0, 5).map((item: any, index: number) => (
              <div key={item.category} className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                  <span className="text-slate-700 dark:text-slate-300">{item.category}</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">({item.count} transactions)</span>
                </div>
                <span className="font-semibold text-slate-900 dark:text-white">${item.total.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Monthly Comparison */}
      {monthlyData.length > 0 && (
        <div className="glass rounded-xl p-6 border border-white/20 dark:border-slate-700/30">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Monthly Income vs Expenses</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(100,116,139,0.1)" />
              <XAxis dataKey="month" stroke="rgba(100,116,139,0.5)" style={{ fontSize: '12px' }} />
              <YAxis stroke="rgba(100,116,139,0.5)" style={{ fontSize: '12px' }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(15, 23, 42, 0.9)', 
                  border: '1px solid rgba(100,116,139,0.3)',
                  borderRadius: '8px'
                }}
                formatter={(value) => `$${typeof value === 'number' ? value.toFixed(2) : value}`}
              />
              <Bar dataKey="income" fill="#10b981" name="Income" />
              <Bar dataKey="expense" fill="#ef4444" name="Expense" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Recommendations */}
      <div className="glass rounded-xl p-6 border border-white/20 dark:border-slate-700/30">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-yellow-500" />
          Insights & Recommendations
        </h3>
        <ul className="space-y-3 text-slate-700 dark:text-slate-300 text-sm">
          {spendingByCategory.length > 0 && (
            <li className="flex gap-2">
              <span className="text-yellow-500 font-bold">•</span>
              <span>Your highest spending category is <strong>{spendingByCategory[0].category}</strong> with ${spendingByCategory[0].total.toFixed(2)}. Consider reviewing these expenses.</span>
            </li>
          )}
          {balance > 0 && (
            <li className="flex gap-2">
              <span className="text-green-500 font-bold">✓</span>
              <span>Great job! You have a positive balance of ${balance.toFixed(2)}. Keep maintaining this good financial health.</span>
            </li>
          )}
          {balance < 0 && (
            <li className="flex gap-2">
              <span className="text-red-500 font-bold">!</span>
              <span>Your expenses exceed income by ${Math.abs(balance).toFixed(2)}. Consider reducing discretionary spending.</span>
            </li>
          )}
          {parseFloat(savingsRate) > 20 && (
            <li className="flex gap-2">
              <span className="text-green-500 font-bold">✓</span>
              <span>Excellent savings rate of {savingsRate}%! You're on track for financial goals.</span>
            </li>
          )}
          {transactions.length > 20 && (
            <li className="flex gap-2">
              <span className="text-blue-500 font-bold">•</span>
              <span>You have {transactions.length} transactions recorded. This detailed tracking will help better financial planning.</span>
            </li>
          )}
        </ul>
      </div>
    </div>
  )
}

export default Insights
