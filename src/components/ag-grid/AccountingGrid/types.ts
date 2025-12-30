export interface AccountingRow {
  id: string
  account?: {
    id: number
    title: string
  }
  debit?: number
  credit?: number
  description?: string
}
