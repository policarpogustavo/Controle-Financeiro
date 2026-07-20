import { useState } from 'react'
import { CATEGORIES } from '../utils/categories'

const today = () => new Date().toISOString().slice(0, 10)

const emptyForm = {
  description: '',
  amount: '',
  type: 'saida',
  category: 'outros',
  date: today(),
}

export default function TransactionForm({ onAdd }) {
  const [form, setForm] = useState(emptyForm)

  function handleChange(event) {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  function handleSubmit(event) {
    event.preventDefault()
    const amount = Number(form.amount)
    if (!form.description.trim() || !amount || amount <= 0) return

    onAdd({
      id: crypto.randomUUID(),
      description: form.description.trim(),
      amount,
      type: form.type,
      category: form.category,
      date: form.date,
    })
    setForm({ ...emptyForm, date: form.date })
  }

  return (
    <form className="transaction-form" onSubmit={handleSubmit}>
      <div className="transaction-form__field transaction-form__field--grow">
        <label htmlFor="description">Descrição</label>
        <input
          id="description"
          name="description"
          type="text"
          placeholder="Ex: Supermercado"
          value={form.description}
          onChange={handleChange}
          required
        />
      </div>

      <div className="transaction-form__field">
        <label htmlFor="amount">Valor (R$)</label>
        <input
          id="amount"
          name="amount"
          type="number"
          min="0.01"
          step="0.01"
          placeholder="0,00"
          value={form.amount}
          onChange={handleChange}
          required
        />
      </div>

      <div className="transaction-form__field">
        <label htmlFor="type">Tipo</label>
        <select id="type" name="type" value={form.type} onChange={handleChange}>
          <option value="saida">Saída</option>
          <option value="entrada">Entrada</option>
        </select>
      </div>

      <div className="transaction-form__field">
        <label htmlFor="category">Categoria</label>
        <select id="category" name="category" value={form.category} onChange={handleChange}>
          {CATEGORIES.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.label}
            </option>
          ))}
        </select>
      </div>

      <div className="transaction-form__field">
        <label htmlFor="date">Data</label>
        <input id="date" name="date" type="date" value={form.date} onChange={handleChange} required />
      </div>

      <button type="submit" className="transaction-form__submit">
        Adicionar
      </button>
    </form>
  )
}
