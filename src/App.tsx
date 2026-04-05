import { useState } from 'react'
import { FinanceProvider } from './context/FinanceContext'
import Header from './components/Header'
import Dashboard from './components/Dashboard'
import Transactions from './components/Transactions'
import Insights from './components/Insights'

function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'transactions' | 'insights'>('dashboard')

  return (
    <FinanceProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
        <Header activeTab={activeTab} setActiveTab={setActiveTab} />
        
        <main className="container mx-auto px-4 py-8 max-w-7xl">
          {activeTab === 'dashboard' && <Dashboard />}
          {activeTab === 'transactions' && <Transactions />}
          {activeTab === 'insights' && <Insights />}
        </main>

        <footer className="border-t border-slate-200 dark:border-slate-700 mt-12 py-6 text-center text-slate-600 dark:text-slate-400 text-sm">
          <p>Finance Dashboard © 2026. All transactions are simulated with mock data.</p>
        </footer>
      </div>
    </FinanceProvider>
  )
}

export default App
