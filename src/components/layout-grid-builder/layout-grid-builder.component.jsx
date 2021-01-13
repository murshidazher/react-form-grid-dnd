import React, { useState, useEffect } from 'react'
import LayoutBuilder from '../layout-builder/layout-builder.component'
import FormBuilder from '../form-builder/form-builder.component'
import SchemaViewer from '../schema-viewer/schema-viewer.component'

const LayoutGridBuilder = () => {
  // const [tests, setTests] = useState(
  //   [
  //     {
  //       label: 'Login',
  //       value: 'data/login.json',
  //     },
  //   ]
  // )

  // const [validationResult, setValidationResult] = useState({})
  // const [schema, setSchema] = useState({})
  // const [form, setForm] = useState([])
  const [layout, setLayout] = useState({})
  const [form, setForm] = useState({})
  const [fieldKey, setFieldKey] = useState('')
  // const [model, setModel] = useState({})
  // const [model, setModel] = useState({})
  // const [model, setModel] = useState({})
  // const [model, setModel] = useState({})

  const onLayoutChange = (layout) => {
    setLayout(layout)
  }

  const onFieldSelect = (form, key) => {
    setFieldKey(key)
    setForm(form)
  }

  const stringifyLayout = () => {
    return layout.map((l) => {
      return (
        <div className="layoutItem" key={l.i}>
          <b>{l.i}</b>: [{l.x}, {l.y}, {l.w}, {l.h}, {}]
        </div>
      )
    })
  }

  return (
    <>
      <div className="text-black font-sans">
        <div className="layoutJSON">
          Displayed as <code>[x, y, w, h]</code>:
          {/* <div className="columns">{stringifyLayout()}</div> */}
        </div>
        <div className="">
          <div className="wrapper flex">
            <div className="bg-white text-black shadow-md border-gray-200 border-r">
              <div className="px-1 text-sm font-semibold mb-2 mt-2">Fields</div>
              <FormBuilder />
            </div>
            <div className="bg-backgroundLightest shadow-md">
              <LayoutBuilder
                handleLayoutChange={onLayoutChange}
                handleFieldSelect={onFieldSelect}
              />
            </div>
            <div className="bg-white shadow-md">
              <SchemaViewer form={form} fieldKey={fieldKey} />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default LayoutGridBuilder

// const contentDiv = document.getElementById("root");
// const gridProps = window.gridProps || {};
// ReactDOM.render(React.createElement(ExampleLayout, gridProps), contentDiv);
