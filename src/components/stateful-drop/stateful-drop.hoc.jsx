import React, {useState, useCallback} from 'react'
import {useDrop} from 'react-dnd'
import {FormElements} from '../FormElements'

import {connect} from 'react-redux'
import {createStructuredSelector} from 'reselect'

import {selectMapperTypes} from '../../redux/mapper/mapper.selectors'

const StatefulDrop = (WrappedComponent) => {
  const HOC = ({MapperTypes, ...rest}) => {
    const [lastDroppedColor, setLastDroppedColor] = useState(null)
    const onDrop = useCallback((color) => setLastDroppedColor(color), [])

    const [{isOver, draggingColor, canDrop}, drop] = useDrop({
      accept: [MapperTypes.markdown, MapperTypes.text],
      drop(item) {
        onDrop(item.type)
        return undefined
      },
      collect: (monitor) => ({
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
        draggingColor: monitor.getItemType(),
      }),
    })

    return (
      <div ref={drop}>
        <p>Drop here : {lastDroppedColor}.</p>

        {!canDrop && lastDroppedColor && (
          <p>Last dropped item: {lastDroppedColor}</p>
        )}
        <WrappedComponent {...rest} droppedType={lastDroppedColor} />
      </div>
    )
  }

  const mapStateToProps = createStructuredSelector({
    MapperTypes: selectMapperTypes,
  })

  return connect(mapStateToProps)(HOC)
}

export default StatefulDrop
