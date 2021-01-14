import React, {useState, useCallback} from 'react'
import {useDrop} from 'react-dnd'
import {FormElements} from '../FormElements'

const StatefulDrop = (WrappedComponent) => (props) => {
  const [lastDroppedColor, setLastDroppedColor] = useState(null)
  const onDrop = useCallback((color) => setLastDroppedColor(color), [])

  const [{isOver, draggingColor, canDrop}, drop] = useDrop({
    accept: [FormElements.markdown, FormElements.text],
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
      <WrappedComponent {...props} droppedType={lastDroppedColor} />
    </div>
  )
}

export default StatefulDrop
