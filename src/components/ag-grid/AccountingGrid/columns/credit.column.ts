import { ColDef } from 'ag-grid-community'

export const creditColumn = (): ColDef => ({
  headerName: 'بستانکار',
  field: 'credit',
  editable: true,
  valueParser: params => Number(params.newValue) || 0,
  valueSetter: params => {
    params.data.credit = Number(params.newValue)
    return true // true یعنی value تغییر کرد
  }
})
