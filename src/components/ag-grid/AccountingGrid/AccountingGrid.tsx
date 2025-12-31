'use client'

import { AgGridReact } from 'ag-grid-react'
import { useState, useMemo, useRef, useEffect } from 'react'
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
  const gridRef = useRef<AgGridReact>(null)

  const [rowData, setRowData] = useState<AccountingRow[]>([
    {
      id: uuid(),
      debit: 150000,
      credit: 0,
      account: {
        id: 1,
        title: 'صندوق 1'
      },
      description: 'برداشت وجه نقد برای مصارف اداری'
    },
    {
      id: uuid(),
      debit: 150800,
      credit: 0,
      account: {
        id: 2,
        title: 'صندوق 2'
      },
      description: 'برداشت وجه نقد برای مصارف اداری'
    }
  ])

  const totals = useAccountingTotals(rowData)

  const removeRow = (id: string) => {
    setRowData(prev => prev.filter(r => r.id !== id))
  }

  const columnDefs = useMemo(() => [accountColumn(), debitColumn(), descriptionColumn(), creditColumn()], [])

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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (gridRef.current) {
        const gridElement = document.querySelector('.ag-root') // یا div جدول خودتون
        if (gridElement && !gridElement.contains(event.target as Node)) {
          gridRef.current.api.deselectAll()
        }
      }
    }

    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [])

  const addRowAndFocus = () => {
    setRowData(prev => {
      const newRow: AccountingRow = {
        id: uuid(),
        debit: 0,
        credit: 0,
        account: { id: 0, title: '' },
        description: ''
      }

      requestAnimationFrame(() => {
        const api = gridRef.current?.api
        if (!api) return
      })

      return [...prev, newRow]
    })
  }

  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault()

        // اگر گرید هنوز آماده نیست
        if (!gridRef.current?.api) return

        addRowAndFocus()
      }
    }

    window.addEventListener('keydown', handleGlobalKeyDown)

    return () => {
      window.removeEventListener('keydown', handleGlobalKeyDown)
    }
  }, [])

  return (
    <>
      <button className='mb-4 pointer' onClick={addRow}>
        ➕ افزودن سطر
      </button>
      <AgGridProvider>
        <div className='ag-theme-alpine'>
          <AgGridReact
            ref={gridRef}
            theme='legacy'
            domLayout='autoHeight'
            rowData={rowData}
            pinnedBottomRowData={pinnedBottomRowData}
            columnDefs={columnDefs}
            enableRtl
            defaultColDef={{
              flex: 1,
              minWidth: 120,
              resizable: true,
              cellClass: 'ag-cell-bordered',

              suppressKeyboardEvent: params => {
                const e = params.event as KeyboardEvent

                // Ctrl + Enter → افزودن سطر جدید
                if (e.ctrlKey && e.key === 'Enter') {
                  e.preventDefault()

                  // اول ادیت سلول فعلی رو ببند
                  params.api.stopEditing()

                  // بعد سطر جدید بساز
                  addRowAndFocus()

                  return true // ⛔ اجازه نده AG Grid خودش Enter رو هندل کنه
                }

                return false
              }
            }}
            onGridSizeChanged={params => params.api.sizeColumnsToFit()}
            onCellValueChanged={params => {
              const updatedRow = {
                ...params.data
              }
              setRowData(prev => prev.map(r => (r.id === updatedRow.id ? updatedRow : r)))
            }}
            getRowId={p => p.data.id}
            rowSelection='multiple'
            onGridReady={params => {
              params.api.sizeColumnsToFit()
              params.api.addEventListener('cellKeyDown', (event: any) => {
                const key = event.event.key
                if (key === 'Delete' || key === 'Backspace') {
                  const selectedRows = event.api.getSelectedRows()
                  if (selectedRows.length > 0) {
                    const idsToRemove = selectedRows.map((r: any) => r.id)
                    setRowData(prev => prev.filter(r => !idsToRemove.includes(r.id)))
                  }
                }
              })
            }}
            rowClassRules={{
              'custom-selected-row': params => !!params.node.isSelected()
            }}
            getRowHeight={params => {
              const lines = params.data.description?.split('\n').length || 1
              return lines * 45
            }}
          />
        </div>

        <div className='mt-3'>
          جمع بدهکار: {totals.debit} | جمع بستانکار: {totals.credit}
        </div>
      </AgGridProvider>
    </>
  )
}
