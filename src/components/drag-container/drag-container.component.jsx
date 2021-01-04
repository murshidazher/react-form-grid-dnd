import React, { memo } from 'react'
import { DragSourceBox as SourceBox } from '../drag-source-box/drag-source-box.component'
import { StatefulTargetBox as DragTargetBox } from '../drag-target-box/drag-target-box.component'
import { Colors } from '../Colors'

const DragContainer = memo(function Container() {
  return (
    <>
      <div style={{ overflow: 'hidden', clear: 'both', margin: '-.5rem' }}>
        <div style={{ float: 'left' }}>
          {/* <SourceBox color={Colors.BLUE}>
            <SourceBox color={Colors.YELLOW}>
              <SourceBox color={Colors.YELLOW} />
              <SourceBox color={Colors.BLUE} />
            </SourceBox>
            <SourceBox color={Colors.BLUE}>
              <SourceBox color={Colors.YELLOW} />
            </SourceBox>
          </SourceBox> */}
          <SourceBox color={Colors.YELLOW} />
          <SourceBox color={Colors.BLUE} />
        </div>

        <div style={{ float: 'left', marginLeft: '5rem', marginTop: '.5rem' }}>
          <DragTargetBox />
        </div>
      </div>
    </>
  )
})

export default DragContainer
