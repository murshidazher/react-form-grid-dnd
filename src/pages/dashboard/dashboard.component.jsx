import React from 'react'
import LayoutGridBuilder from '../../components/layout-grid-builder/layout-grid-builder.component'
import {DndProvider} from 'react-dnd'
import {HTML5Backend} from 'react-dnd-html5-backend'

import {connect} from 'react-redux'
import {createStructuredSelector} from 'reselect'

const Dashboard = () => (
  <DndProvider backend={HTML5Backend}>
    <div>
      <LayoutGridBuilder />
    </div>
  </DndProvider>
)

const mapStateToProps = createStructuredSelector({})

export default connect(mapStateToProps)(Dashboard)
