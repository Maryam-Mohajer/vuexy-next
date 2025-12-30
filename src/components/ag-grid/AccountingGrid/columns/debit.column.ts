import { ColDef } from "ag-grid-community";

export const debitColumn = (): ColDef => ({
  headerName: 'بدهکار',
  field: 'debit',
  editable: true,
  valueParser: params => Number(params.newValue) || 0,
   valueSetter: params => {
    params.data.debit = Number(params.newValue)
    return true // true یعنی value تغییر کرد
  }
})
