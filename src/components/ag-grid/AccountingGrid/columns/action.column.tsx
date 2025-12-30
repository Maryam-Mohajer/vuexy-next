import { ColDef, ICellRendererParams } from "ag-grid-community"

export const actionColumn = (removeRow: (id: string) => void): ColDef => ({
  headerName: "عملیات",
  field: "actions",
  cellRenderer: (params: ICellRendererParams) => {
     if (params.data.id === "total") return null;
    return (
      <button
        onClick={() => removeRow(params.data.id)}
        style={{ cursor: "pointer" }}
      >
        ❌
      </button>
    )
  },
  width: 100,
  pinned: "left"
})
