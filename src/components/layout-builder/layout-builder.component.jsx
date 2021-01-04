import React, { useState, memo, useMemo, useCallback } from 'react'
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

const MyGrid = memo(({ layouts, currentBreakpoint }) => {
  const children = useMemo(() => {
    return _.orderBy(layouts[currentBreakpoint], ['y'], ['asc']).map((l, i) => {
      return (
        <div key={i} className={l.static ? 'static' : ''} data-grid={l}>
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
                // onSelect={() => this.onFieldSelect('email')}
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
            // onClick={this.onRemoveItem.bind(this, i)}
          >
            x
          </span>
        </div>
      )
    })
  }, [layouts])

  return (
    <>
      <GridLayout cols={12}>{children}</GridLayout>
    </>
  )
})

const StatefulMyGrid = withStatefulDrop(MyGrid)

/* afdasfs */
export default class LayoutBuilder extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      currentBreakpoint: 'sm',
      compactType: 'vertical',
      mounted: false,
      layouts: { sm: props.initialLayout },
      layoutLength: props.initialLayout.length,
    }

    this.onBreakpointChange = this.onBreakpointChange.bind(this)
    this.onCompactTypeChange = this.onCompactTypeChange.bind(this)
    this.onLayoutChange = this.onLayoutChange.bind(this)
    this.onNewLayout = this.onNewLayout.bind(this)
    // this.onFieldSelect = this.onFieldSelect.bind(this)
  }

  componentDidMount() {
    this.setState({ mounted: true })
  }

  onInputChange() {}

  onRemoveItem = (i) => {
    console.log('removing', i)
    this.setState(
      produce((draft) => {
        draft.layouts[this.state.currentBreakpoint].splice(i, 1)
        draft.layoutLength -= draft.layoutLength
      })
    )
  }

  generateDOM = () => {
    console.log(
      'generate DOM',
      this.state.layouts[this.state.currentBreakpoint]
    )
    return _.orderBy(
      this.state.layouts[this.state.currentBreakpoint],
      ['y'],
      ['asc']
    ).map((l, i) => {
      return (
        <div key={i} className={l.static ? 'static' : ''} data-grid={l}>
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
                onSelect={() => this.onFieldSelect('email')}
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
            onClick={this.onRemoveItem.bind(this, i)}
          >
            x
          </span>
        </div>
      )
    })
  }

  onBreakpointChange(breakpoint) {
    this.setState({
      currentBreakpoint: breakpoint,
    })
  }

  onFieldSelect = (key) => {
    this.props.onFieldSelect(key)
  }

  onCompactTypeChange() {
    const { compactType: oldCompactType } = this.state
    const compactType =
      oldCompactType === 'horizontal'
        ? 'vertical'
        : oldCompactType === 'vertical'
        ? null
        : 'horizontal'
    this.setState({ compactType })
  }

  onLayoutChange(layout, layouts) {
    console.log('on Layout Change', layout, layouts)
    this.props.onLayoutChange(layout, layouts)
  }

  onNewLayout() {
    console.log('on Now Layout')
    this.setState({
      layouts: { sm: generateLayout() },
    })
  }

  // onDragOver = (event) => {
  //   event.preventDefault()
  //   console.log('drag Over')
  // }

  // onDragEnter = (event) => {
  //   event.preventDefault()
  //   console.log('drag enter')
  // }

  onDrop = (layout, item, event) => {
    // event.preventDefault()
    const orderedLayout = _.orderBy(layout, ['y'], ['asc'])
    this.setState(
      produce((draft) => {
        draft.layouts[this.state.currentBreakpoint] = orderedLayout
        draft.layoutLength = orderedLayout.length
        console.log('draft', draft)
        console.log('draft', layout)
      })
    )
  }

  render() {
    return (
      <div className="m-4">
        <div>
          Current Breakpoint: {this.state.currentBreakpoint} (
          {this.props.cols[this.state.currentBreakpoint]} columns)
        </div>
        <div>
          Compaction type:{' '}
          {_.capitalize(this.state.compactType) || 'No Compaction'}
        </div>
        <button onClick={this.onNewLayout}>Generate New Layout</button>
        <button onClick={this.onCompactTypeChange}>
          Change Compaction Type
        </button>
        <StatefulMyGrid
          layouts={this.state.layouts}
          currentBreakpoint={this.state.currentBreakpoint}
        />
        {/* <ResponsiveReactGridLayout
          {...this.props}
          layouts={this.state.layouts}
          onBreakpointChange={this.onBreakpointChange}
          onLayoutChange={this.onLayoutChange}
          measureBeforeMount={false}
          // I like to have it animate on mount. If you don't, delete `useCSSTransforms` (it's default `true`)
          // and set `measureBeforeMount={true}`.
          useCSSTransforms={this.state.mounted}
          compactType={this.state.compactType}
          preventCollision={!this.state.compactType}
          // onDragEnter={this.onDragEnter}
          // onDragOver={this.onDragOver}
          minH={32}
          isBounded={true}
          isDroppable={true}
          resizeHandles={['se', 'ne']}
          onDrop={(layout, item, e) => this.onDrop(layout, item, e)}
          droppingItem={{
            i: this.state.layoutLength.toString(),
            w: 6,
            h: 6,
            minH: 8,
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
          {this.generateDOM()}
        </ResponsiveReactGridLayout> */}
      </div>
    )
  }
}

LayoutBuilder.propTypes = {
  onLayoutChange: PropTypes.func.isRequired,
}

LayoutBuilder.defaultProps = {
  className: 'layout',
  rowHeight: 8,
  onLayoutChange: function () {},
  cols: { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 },
  initialLayout: generateLayout(),
}

function generateLayout() {
  console.log('on generateLayout')
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
      minH: 4,
      // maxH: Infinity,
    }
  })
}

function nextState(component, recipe) {
  return () => component.setState(produce(recipe))
}
