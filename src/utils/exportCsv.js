import { categoryLabel } from './categories'
import { formatDate } from './format'

function escapeField(value) {
  const str = String(value)
  return /[";\n]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str
}

export function exportTransactionsToCsv(transactions, filename = 'transacoes.csv') {
  const header = ['Data', 'Descrição', 'Categoria', 'Tipo', 'Valor']
  const rows = [...transactions]
    .sort((a, b) => b.date.localeCompare(a.date))
    .map((t) => [
      formatDate(t.date),
      t.description,
      categoryLabel(t.category),
      t.type === 'receita' ? 'Receita' : 'Despesa',
      t.amount.toFixed(2).replace('.', ','),
    ])

  const lines = [header, ...rows].map((row) => row.map(escapeField).join(';'))
  const csvContent = '﻿' + lines.join('\r\n')

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}
