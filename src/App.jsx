import React from 'react'
import LayoutGridBuilder from './components/layout-grid-builder/layout-grid-builder.component'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import ExamplePage from './components/example/ExamplePage'

const App = (props) => (
  <DndProvider backend={HTML5Backend}>
    <div>
      <LayoutGridBuilder />
      {/* <ExamplePage /> */}
    </div>
  </DndProvider>
)

export default App
