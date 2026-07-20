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
    let entrada = 0
    let saida = 0
    for (const t of transactions) {
      const d = new Date(t.date)
      if (d.getFullYear() === year && d.getMonth() === month) {
        if (t.type === 'entrada') entrada += t.amount
        else saida += t.amount
      }
    }
    return { year, month, label: monthLabel(year, month), entrada, saida }
  })

  const maxVal = niceCeil(Math.max(...data.map((d) => Math.max(d.entrada, d.saida))))
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
      <h3 className="chart-card__title">Entradas x saídas por mês</h3>
      <div className="monthly-chart">
        <svg
          viewBox={`0 0 ${PLOT.width} ${PLOT.height}`}
          className="monthly-chart__svg"
          role="img"
          aria-label="Gráfico de entradas e saídas por mês"
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
            const entradaH = barHeight(d.entrada)
            const saidaH = barHeight(d.saida)
            const entradaKey = `${d.year}-${d.month}-entrada`
            const saidaKey = `${d.year}-${d.month}-saida`

            return (
              <g key={`${d.year}-${d.month}`}>
                <rect
                  x={groupX}
                  y={baseY - entradaH}
                  width={BAR_WIDTH}
                  height={Math.max(entradaH, 1)}
                  rx={4}
                  className={`monthly-chart__bar monthly-chart__bar--good ${hovered === entradaKey ? 'monthly-chart__bar--hover' : ''}`}
                  onPointerEnter={() => setHovered(entradaKey)}
                  onPointerLeave={() => setHovered(null)}
                  tabIndex={0}
                  onFocus={() => setHovered(entradaKey)}
                  onBlur={() => setHovered(null)}
                />
                <rect
                  x={groupX + BAR_WIDTH + BAR_GAP}
                  y={baseY - saidaH}
                  width={BAR_WIDTH}
                  height={Math.max(saidaH, 1)}
                  rx={4}
                  className={`monthly-chart__bar monthly-chart__bar--critical ${hovered === saidaKey ? 'monthly-chart__bar--hover' : ''}`}
                  onPointerEnter={() => setHovered(saidaKey)}
                  onPointerLeave={() => setHovered(null)}
                  tabIndex={0}
                  onFocus={() => setHovered(saidaKey)}
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

                {hovered === entradaKey && (
                  <foreignObject x={groupX - 40} y={baseY - entradaH - 46} width="120" height="40">
                    <div className="chart-tooltip chart-tooltip--floating">
                      <span className="chart-tooltip__key chart-tooltip__key--good" />
                      <span className="chart-tooltip__value">{formatCurrency(d.entrada)}</span>
                      <span className="chart-tooltip__label">Entradas</span>
                    </div>
                  </foreignObject>
                )}
                {hovered === saidaKey && (
                  <foreignObject x={groupX - 20} y={baseY - saidaH - 46} width="120" height="40">
                    <div className="chart-tooltip chart-tooltip--floating">
                      <span className="chart-tooltip__key chart-tooltip__key--critical" />
                      <span className="chart-tooltip__value">{formatCurrency(d.saida)}</span>
                      <span className="chart-tooltip__label">Saídas</span>
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
          Entradas
        </span>
        <span className="chart-legend__item">
          <span className="chart-legend__swatch chart-legend__swatch--critical" />
          Saídas
        </span>
      </div>
    </div>
  )
}
