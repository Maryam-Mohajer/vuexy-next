import { ColDef } from 'ag-grid-community'
import AccountAutocompleteEditor from '../editors/AccountSearchEditor'

export const accountColumn = (): ColDef => ({
  headerName: 'حساب',
  field: 'account',
  editable: true,
  cellEditorPopup: true,
  cellEditorPopupPosition: 'over',
  cellEditor: AccountAutocompleteEditor,
  valueFormatter: params => params.value?.title ?? '',

  valueSetter: params => {
    params.data.account = params.newValue
    return true
  }
})
