import { formatCurrency } from '../utils/format'

export default function StatTiles({ saldo, receitas, despesas }) {
  return (
    <section className="stat-tiles" aria-label="Resumo financeiro">
      <div className="stat-tile">
        <span className="stat-tile__label">Saldo</span>
        <span className={`stat-tile__value ${saldo < 0 ? 'stat-tile__value--negative' : ''}`}>
          {formatCurrency(saldo)}
        </span>
      </div>
      <div className="stat-tile">
        <span className="stat-tile__label">
          <span className="stat-tile__dot stat-tile__dot--good" aria-hidden="true" />
          Receitas
        </span>
        <span className="stat-tile__value">{formatCurrency(receitas)}</span>
      </div>
      <div className="stat-tile">
        <span className="stat-tile__label">
          <span className="stat-tile__dot stat-tile__dot--critical" aria-hidden="true" />
          Despesas
        </span>
        <span className="stat-tile__value">{formatCurrency(despesas)}</span>
      </div>
    </section>
  )
}
