// description.column.ts
import { ColDef } from "ag-grid-community";

export const descriptionColumn = (): ColDef => ({
  headerName: "توضیحات",
  field: "description",
  editable: true,
  flex: 1,
  minWidth: 150
})
