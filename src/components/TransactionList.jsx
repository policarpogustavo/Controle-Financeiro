import { formatCurrency, formatDate } from '../utils/format'
import { categoryLabel } from '../utils/categories'

export default function TransactionList({ transactions, onDelete }) {
  const sorted = [...transactions].sort((a, b) => b.date.localeCompare(a.date))

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
            {sorted.map((t) => (
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
                  <button
                    type="button"
                    className="transaction-list__delete"
                    onClick={() => onDelete(t.id)}
                    aria-label={`Excluir ${t.description}`}
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  )
}
