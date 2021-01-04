import React from 'react'
import LayoutBuilder from '../layout-builder/layout-builder.component'
import FormBuilder from '../form-builder/form-builder.component'
import SchemaViewer from '../schema-viewer/schema-viewer.component'

export default class LayoutGridBuilder extends React.Component {
  constructor(props) {
    super(props)
    this.state = { layout: [], fieldKey: '' }
    // this.onLayoutChange = this.onLayoutChange.bind(this)
  }

  onLayoutChange = (layout) => {
    this.setState({ layout: layout })
  }

  onFieldSelect = (key) => {
    this.setState({ fieldKey: key })
  }

  stringifyLayout() {
    return this.state.layout.map(function (l) {
      return (
        <div className="layoutItem" key={l.i}>
          <b>{l.i}</b>: [{l.x}, {l.y}, {l.w}, {l.h}]
        </div>
      )
    })
  }

  render() {
    return (
      <div className="text-black">
        <div className="layoutJSON">
          Displayed as <code>[x, y, w, h]</code>:
          <div className="columns">{this.stringifyLayout()}</div>
        </div>
        <div className="">
          <div className="wrapper ">
            <div className="bg-white text-black shadow-md border-gray-200 border-r">
              <div className="px-1 text-sm font-semibold mb-2 mt-2">Fields</div>
              <FormBuilder />
            </div>
            <div className="bg-indigo-50 shadow-md">
              <LayoutBuilder
                onLayoutChange={this.onLayoutChange}
                onFieldSelect={this.onFieldSelect}
              />
            </div>
            <div className="bg-white shadow-md">
              <SchemaViewer fieldKey={this.state.fieldKey} />
            </div>
          </div>
        </div>
      </div>
    )
  }
}

// const contentDiv = document.getElementById("root");
// const gridProps = window.gridProps || {};
// ReactDOM.render(React.createElement(ExampleLayout, gridProps), contentDiv);
