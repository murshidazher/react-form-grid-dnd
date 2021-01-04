import React, { useState, useCallback, useMemo } from 'react'
import { useDrag } from 'react-dnd'
import { Colors } from '../Colors'
const style = {
  border: '1px dashed gray',
  padding: '0.5rem',
  margin: '0.5rem',
}
export const DragSourceBox = ({ color, showForbid = false, children }) => {
  const [forbidDrag, setForbidDrag] = useState(false)

  const [{ isDragging }, drag] = useDrag({
    item: { type: `${color}` },
    canDrag: !forbidDrag,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  })

  const onToggleForbidDrag = useCallback(() => {
    setForbidDrag(!forbidDrag)
  }, [forbidDrag])

  // const backgroundColor = useMemo(() => {
  //   switch (color) {
  //     case Colors.YELLOW:
  //       return 'lightgoldenrodyellow'
  //     case Colors.BLUE:
  //       return 'lightblue'
  //     default:
  //       return 'lightgoldenrodyellow'
  //   }
  // }, [color])

  const containerStyle = useMemo(
    () => ({
      ...style,
      // backgroundColor,
      opacity: isDragging ? 0.4 : 1,
      cursor: forbidDrag ? 'default' : 'move',
    }),
    [isDragging, forbidDrag]
  )

  return (
    <div ref={drag} style={containerStyle}>
      {showForbid && (
        <input
          type="checkbox"
          checked={forbidDrag}
          onChange={onToggleForbidDrag}
        />
      )}
      <small>{`Forbid ${color} drag`}</small>
      {children}
    </div>
  )
}
