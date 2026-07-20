import ExcelJS from 'exceljs'
import { categoryLabel } from './categories'
import { formatDate } from './format'

const BRAND_1 = 'FF16273F'
const BRAND_2 = 'FF2C4A73'
const ACCENT = 'FFB08D4F'
const GOOD = 'FF10855E'
const CRITICAL = 'FFB3392F'
const WHITE = 'FFFFFFFF'
const ROW_ALT = 'FFF3F5F9'
const BORDER = 'FFD8DEE8'

function thinBorder() {
  const side = { style: 'thin', color: { argb: BORDER } }
  return { top: side, bottom: side, left: side, right: side }
}

export async function exportTransactionsToExcel(transactions, filename = 'transacoes.xlsx') {
  const sorted = [...transactions].sort((a, b) => b.date.localeCompare(a.date))

  const entradas = sorted.filter((t) => t.type === 'entrada').reduce((sum, t) => sum + t.amount, 0)
  const saidas = sorted.filter((t) => t.type === 'saida').reduce((sum, t) => sum + t.amount, 0)
  const saldo = entradas - saidas

  const workbook = new ExcelJS.Workbook()
  workbook.creator = 'Painel Financeiro'
  workbook.created = new Date()

  const sheet = workbook.addWorksheet('Transações', {
    views: [{ state: 'frozen', ySplit: 4 }],
  })

  sheet.columns = [
    { key: 'date', width: 14 },
    { key: 'description', width: 34 },
    { key: 'category', width: 20 },
    { key: 'type', width: 14 },
    { key: 'amount', width: 16 },
  ]

  // Faixa de título com o mesmo gradiente navy do cabeçalho do site
  sheet.mergeCells('A1:E1')
  const titleCell = sheet.getCell('A1')
  titleCell.value = 'Painel Financeiro'
  titleCell.font = { name: 'Calibri', size: 16, bold: true, color: { argb: WHITE } }
  titleCell.alignment = { vertical: 'middle', horizontal: 'left' }
  sheet.getRow(1).height = 28
  for (let col = 1; col <= 5; col++) {
    sheet.getRow(1).getCell(col).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: BRAND_1 } }
  }
  sheet.getRow(1).getCell(5).border = { bottom: { style: 'medium', color: { argb: ACCENT } } }

  sheet.mergeCells('A2:E2')
  const subtitleCell = sheet.getCell('A2')
  subtitleCell.value = `Gestão financeira com visão executiva  •  Exportado em ${new Date().toLocaleDateString('pt-BR')}`
  subtitleCell.font = { name: 'Calibri', size: 10, italic: true, color: { argb: WHITE } }
  subtitleCell.alignment = { vertical: 'middle', horizontal: 'left' }
  for (let col = 1; col <= 5; col++) {
    sheet.getRow(2).getCell(col).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: BRAND_2 } }
  }
  sheet.getRow(2).height = 20

  sheet.getRow(3).height = 6

  // Cabeçalho da tabela
  const headerRow = sheet.getRow(4)
  headerRow.values = ['Data', 'Descrição', 'Categoria', 'Tipo', 'Valor']
  headerRow.eachCell((cell) => {
    cell.font = { name: 'Calibri', size: 11, bold: true, color: { argb: WHITE } }
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: BRAND_1 } }
    cell.alignment = { vertical: 'middle', horizontal: 'left' }
    cell.border = thinBorder()
  })
  headerRow.getCell(5).alignment = { vertical: 'middle', horizontal: 'right' }
  headerRow.height = 22

  // Linhas de dados
  sorted.forEach((t, index) => {
    const row = sheet.addRow({
      date: formatDate(t.date),
      description: t.description,
      category: categoryLabel(t.category),
      type: t.type === 'entrada' ? 'Entrada' : 'Saída',
      amount: t.type === 'entrada' ? t.amount : -t.amount,
    })

    const isEven = index % 2 === 1
    row.eachCell((cell) => {
      cell.border = thinBorder()
      cell.font = { name: 'Calibri', size: 10.5 }
      if (isEven) {
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: ROW_ALT } }
      }
    })

    const amountCell = row.getCell(5)
    amountCell.numFmt = '"R$" #,##0.00;[Red]-"R$" #,##0.00'
    amountCell.alignment = { horizontal: 'right' }
    amountCell.font = {
      name: 'Calibri',
      size: 10.5,
      bold: true,
      color: { argb: t.type === 'entrada' ? GOOD : CRITICAL },
    }
  })

  // Linha de totais
  sheet.addRow([])
  const totalEntradasRow = sheet.addRow(['', '', '', 'Total Entradas', entradas])
  const totalSaidasRow = sheet.addRow(['', '', '', 'Total Saídas', -saidas])
  const saldoRow = sheet.addRow(['', '', '', 'Saldo', saldo])

  for (const [row, color] of [
    [totalEntradasRow, GOOD],
    [totalSaidasRow, CRITICAL],
    [saldoRow, saldo < 0 ? CRITICAL : BRAND_1],
  ]) {
    row.getCell(4).font = { name: 'Calibri', size: 11, bold: true }
    row.getCell(4).alignment = { horizontal: 'right' }
    row.getCell(5).numFmt = '"R$" #,##0.00;[Red]-"R$" #,##0.00'
    row.getCell(5).alignment = { horizontal: 'right' }
    row.getCell(5).font = { name: 'Calibri', size: 11, bold: true, color: { argb: color } }
    row.getCell(4).border = { top: { style: 'thin', color: { argb: ACCENT } } }
    row.getCell(5).border = { top: { style: 'thin', color: { argb: ACCENT } } }
  }

  sheet.autoFilter = { from: 'A4', to: 'E4' }

  const buffer = await workbook.xlsx.writeBuffer()
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}
