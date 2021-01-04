import React from 'react'
import LayoutGridBuilder from './components/layout-grid-builder/layout-grid-builder.component'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import DragContainer from './components/drag-container/drag-container.component'

const App = (props) => (
  <div>
    <LayoutGridBuilder />
    {/* <DndProvider backend={HTML5Backend}>
      <DragContainer />
    </DndProvider> */}
  </div>
)

export default App
