import React from 'react'
import LayoutGridBuilder from '../../components/layout-grid-builder/layout-grid-builder.component'
import {DndProvider} from 'react-dnd'
import {HTML5Backend} from 'react-dnd-html5-backend'

import {connect} from 'react-redux'
import {createStructuredSelector} from 'reselect'

import {selectMapperSections} from '../../redux/mapper/mapper.selectors'

const Dashboard = ({sections}) => (
  <DndProvider backend={HTML5Backend}>
    <div>
      <LayoutGridBuilder />
    </div>
    {sections.map(({title, ...otherSectionProps}) => (
      <li>{title}</li>
    ))}
  </DndProvider>
)

const mapStateToProps = createStructuredSelector({
  sections: selectMapperSections,
})

export default connect(mapStateToProps)(Dashboard)
