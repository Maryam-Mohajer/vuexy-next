import { useMemo } from 'react'
import { AccountingRow } from '../types'

export const useAccountingTotals = (rows: AccountingRow[]) => {
  return useMemo(() => {
    const debit = rows.reduce((sum, r) => sum + (r.debit || 0), 0)
    const credit = rows.reduce((sum, r) => sum + (r.credit || 0), 0)
    return { debit, credit }
  }, [rows])
}
