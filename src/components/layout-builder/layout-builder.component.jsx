import React from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import ResizeHandle from '../resize-handle/resize-handle.component'
import { Responsive, WidthProvider } from 'react-grid-layout'
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
      currentBreakpoint: 'lg',
      compactType: 'vertical',
      mounted: false,
      layouts: { lg: props.initialLayout },
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
    return _.map(this.state.layouts.lg, (l, i) => {
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
            <span className="text">{i}</span>
          ) : (
            <>
              <input
                type="text"
                name="example"
                id="example"
                onSelect={() => this.onFieldSelect('email')}
              />
              <TextInput />
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
    this.props.onLayoutChange(layout, layouts)
  }

  onNewLayout() {
    this.setState({
      layouts: { lg: generateLayout() },
    })
  }

  onDragOver = (event) => {
    event.preventDefault()
    console.log('drag Over')
  }

  onDragEnter = (event) => {
    event.preventDefault()
    console.log('drag enter')
  }

  onDrop = (item, event) => {
    // event.preventDefault()
    console.log('on drop')
    console.log(item)
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
          onDrop={(layout, item, e) => this.onDrop(item, e)}
          droppingItem={{ i: 'aa', w: 6, h: 4 }}
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
      // minW: ?number = 0,
      // maxW: ?number = Infinity,
      minH: 1,
      // maxH: Infinity,
    }
  })
}
