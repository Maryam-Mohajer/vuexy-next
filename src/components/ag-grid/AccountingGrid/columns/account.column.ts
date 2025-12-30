import { ColDef } from 'ag-grid-community'
import AccountAutocompleteEditor from '../editors/AccountSearchEditor'

export const accountColumn = (): ColDef => ({
  headerName: 'حساب',
  field: 'account',
  editable: true,
  cellEditor: AccountAutocompleteEditor,
  cellEditorPopup: true,   
  valueFormatter: params => params.value?.title ?? '',

  valueSetter: params => {
    params.data.account = params.newValue
    return true
  }
})
