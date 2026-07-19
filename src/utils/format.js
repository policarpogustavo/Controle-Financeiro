export function formatCurrency(value) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export function formatDate(isoDate) {
  const [year, month, day] = isoDate.split('-')
  return `${day}/${month}/${year}`
}

export function monthLabel(year, month) {
  const date = new Date(year, month, 1)
  const label = date.toLocaleDateString('pt-BR', { month: 'short' })
  return label.charAt(0).toUpperCase() + label.slice(1).replace('.', '')
}
