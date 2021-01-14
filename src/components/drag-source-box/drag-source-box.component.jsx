import React, {useState, useCallback, useMemo} from 'react'
import {useDrag} from 'react-dnd'

export const DragSourceBox = ({
  element,
  showForbid = false,
  children,
  className,
  draggable = true,
}) => {
  const [forbidDrag, setForbidDrag] = useState(!draggable)

  const [{isDragging}, drag] = useDrag({
    item: {
      type: `${element}`,
    },
    canDrag: !forbidDrag,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  })

  const onToggleForbidDrag = useCallback(() => {
    setForbidDrag(!forbidDrag)
  }, [forbidDrag])

  // const backgroundColor = useMemo(() => {
  //   switch (element) {
  //     case Colors.YELLOW:
  //       return 'lightgoldenrodyellow'
  //     case Colors.BLUE:
  //       return 'lightblue'
  //     default:
  //       return 'lightgoldenrodyellow'
  //   }
  // }, [element])

  const containerStyle = useMemo(
    () => ({
      // ...style,
      // backgroundColor,
      opacity: isDragging ? 0.4 : 1,
      cursor: forbidDrag ? 'default' : 'move',
    }),
    [isDragging, forbidDrag],
  )

  return (
    <div
      ref={drag}
      style={containerStyle}
      className={('droppable-element', className)}
      draggable={true}
      unselectable="on"
      onDragStart={(e) => e.dataTransfer.setData('text/plain', '')}>
      {showForbid && (
        <input
          type="checkbox"
          checked={forbidDrag}
          onChange={onToggleForbidDrag}
        />
      )}
      {/* <small>{`Forbid ${element} drag`}</small> */}
      {children}
    </div>
  )
}
