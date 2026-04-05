import React, { createContext, useContext, useState, useEffect } from 'react'

export interface Transaction {
  id: string
  date: string
  amount: number
  category: string
  type: 'income' | 'expense'
  description: string
}

export interface FinanceContextType {
  transactions: Transaction[]
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void
  deleteTransaction: (id: string) => void
  updateTransaction: (id: string, updates: Partial<Transaction>) => void
  getBalance: () => number
  getIncome: () => number
  getExpenses: () => number
  role: 'viewer' | 'admin'
  setRole: (role: 'viewer' | 'admin') => void
  darkMode: boolean
  setDarkMode: (mode: boolean) => void
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined)

const MOCK_DATA: Transaction[] = [
  { id: '1', date: '2026-04-01', amount: 5000, category: 'Salary', type: 'income', description: 'Monthly Salary' },
  { id: '2', date: '2026-03-28', amount: 1200, category: 'Rent', type: 'expense', description: 'Apartment Rent' },
  { id: '3', date: '2026-03-25', amount: 450, category: 'Groceries', type: 'expense', description: 'Supermarket' },
  { id: '4', date: '2026-03-22', amount: 100, category: 'Entertainment', type: 'expense', description: 'Movie Tickets' },
  { id: '5', date: '2026-03-20', amount: 2000, category: 'Freelance', type: 'income', description: 'Project Payment' },
  { id: '6', date: '2026-03-18', amount: 250, category: 'Utilities', type: 'expense', description: 'Electric Bill' },
  { id: '7', date: '2026-03-15', amount: 80, category: 'Dining', type: 'expense', description: 'Restaurant' },
  { id: '8', date: '2026-03-12', amount: 150, category: 'Health', type: 'expense', description: 'Gym Membership' },
  { id: '9', date: '2026-03-10', amount: 35, category: 'Transport', type: 'expense', description: 'Fuel' },
  { id: '10', date: '2026-03-05', amount: 1500, category: 'Bonus', type: 'income', description: 'Performance Bonus' },
]

export function FinanceProvider({ children }: { children: React.ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>(MOCK_DATA)
  const [role, setRole] = useState<'viewer' | 'admin'>('viewer')
  const [darkMode, setDarkMode] = useState(false)

  useEffect(() => {
    const savedTransactions = localStorage.getItem('transactions')
    const savedRole = localStorage.getItem('role')
    const savedDarkMode = localStorage.getItem('darkMode')

    if (savedTransactions) {
      try {
        setTransactions(JSON.parse(savedTransactions))
      } catch (e) {
        console.error('Failed to load transactions', e)
      }
    }

    if (savedRole) setRole(savedRole as 'viewer' | 'admin')
    if (savedDarkMode) setDarkMode(JSON.parse(savedDarkMode))
  }, [])

  useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(transactions))
  }, [transactions])

  useEffect(() => {
    localStorage.setItem('role', role)
  }, [role])

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode))
  }, [darkMode])

  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now().toString(),
    }
    setTransactions([newTransaction, ...transactions])
  }

  const deleteTransaction = (id: string) => {
    setTransactions(transactions.filter(t => t.id !== id))
  }

  const updateTransaction = (id: string, updates: Partial<Transaction>) => {
    setTransactions(transactions.map(t => (t.id === id ? { ...t, ...updates } : t)))
  }

  const getBalance = () => {
    return transactions.reduce((acc, t) => (t.type === 'income' ? acc + t.amount : acc - t.amount), 0)
  }

  const getIncome = () => {
    return transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0)
  }

  const getExpenses = () => {
    return transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0)
  }

  const value: FinanceContextType = {
    transactions,
    addTransaction,
    deleteTransaction,
    updateTransaction,
    getBalance,
    getIncome,
    getExpenses,
    role,
    setRole,
    darkMode,
    setDarkMode,
  }

  return <FinanceContext.Provider value={value}>{children}</FinanceContext.Provider>
}

export function useFinance() {
  const context = useContext(FinanceContext)
  if (context === undefined) {
    throw new Error('useFinance must be used within FinanceProvider')
  }
  return context
}
