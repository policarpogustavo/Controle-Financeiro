import { useState } from 'react'
import { formatCurrency, monthLabel } from '../utils/format'

const PLOT = { width: 640, height: 240, padTop: 16, padBottom: 28, padLeft: 56, padRight: 16 }
const BAR_WIDTH = 22
const BAR_GAP = 2

function niceCeil(value) {
  if (value <= 0) return 100
  const magnitude = 10 ** Math.floor(Math.log10(value))
  const step = magnitude / 2
  return Math.ceil(value / step) * step
}

function lastSixMonths() {
  const now = new Date()
  const months = []
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    months.push({ year: d.getFullYear(), month: d.getMonth() })
  }
  return months
}

export default function MonthlyChart({ transactions }) {
  const [hovered, setHovered] = useState(null)

  const months = lastSixMonths()
  const data = months.map(({ year, month }) => {
    let receita = 0
    let despesa = 0
    for (const t of transactions) {
      const d = new Date(t.date)
      if (d.getFullYear() === year && d.getMonth() === month) {
        if (t.type === 'receita') receita += t.amount
        else despesa += t.amount
      }
    }
    return { year, month, label: monthLabel(year, month), receita, despesa }
  })

  const maxVal = niceCeil(Math.max(...data.map((d) => Math.max(d.receita, d.despesa))))
  const plotWidth = PLOT.width - PLOT.padLeft - PLOT.padRight
  const plotHeight = PLOT.height - PLOT.padTop - PLOT.padBottom
  const bandWidth = plotWidth / data.length
  const groupWidth = BAR_WIDTH * 2 + BAR_GAP

  const yTicks = [0, 0.25, 0.5, 0.75, 1].map((f) => Math.round(maxVal * f))

  function barHeight(value) {
    return (value / maxVal) * plotHeight
  }

  return (
    <div className="chart-card">
      <h3 className="chart-card__title">Receitas x despesas por mês</h3>
      <div className="monthly-chart">
        <svg
          viewBox={`0 0 ${PLOT.width} ${PLOT.height}`}
          className="monthly-chart__svg"
          role="img"
          aria-label="Gráfico de receitas e despesas por mês"
        >
          {yTicks.map((tick) => {
            const y = PLOT.padTop + plotHeight - barHeight(tick)
            return (
              <g key={tick}>
                <line
                  x1={PLOT.padLeft}
                  x2={PLOT.width - PLOT.padRight}
                  y1={y}
                  y2={y}
                  className="monthly-chart__gridline"
                />
                <text x={PLOT.padLeft - 8} y={y} className="monthly-chart__tick" textAnchor="end" dy="0.32em">
                  {tick >= 1000 ? `${(tick / 1000).toFixed(tick % 1000 === 0 ? 0 : 1)}k` : tick}
                </text>
              </g>
            )
          })}

          {data.map((d, i) => {
            const groupX = PLOT.padLeft + i * bandWidth + (bandWidth - groupWidth) / 2
            const baseY = PLOT.padTop + plotHeight
            const receitaH = barHeight(d.receita)
            const despesaH = barHeight(d.despesa)
            const receitaKey = `${d.year}-${d.month}-receita`
            const despesaKey = `${d.year}-${d.month}-despesa`

            return (
              <g key={`${d.year}-${d.month}`}>
                <rect
                  x={groupX}
                  y={baseY - receitaH}
                  width={BAR_WIDTH}
                  height={Math.max(receitaH, 1)}
                  rx={4}
                  className={`monthly-chart__bar monthly-chart__bar--good ${hovered === receitaKey ? 'monthly-chart__bar--hover' : ''}`}
                  onPointerEnter={() => setHovered(receitaKey)}
                  onPointerLeave={() => setHovered(null)}
                  tabIndex={0}
                  onFocus={() => setHovered(receitaKey)}
                  onBlur={() => setHovered(null)}
                />
                <rect
                  x={groupX + BAR_WIDTH + BAR_GAP}
                  y={baseY - despesaH}
                  width={BAR_WIDTH}
                  height={Math.max(despesaH, 1)}
                  rx={4}
                  className={`monthly-chart__bar monthly-chart__bar--critical ${hovered === despesaKey ? 'monthly-chart__bar--hover' : ''}`}
                  onPointerEnter={() => setHovered(despesaKey)}
                  onPointerLeave={() => setHovered(null)}
                  tabIndex={0}
                  onFocus={() => setHovered(despesaKey)}
                  onBlur={() => setHovered(null)}
                />

                <text
                  x={groupX + groupWidth / 2}
                  y={PLOT.height - 6}
                  textAnchor="middle"
                  className="monthly-chart__tick"
                >
                  {d.label}
                </text>

                {hovered === receitaKey && (
                  <foreignObject x={groupX - 40} y={baseY - receitaH - 46} width="120" height="40">
                    <div className="chart-tooltip chart-tooltip--floating">
                      <span className="chart-tooltip__key chart-tooltip__key--good" />
                      <span className="chart-tooltip__value">{formatCurrency(d.receita)}</span>
                      <span className="chart-tooltip__label">Receitas</span>
                    </div>
                  </foreignObject>
                )}
                {hovered === despesaKey && (
                  <foreignObject x={groupX - 20} y={baseY - despesaH - 46} width="120" height="40">
                    <div className="chart-tooltip chart-tooltip--floating">
                      <span className="chart-tooltip__key chart-tooltip__key--critical" />
                      <span className="chart-tooltip__value">{formatCurrency(d.despesa)}</span>
                      <span className="chart-tooltip__label">Despesas</span>
                    </div>
                  </foreignObject>
                )}
              </g>
            )
          })}
        </svg>
      </div>
      <div className="chart-legend">
        <span className="chart-legend__item">
          <span className="chart-legend__swatch chart-legend__swatch--good" />
          Receitas
        </span>
        <span className="chart-legend__item">
          <span className="chart-legend__swatch chart-legend__swatch--critical" />
          Despesas
        </span>
      </div>
    </div>
  )
}
