import React from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import ResizeHandle from '../resize-handle/resize-handle.component'
import { Responsive, WidthProvider } from 'react-grid-layout'
import produce from 'immer'
const ResponsiveReactGridLayout = WidthProvider(Responsive)

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
        <div key={i} className={l.static ? 'static' : ''}>
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
              <TextInput />
              <span className="text">
                {l.i} - {i}
              </span>
            </>
          )}
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
    console.log('on drop', this.state.layouts[this.state.currentBreakpoint])
    console.log('layout', layout)
    console.log(event)

    const orderedLayout = _.orderBy(layout, ['y'], ['asc'])

    console.log('orderedLayout', orderedLayout)

    // this.onLayoutChange(orderedLayout, this.state.layouts)

    this.setState(
      produce((draft) => {
        // draft.layouts[this.state.currentBreakpoint].push({
        //   x: layout[layout.length - 1].x,
        //   y: layout[layout.length - 1].y,
        //   w: layout[layout.length - 1].w,
        //   h: layout[layout.length - 1].h,
        //   i: `${draft.layouts[this.state.currentBreakpoint].length}`,
        //   static: layout[layout.length - 1].state,
        //   resizeHandles: layout[layout.length - 1].resizeHandles,
        //   minH: layout[layout.length - 1].minH,
        // })

        // draft.layouts.lg = layout
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
        <ResponsiveReactGridLayout
          {...this.props}
          layouts={this.state.layouts}
          onBreakpointChange={this.onBreakpointChange}
          onLayoutChange={this.onLayoutChange}
          // WidthProvider option
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
            i: `${this.state.layoutLength}`,
            w: 6,
            h: 6,
            minH: 2,
            static: false,
            isBounded: true,
            isDroppable: true,
            resizeHandles: ['s', 'n'],
          }}
          resizeHandles={['s', 'n']}
          // resizeHandle={(resizeHandleAxis) => (
          //   <ResizeHandle axis={resizeHandleAxis} />
          // )}
        >
          {this.generateDOM()}
        </ResponsiveReactGridLayout>
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
      minH: 1,
      // maxH: Infinity,
    }
  })
}

function nextState(component, recipe) {
  return () => component.setState(produce(recipe))
}
