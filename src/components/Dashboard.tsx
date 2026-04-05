import { useFinance } from '../context/FinanceContext'
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { TrendingUp, TrendingDown, DollarSign, ArrowUpRight, ArrowDownLeft } from 'lucide-react'

function Dashboard() {
  const { transactions, getBalance, getIncome, getExpenses } = useFinance()

  const balance = getBalance()
  const income = getIncome()
  const expenses = getExpenses()

  // Prepare data for balance trend
  const balanceTrend = transactions
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .reduce((acc: any[], t) => {
      const lastBalance = acc.length > 0 ? acc[acc.length - 1].balance : 0
      const newBalance = lastBalance + (t.type === 'income' ? t.amount : -t.amount)
      acc.push({
        date: new Date(t.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        balance: newBalance,
        fullDate: t.date,
      })
      return acc
    }, [])

  // Prepare data for spending breakdown
  const expensesByCategory = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc: any, t) => {
      const existing = acc.find((item: any) => item.name === t.category)
      if (existing) {
        existing.value += t.amount
      } else {
        acc.push({ name: t.category, value: t.amount })
      }
      return acc
    }, [])

  const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#06b6d4', '#6366f1']

  return (
    <div className="fade-in space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Balance Card */}
        <div className="glass rounded-xl p-6 border border-white/20 dark:border-slate-700/30">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Balance</h3>
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <p className={`text-3xl font-bold ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            ${balance.toFixed(2)}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Current account balance</p>
        </div>

        {/* Income Card */}
        <div className="glass rounded-xl p-6 border border-white/20 dark:border-slate-700/30">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-slate-600 dark:text-slate-400">Income</h3>
            <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
              <ArrowDownLeft className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <p className="text-3xl font-bold text-green-600">${income.toFixed(2)}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
            {transactions.filter(t => t.type === 'income').length} transactions
          </p>
        </div>

        {/* Expenses Card */}
        <div className="glass rounded-xl p-6 border border-white/20 dark:border-slate-700/30">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-slate-600 dark:text-slate-400">Expenses</h3>
            <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
              <ArrowUpRight className="w-5 h-5 text-red-600 dark:text-red-400" />
            </div>
          </div>
          <p className="text-3xl font-bold text-red-600">${expenses.toFixed(2)}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
            {transactions.filter(t => t.type === 'expense').length} transactions
          </p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Balance Trend Chart */}
        <div className="glass rounded-xl p-6 border border-white/20 dark:border-slate-700/30">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-500" />
            Balance Trend
          </h3>
          {balanceTrend.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={balanceTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(100,116,139,0.1)" />
                <XAxis dataKey="date" stroke="rgba(100,116,139,0.5)" style={{ fontSize: '12px' }} />
                <YAxis stroke="rgba(100,116,139,0.5)" style={{ fontSize: '12px' }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(15, 23, 42, 0.9)', 
                    border: '1px solid rgba(100,116,139,0.3)',
                    borderRadius: '8px'
                  }}
                  formatter={(value) => `$${typeof value === 'number' ? value.toFixed(2) : value}`}
                />
                <Line type="monotone" dataKey="balance" stroke="#3b82f6" strokeWidth={2} dot={{ fill: '#3b82f6', r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-slate-500 dark:text-slate-400">No data available</p>
          )}
        </div>

        {/* Spending Breakdown Chart */}
        <div className="glass rounded-xl p-6 border border-white/20 dark:border-slate-700/30">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <TrendingDown className="w-5 h-5 text-purple-500" />
            Spending Breakdown
          </h3>
          {expensesByCategory.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={expensesByCategory}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: $${value.toFixed(0)}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {expensesByCategory.map((_: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `$${typeof value === 'number' ? value.toFixed(2) : value}`} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-slate-500 dark:text-slate-400">No expense data available</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard
