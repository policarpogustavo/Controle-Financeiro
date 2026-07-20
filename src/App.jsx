import { useEffect, useMemo, useState } from 'react'
import StatTiles from './components/StatTiles'
import TransactionForm from './components/TransactionForm'
import TransactionList from './components/TransactionList'
import CategoryChart from './components/CategoryChart'
import MonthlyChart from './components/MonthlyChart'
import { loadTransactions, saveTransactions } from './utils/storage'
import { applyTheme, getStoredTheme, setStoredTheme, systemPrefersDark } from './utils/theme'
import './App.css'

function monthKey(date) {
  return date.slice(0, 7)
}

function initialTheme() {
  return getStoredTheme() ?? (systemPrefersDark() ? 'dark' : 'light')
}

export default function App() {
  const [transactions, setTransactions] = useState(loadTransactions)
  const [monthFilter, setMonthFilter] = useState('all')
  const [theme, setTheme] = useState(initialTheme)

  useEffect(() => {
    applyTheme(theme)
    setStoredTheme(theme)
  }, [theme])

  function toggleTheme() {
    setTheme((current) => (current === 'dark' ? 'light' : 'dark'))
  }

  const availableMonths = useMemo(() => {
    const set = new Set(transactions.map((t) => monthKey(t.date)))
    return [...set].sort().reverse()
  }, [transactions])

  const filtered = useMemo(() => {
    if (monthFilter === 'all') return transactions
    return transactions.filter((t) => monthKey(t.date) === monthFilter)
  }, [transactions, monthFilter])

  const { saldo, entradas, saidas } = useMemo(() => {
    let entradas = 0
    let saidas = 0
    for (const t of filtered) {
      if (t.type === 'entrada') entradas += t.amount
      else saidas += t.amount
    }
    return { saldo: entradas - saidas, entradas, saidas }
  }, [filtered])

  function addTransaction(transaction) {
    const next = [transaction, ...transactions]
    setTransactions(next)
    saveTransactions(next)
  }

  function deleteTransaction(id) {
    const next = transactions.filter((t) => t.id !== id)
    setTransactions(next)
    saveTransactions(next)
  }

  function updateTransaction(id, updates) {
    const next = transactions.map((t) => (t.id === id ? { ...t, ...updates } : t))
    setTransactions(next)
    saveTransactions(next)
  }

  return (
    <div className="app">
      <header className="app__hero">
        <button
          type="button"
          className="app__theme-toggle"
          onClick={toggleTheme}
          aria-label={theme === 'dark' ? 'Mudar para tema claro' : 'Mudar para tema escuro'}
          title={theme === 'dark' ? 'Tema claro' : 'Tema escuro'}
        >
          {theme === 'dark' ? (
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <circle cx="12" cy="12" r="4.5" />
              <path d="M12 2.5v2.2M12 19.3v2.2M4.2 4.2l1.6 1.6M18.2 18.2l1.6 1.6M2.5 12h2.2M19.3 12h2.2M4.2 19.8l1.6-1.6M18.2 5.8l1.6-1.6" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.5 14.7A8.4 8.4 0 1 1 9.3 3.5a6.8 6.8 0 0 0 11.2 11.2Z" />
            </svg>
          )}
        </button>
        <span className="app__logo" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 19V10M11 19V5M18 19v-6" />
            <path d="M3 19h18" />
          </svg>
        </span>
        <h1>Painel Financeiro</h1>
        <p className="app__subtitle">Gestão financeira com visão executiva</p>
      </header>

      <main className="app__main">
        <TransactionForm onAdd={addTransaction} />

        <div className="app__filter-row">
          <label htmlFor="month-filter">Período</label>
          <select id="month-filter" value={monthFilter} onChange={(e) => setMonthFilter(e.target.value)}>
            <option value="all">Todos os meses</option>
            {availableMonths.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>

        <StatTiles saldo={saldo} entradas={entradas} saidas={saidas} />

        <div className="app__charts">
          <CategoryChart transactions={filtered} />
          <MonthlyChart transactions={transactions} />
        </div>

        <TransactionList
          transactions={filtered}
          onDelete={deleteTransaction}
          onUpdate={updateTransaction}
          hasAnyTransaction={transactions.length > 0}
        />
      </main>
    </div>
  )
}
