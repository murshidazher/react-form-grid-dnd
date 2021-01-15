import React, {useEffect, lazy, Suspense} from 'react'
import LayoutGridBuilder from '../../components/layout-grid-builder/layout-grid-builder.component'
import {DndProvider} from 'react-dnd'
import {HTML5Backend} from 'react-dnd-html5-backend'

import {connect} from 'react-redux'

import {fetchFormStart} from '../../redux/form/form.actions'

const Dashboard = ({fetchFormStart, match}) => {
  useEffect(() => {
    fetchFormStart()
  }, [fetchFormStart])

  return (
    <DndProvider backend={HTML5Backend}>
      <div>
        <LayoutGridBuilder />
      </div>
    </DndProvider>
  )
}

const mapDispatchToProps = (dispatch) => ({
  fetchFormStart: () => dispatch(fetchFormStart()),
})

export default connect(null, mapDispatchToProps)(Dashboard)
