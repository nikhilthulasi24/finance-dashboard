import { useFinance } from '../context/FinanceContext'
import { Moon, Sun } from 'lucide-react'

interface HeaderProps {
  activeTab: 'dashboard' | 'transactions' | 'insights'
  setActiveTab: (tab: 'dashboard' | 'transactions' | 'insights') => void
}

function Header({ activeTab, setActiveTab }: HeaderProps) {
  const { role, setRole, darkMode, setDarkMode } = useFinance()

  return (
    <header className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-700 sticky top-0 z-50">
      <div className="container mx-auto px-4 max-w-7xl py-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">$</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Finance Dashboard</h1>
          </div>

          <div className="flex items-center gap-4">
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as 'viewer' | 'admin')}
              className="px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-600 cursor-pointer text-sm font-medium"
            >
              <option value="viewer">Viewer Mode</option>
              <option value="admin">Admin Mode</option>
            </select>

            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              title="Toggle dark mode"
            >
              {darkMode ? (
                <Sun className="w-5 h-5 text-yellow-500" />
              ) : (
                <Moon className="w-5 h-5 text-slate-600" />
              )}
            </button>
          </div>
        </div>

        <nav className="flex gap-2">
          {(['dashboard', 'transactions', 'insights'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors capitalize ${
                activeTab === tab
                  ? 'bg-blue-500 text-white'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>
    </header>
  )
}

export default Header
