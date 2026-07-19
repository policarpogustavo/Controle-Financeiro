const STORAGE_KEY = 'meu-dinheiro:transactions'

function isoDaysAgo(days) {
  const date = new Date()
  date.setDate(date.getDate() - days)
  return date.toISOString().slice(0, 10)
}

function seedTransactions() {
  return [
    { id: crypto.randomUUID(), description: 'Salário', amount: 4200, type: 'receita', category: 'outros', date: isoDaysAgo(3) },
    { id: crypto.randomUUID(), description: 'Aluguel', amount: 1350, type: 'despesa', category: 'moradia', date: isoDaysAgo(2) },
    { id: crypto.randomUUID(), description: 'Supermercado', amount: 480, type: 'despesa', category: 'alimentacao', date: isoDaysAgo(5) },
    { id: crypto.randomUUID(), description: 'Uber', amount: 65, type: 'despesa', category: 'transporte', date: isoDaysAgo(6) },
    { id: crypto.randomUUID(), description: 'Cinema', amount: 90, type: 'despesa', category: 'lazer', date: isoDaysAgo(8) },
    { id: crypto.randomUUID(), description: 'Streaming', amount: 55, type: 'despesa', category: 'assinaturas', date: isoDaysAgo(10) },
    { id: crypto.randomUUID(), description: 'Freelance', amount: 900, type: 'receita', category: 'outros', date: isoDaysAgo(15) },
    { id: crypto.randomUUID(), description: 'Curso online', amount: 120, type: 'despesa', category: 'educacao', date: isoDaysAgo(18) },
    { id: crypto.randomUUID(), description: 'Farmácia', amount: 75, type: 'despesa', category: 'saude', date: isoDaysAgo(20) },
    { id: crypto.randomUUID(), description: 'Salário', amount: 4200, type: 'receita', category: 'outros', date: isoDaysAgo(33) },
    { id: crypto.randomUUID(), description: 'Aluguel', amount: 1350, type: 'despesa', category: 'moradia', date: isoDaysAgo(32) },
    { id: crypto.randomUUID(), description: 'Supermercado', amount: 520, type: 'despesa', category: 'alimentacao', date: isoDaysAgo(28) },
    { id: crypto.randomUUID(), description: 'Combustível', amount: 210, type: 'despesa', category: 'transporte', date: isoDaysAgo(25) },
    { id: crypto.randomUUID(), description: 'Plano de saúde', amount: 340, type: 'despesa', category: 'saude', date: isoDaysAgo(24) },
    { id: crypto.randomUUID(), description: 'Salário', amount: 4100, type: 'receita', category: 'outros', date: isoDaysAgo(63) },
    { id: crypto.randomUUID(), description: 'Aluguel', amount: 1350, type: 'despesa', category: 'moradia', date: isoDaysAgo(62) },
    { id: crypto.randomUUID(), description: 'Restaurante', amount: 180, type: 'despesa', category: 'alimentacao', date: isoDaysAgo(55) },
    { id: crypto.randomUUID(), description: 'Show', amount: 250, type: 'despesa', category: 'lazer', date: isoDaysAgo(50) },
  ]
}

export function loadTransactions() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      const seed = seedTransactions()
      saveTransactions(seed)
      return seed
    }
    return JSON.parse(raw)
  } catch {
    return []
  }
}

export function saveTransactions(transactions) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions))
}
