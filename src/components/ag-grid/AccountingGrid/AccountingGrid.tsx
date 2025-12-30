'use client'

import { AgGridReact } from 'ag-grid-react'
import { useState, useMemo } from 'react'
import { v4 as uuid } from 'uuid'

import { AccountingRow } from './types'
import { accountColumn } from './columns/account.column'
import { debitColumn } from './columns/debit.column'
import { creditColumn } from './columns/credit.column'
import { useAccountingTotals } from './hooks/useAccountingTotals'
import { AgGridProvider } from '@/components/AgGridProvider'
import { descriptionColumn } from './columns/description.column'
import { actionColumn } from './columns/action.column'


export function AccountingGrid() {
  const [rowData, setRowData] = useState<AccountingRow[]>([
    {
      id: uuid(),
      debit: 150000,
      credit: 0,
      account: {
        id: 1,
        title: 'صندوق'
      }
    }
  ])

  const totals = useAccountingTotals(rowData)

  const removeRow = (id: string) => {
    setRowData(prev => prev.filter(r => r.id !== id))
  }

  const columnDefs = useMemo(
    () => [accountColumn(), debitColumn(), descriptionColumn(), creditColumn(), actionColumn(removeRow)],
    []
  )

  // ردیف Footer برای نمایش جمع‌ها
  const pinnedBottomRowData = useMemo(
    () => [
      {
        id: 'total',
        account: { title: 'جمع' },
        debit: totals.debit,
        description: '',
        credit: totals.credit
      }
    ],
    [totals]
  )

  const addRow = () => {
    setRowData(prev => [
      ...prev,
      {
        id: uuid(),
        debit: 0,
        credit: 0,
        account: { id: 0, title: '' }
      }
    ])
  }

  return (
    <>
      <button className='mb-4 pointer' onClick={addRow}>
        ➕ افزودن سطر
      </button>
      <AgGridProvider>
        <div className='ag-theme-alpine' style={{ height: 400, width: '100%' }} >
          <AgGridReact
            theme='legacy'
            rowData={rowData}
            pinnedBottomRowData={pinnedBottomRowData}
            columnDefs={columnDefs}
           //  popupParent={document.body}
            enableRtl
            defaultColDef={{
              flex: 1,
              minWidth: 120,
              resizable: true,
              cellClass: 'ag-cell-bordered'
            }}
            onGridReady={params => params.api.sizeColumnsToFit()}
            onGridSizeChanged={params => params.api.sizeColumnsToFit()}
            onCellValueChanged={params => {
              const updatedRow = {
                ...params.data
              }
              setRowData(prev => prev.map(r => (r.id === updatedRow.id ? updatedRow : r)))
            }}
            getRowId={p => p.data.id}
          />
        </div>

        <div className='mt-3'>
          جمع بدهکار: {totals.debit} | جمع بستانکار: {totals.credit}
        </div>
      </AgGridProvider>
    </>
  )
}
