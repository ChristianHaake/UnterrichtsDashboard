import type { ReactNode } from 'react'
import GridLayout, { WidthProvider, type Layout } from 'react-grid-layout'
import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'
import { GRID_COLS } from '../widgets/registry'

const Grid = WidthProvider(GridLayout)

interface DashboardGridProps {
  layout: Layout[]
  onLayoutChange: (layout: Layout[]) => void
  children: ReactNode
}

export function DashboardGrid({ layout, onLayoutChange, children }: DashboardGridProps) {
  return (
    <Grid
      className="dashboard-grid"
      layout={layout}
      cols={GRID_COLS}
      rowHeight={40}
      margin={[16, 16]}
      onLayoutChange={onLayoutChange}
      draggableHandle=".widget-frame__drag"
      isBounded
    >
      {children}
    </Grid>
  )
}

export type { Layout }
