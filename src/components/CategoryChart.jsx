import { useState } from 'react'
import { formatCurrency } from '../utils/format'
import { categoryLabel, categorySlot } from '../utils/categories'

export default function CategoryChart({ transactions }) {
  const [hovered, setHovered] = useState(null)

  const totals = new Map()
  for (const t of transactions) {
    if (t.type !== 'despesa') continue
    totals.set(t.category, (totals.get(t.category) ?? 0) + t.amount)
  }

  const rows = [...totals.entries()]
    .map(([category, amount]) => ({ category, amount, slot: categorySlot(category) }))
    .sort((a, b) => b.amount - a.amount)

  const max = rows.reduce((m, r) => Math.max(m, r.amount), 0) || 1

  if (rows.length === 0) {
    return (
      <div className="chart-card">
        <h3 className="chart-card__title">Despesas por categoria</h3>
        <p className="chart-card__empty">Sem despesas registradas ainda.</p>
      </div>
    )
  }

  return (
    <div className="chart-card">
      <h3 className="chart-card__title">Despesas por categoria</h3>
      <div className="category-chart" role="img" aria-label="Gráfico de despesas por categoria">
        {rows.map((row) => {
          const pct = (row.amount / max) * 100
          const isHovered = hovered === row.category
          const labelFits = pct > 55
          return (
            <div
              key={row.category}
              className="category-chart__row"
              onPointerEnter={() => setHovered(row.category)}
              onPointerLeave={() => setHovered(null)}
              onFocus={() => setHovered(row.category)}
              onBlur={() => setHovered(null)}
              tabIndex={0}
            >
              <span className="category-chart__label">{categoryLabel(row.category)}</span>
              <span className="category-chart__track">
                <span
                  className={`category-chart__bar ${isHovered ? 'category-chart__bar--hover' : ''}`}
                  style={{ width: `${pct}%`, background: `var(--series-${row.slot})` }}
                >
                  {labelFits && (
                    <span className="category-chart__value category-chart__value--inside">
                      {formatCurrency(row.amount)}
                    </span>
                  )}
                </span>
                {!labelFits && (
                  <span className="category-chart__value category-chart__value--outside">
                    {formatCurrency(row.amount)}
                  </span>
                )}
              </span>
              {isHovered && (
                <div className="chart-tooltip" role="tooltip">
                  <span className="chart-tooltip__key" style={{ background: `var(--series-${row.slot})` }} />
                  <span className="chart-tooltip__value">{formatCurrency(row.amount)}</span>
                  <span className="chart-tooltip__label">{categoryLabel(row.category)}</span>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
