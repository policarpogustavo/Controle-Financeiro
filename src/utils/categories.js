// Ordem fixa: cada categoria sempre usa o mesmo slot categórico (nunca é
// reatribuída conforme os dados presentes), conforme a skill de dataviz.
export const CATEGORIES = [
  { id: 'moradia', label: 'Moradia', slot: 1 },
  { id: 'alimentacao', label: 'Alimentação', slot: 2 },
  { id: 'lazer', label: 'Lazer', slot: 3 },
  { id: 'educacao', label: 'Educação', slot: 4 },
  { id: 'saude', label: 'Saúde', slot: 5 },
  { id: 'transporte', label: 'Transporte', slot: 6 },
  { id: 'assinaturas', label: 'Assinaturas', slot: 7 },
  { id: 'outros', label: 'Outros', slot: 8 },
]

export function categoryLabel(id) {
  return CATEGORIES.find((c) => c.id === id)?.label ?? id
}

export function categorySlot(id) {
  return CATEGORIES.find((c) => c.id === id)?.slot ?? 8
}
