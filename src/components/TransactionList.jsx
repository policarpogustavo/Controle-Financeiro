import { useState } from 'react'
import { formatCurrency, formatDate } from '../utils/format'
import { CATEGORIES, categoryLabel } from '../utils/categories'

function toEditForm(t) {
  return {
    description: t.description,
    amount: String(t.amount),
    type: t.type,
    category: t.category,
    date: t.date,
  }
}

export default function TransactionList({ transactions, onDelete, onUpdate }) {
  const [editingId, setEditingId] = useState(null)
  const [editForm, setEditForm] = useState(null)

  const sorted = [...transactions].sort((a, b) => b.date.localeCompare(a.date))

  function startEdit(t) {
    setEditingId(t.id)
    setEditForm(toEditForm(t))
  }

  function cancelEdit() {
    setEditingId(null)
    setEditForm(null)
  }

  function handleEditChange(event) {
    const { name, value } = event.target
    setEditForm((prev) => ({ ...prev, [name]: value }))
  }

  function saveEdit(event) {
    event.preventDefault()
    const amount = Number(editForm.amount)
    if (!editForm.description.trim() || !amount || amount <= 0) return

    onUpdate(editingId, {
      description: editForm.description.trim(),
      amount,
      type: editForm.type,
      category: editForm.category,
      date: editForm.date,
    })
    cancelEdit()
  }

  return (
    <section className="transaction-list" aria-label="Lista de transações">
      {sorted.length === 0 ? (
        <p className="transaction-list__empty">Nenhuma transação neste período.</p>
      ) : (
        <table className="transaction-list__table">
          <thead>
            <tr>
              <th scope="col">Data</th>
              <th scope="col">Descrição</th>
              <th scope="col">Categoria</th>
              <th scope="col" className="transaction-list__amount-head">Valor</th>
              <th scope="col" aria-label="Ações"></th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((t) =>
              editingId === t.id ? (
                <tr key={t.id} className="transaction-list__row--editing">
                  <td>
                    <input
                      type="date"
                      name="date"
                      value={editForm.date}
                      onChange={handleEditChange}
                      className="transaction-list__edit-input"
                      required
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      name="description"
                      value={editForm.description}
                      onChange={handleEditChange}
                      className="transaction-list__edit-input"
                      required
                    />
                  </td>
                  <td>
                    <div className="transaction-list__edit-group">
                      <select
                        name="category"
                        value={editForm.category}
                        onChange={handleEditChange}
                        className="transaction-list__edit-input"
                      >
                        {CATEGORIES.map((cat) => (
                          <option key={cat.id} value={cat.id}>
                            {cat.label}
                          </option>
                        ))}
                      </select>
                      <select
                        name="type"
                        value={editForm.type}
                        onChange={handleEditChange}
                        className="transaction-list__edit-input"
                      >
                        <option value="despesa">Despesa</option>
                        <option value="receita">Receita</option>
                      </select>
                    </div>
                  </td>
                  <td className="transaction-list__amount-head">
                    <input
                      type="number"
                      name="amount"
                      min="0.01"
                      step="0.01"
                      value={editForm.amount}
                      onChange={handleEditChange}
                      className="transaction-list__edit-input transaction-list__edit-input--amount"
                      required
                    />
                  </td>
                  <td>
                    <div className="transaction-list__actions">
                      <button type="button" className="transaction-list__save" onClick={saveEdit}>
                        Salvar
                      </button>
                      <button type="button" className="transaction-list__cancel" onClick={cancelEdit}>
                        Cancelar
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                <tr key={t.id}>
                  <td className="transaction-list__date">{formatDate(t.date)}</td>
                  <td>{t.description}</td>
                  <td>{categoryLabel(t.category)}</td>
                  <td
                    className={`transaction-list__amount ${
                      t.type === 'receita' ? 'transaction-list__amount--good' : 'transaction-list__amount--critical'
                    }`}
                  >
                    {t.type === 'receita' ? '+' : '-'} {formatCurrency(t.amount)}
                  </td>
                  <td>
                    <div className="transaction-list__actions">
                      <button
                        type="button"
                        className="transaction-list__edit"
                        onClick={() => startEdit(t)}
                        aria-label={`Editar ${t.description}`}
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        className="transaction-list__delete"
                        onClick={() => onDelete(t.id)}
                        aria-label={`Excluir ${t.description}`}
                      >
                        Excluir
                      </button>
                    </div>
                  </td>
                </tr>
              ),
            )}
          </tbody>
        </table>
      )}
    </section>
  )
}
