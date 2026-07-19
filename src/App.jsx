import { useMemo, useState } from 'react'
import StatTiles from './components/StatTiles'
import TransactionForm from './components/TransactionForm'
import TransactionList from './components/TransactionList'
import CategoryChart from './components/CategoryChart'
import MonthlyChart from './components/MonthlyChart'
import { loadTransactions, saveTransactions } from './utils/storage'
import './App.css'

function monthKey(date) {
  return date.slice(0, 7)
}

export default function App() {
  const [transactions, setTransactions] = useState(loadTransactions)
  const [monthFilter, setMonthFilter] = useState('all')

  const availableMonths = useMemo(() => {
    const set = new Set(transactions.map((t) => monthKey(t.date)))
    return [...set].sort().reverse()
  }, [transactions])

  const filtered = useMemo(() => {
    if (monthFilter === 'all') return transactions
    return transactions.filter((t) => monthKey(t.date) === monthFilter)
  }, [transactions, monthFilter])

  const { saldo, receitas, despesas } = useMemo(() => {
    let receitas = 0
    let despesas = 0
    for (const t of filtered) {
      if (t.type === 'receita') receitas += t.amount
      else despesas += t.amount
    }
    return { saldo: receitas - despesas, receitas, despesas }
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
      <header className="app__header">
        <span className="app__logo" aria-hidden="true">💰</span>
        <h1>Meu Dinheiro</h1>
        <p className="app__subtitle">Controle financeiro pessoal</p>
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

        <StatTiles saldo={saldo} receitas={receitas} despesas={despesas} />

        <div className="app__charts">
          <CategoryChart transactions={filtered} />
          <MonthlyChart transactions={transactions} />
        </div>

        <TransactionList transactions={filtered} onDelete={deleteTransaction} onUpdate={updateTransaction} />
      </main>
    </div>
  )
}
