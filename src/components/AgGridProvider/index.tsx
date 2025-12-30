'use client'

import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community'

import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-alpine.css'

let registered = false

export function AgGridProvider({ children }: { children: React.ReactNode }) {
  if (!registered) {
    ModuleRegistry.registerModules([AllCommunityModule])
    registered = true
  }

  return <>{children}</>
}
