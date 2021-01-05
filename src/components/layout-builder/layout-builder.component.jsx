import React, {
  memo,
  useState,
  useMemo,
  useCallback,
  useRef,
  useEffect,
} from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import ResizeHandle from '../resize-handle/resize-handle.component'
import { Responsive, WidthProvider } from 'react-grid-layout'
import produce from 'immer'
import { StatefulTargetBox as DragTargetBox } from '../drag-target-box/drag-target-box.component'
const ResponsiveReactGridLayout = WidthProvider(Responsive)
import GridLayout from 'react-grid-layout'

import { useDrop } from 'react-dnd'
import { Colors } from '../Colors'

class TextInput extends React.Component {
  state = {
    value: '',
  }
  handleChange = (e) => this.setState({ value: e.target.value })
  render() {
    const { value } = this.state
    return (
      <div>
        <input
          className="myInput"
          type="text"
          value={value}
          onChange={this.handleChange}
        />
        <div>Value: {value}</div>
      </div>
    )
  }
}

const removeStyle = {
  position: 'absolute',
  right: '2px',
  top: 0,
  cursor: 'pointer',
}

// export default One

const withStatefulDrop = (BaseComponent) => (props) => {
  const [lastDroppedColor, setLastDroppedColor] = useState(null)
  const onDrop = useCallback((color) => setLastDroppedColor(color), [])

  const [{ isOver, draggingColor, canDrop }, drop] = useDrop({
    accept: [Colors.YELLOW, Colors.BLUE],
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

      {!canDrop && lastDroppedColor && <p>Last dropped: {lastDroppedColor}</p>}
      <BaseComponent {...props} />
    </div>
  )
}

const MyGrid = memo(
  ({
    initialLayout,
    initialBreakpoint = 'sm',
    initialCompactType = 'vertical',
    handleLayoutChange,
    handleFieldSelect,
    ...rest
  }) => {
    const [currentBreakpoint, setCurrentBreakpoint] = useState(
      initialBreakpoint
    )
    const [compactType, setCompactType] = useState(initialCompactType)
    const [layouts, setLayouts] = useState({
      [initialBreakpoint]: initialLayout,
    }) // {sm: initialLayout}
    const [layoutLength, setLayoutLength] = useState(initialLayout.length)
    const mounted = useRef(true) // component mounted or not

    useEffect(() => {
      console.log('use Effect called')
      return () => {
        mounted.current = false
      }
    }, []) // Using an empty dependency array ensures this only runs

    // remove an item
    const onRemoveItem = (i) => {
      console.log('removing', i)
      console.log('before', layouts)
      setLayouts(
        produce((prev) => {
          prev[currentBreakpoint].splice(i, 1)
        })
      )
      console.log('after', layouts)
      setLayoutLength(layoutLength - 1)
    }

    const onBreakpointChange = (breakpoint) => setCurrentBreakpoint(breakpoint)

    const onFieldSelect = (key) => handleFieldSelect(key)

    const onCompactTypeChange = () => {
      const newCompactType =
        compactType === 'horizontal'
          ? 'vertical'
          : compactType === 'vertical'
          ? null
          : 'horizontal'

      setCompactType(newCompactType)
    }

    const onLayoutChange = (layout) => {
      handleLayoutChange(layout)
    }

    const onNewLayout = () => {
      setLayouts(
        produce((prev) => {
          prev[currentBreakpoint] = generateLayout()
        })
      )
    }

    const onDrop = (layout, item, event) => {
      // event.preventDefault()
      console.log(item)
      const orderedLayout = _.orderBy(layout, ['y'], ['asc'])
      setLayouts(
        produce((prev) => {
          prev[currentBreakpoint] = orderedLayout
        })
      )
      setLayoutLength(layoutLength + 1)

      onLayoutChange(layout)
    }

    const children = useMemo(() => {
      console.log('children generate')
      return _.orderBy(layouts[currentBreakpoint], ['y'], ['asc']).map(
        (l, i) => {
          return (
            <div key={l.i} className={l.static ? 'static' : ''} data-grid={l}>
              {l.static ? (
                <span
                  className="text"
                  title="This item is static and cannot be removed or resized."
                >
                  Static - {i}
                </span>
              ) : i !== 0 ? (
                <span className="text">
                  {l.i} - {i}
                </span>
              ) : (
                <>
                  <input
                    type="text"
                    name="example"
                    id="example"
                    onSelect={() => onFieldSelect('email')}
                  />
                  {/* <TextInput /> */}
                  <span className="text">
                    {l.i} - {i}
                  </span>
                </>
              )}

              <span
                className="remove"
                style={removeStyle}
                onClick={() => onRemoveItem(i)}
              >
                x
              </span>
            </div>
          )
        }
      )
    }, [layouts])

    return (
      <>
        {console.log('rendered')}
        <div>
          Current Breakpoint: {currentBreakpoint} (
          {rest.cols[currentBreakpoint]} columns)
        </div>
        <div>
          Compaction type: {_.capitalize(compactType) || 'No Compaction'}
        </div>
        <button onClick={onNewLayout}>Generate New Layout</button>
        <button onClick={onCompactTypeChange}>Change Compaction Type</button>
        <ResponsiveReactGridLayout
          {...rest}
          layouts={layouts}
          onBreakpointChange={onBreakpointChange}
          onLayoutChange={handleLayoutChange}
          measureBeforeMount={true}
          useCSSTransforms={mounted.current}
          compactType={compactType}
          preventCollision={!compactType}
          // onDragEnter={this.onDragEnter}
          // onDragOver={this.onDragOver}
          isBounded={true}
          isDroppable={true}
          resizeHandles={['se', 'ne']}
          onDrop={(layout, item, e) => onDrop(layout, item, e)}
          droppingItem={{
            i: 'n' + layoutLength.toString(),
            w: 6,
            h: 6,
            minH: 2,
            static: false,
            isBounded: true,
            isDroppable: true,
            resizeHandles: ['s', 'n'],
            field: 'text',
          }}
          resizeHandles={['s', 'n']}
          // resizeHandle={(resizeHandleAxis) => (
          //   <ResizeHandle axis={resizeHandleAxis} />
          // )}
        >
          {children}
        </ResponsiveReactGridLayout>
      </>
    )
  }
)

const StatefulMyGrid = withStatefulDrop(MyGrid)

/* afdasfs */
export default class LayoutBuilder extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div className="m-4">
        <StatefulMyGrid
          cols={this.props.cols}
          className={this.props.className}
          rowHeight={this.props.rowHeight}
          compactType={this.props.compactType}
          initialLayout={this.props.initialLayout}
          initialBreakpoint={this.props.initialBreakpoint}
          handleLayoutChange={this.props.onLayoutChange}
          handleFieldSelect={this.props.onFieldSelect}
        />
      </div>
    )
  }
}

LayoutBuilder.propTypes = {
  onLayoutChange: PropTypes.func.isRequired,
}

LayoutBuilder.defaultProps = {
  className: 'layout',
  rowHeight: 30,
  initialBreakpoint: 'sm',
  compactType: 'vertical',
  onLayoutChange: function () {},
  cols: { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 },
  initialLayout: generateLayout(),
}

function generateLayout() {
  return _.map(_.range(0, 4), function (item, i) {
    var y = Math.ceil(Math.random() * 4) + 1
    return {
      // x: (_.random(0, 5) * 2) % 12,
      x: 0,
      y: Math.floor(i / 6) * y,
      w: 6,
      h: y,
      i: i.toString(),
      // static: Math.random() < 0.05,
      static: false,
      resizeHandles: ['s', 'n'],
      isBounded: true,
      isDroppable: true,
      // minW: ?number = 0,
      // maxW: ?number = Infinity,
      minH: 2,
      // maxH: Infinity,
    }
  })
}

function nextState(component, recipe) {
  return () => component.setState(produce(recipe))
}
