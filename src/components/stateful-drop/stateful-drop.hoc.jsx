import React, {useState, useCallback} from 'react'
import {useDrop} from 'react-dnd'

import {connect} from 'react-redux'
import {createStructuredSelector} from 'reselect'

import {selectMapperTypes} from '../../redux/mapper/mapper.selectors'
import {selectGridLastDroppedElement} from '../../redux/grid/grid.selectors'

import {setLastDroppedElement} from '../../redux/grid/grid.actions'

const StatefulDrop = (WrappedComponent) => {
  const HOC = ({MapperTypes, elem, setLastDroppedElement, ...rest}) => {
    const onDrop = useCallback((color) => setLastDroppedElement(color), [])

    const [{isOver, draggingColor, canDrop}, drop] = useDrop({
      accept: [MapperTypes.Textbox, MapperTypes.Markdown],
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
        <p>Drop here : {elem}.</p>

        {!canDrop && elem && <p>Last dropped item: {elem}</p>}
        <WrappedComponent {...rest} droppedType={elem} />
      </div>
    )
  }

  const mapDispatchToProps = (dispatch) => ({
    setLastDroppedElement: (el) => dispatch(setLastDroppedElement(el)),
  })

  const mapStateToProps = createStructuredSelector({
    MapperTypes: selectMapperTypes,
    elem: selectGridLastDroppedElement,
  })

  return connect(mapStateToProps, mapDispatchToProps)(HOC)
}

export default StatefulDrop
