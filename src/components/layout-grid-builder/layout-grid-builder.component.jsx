import React, {useState, useEffect, useMemo} from 'react'
import LayoutBuilder from '../layout-builder/layout-builder.component'
import FormBuilder from '../form-builder/form-builder.component'
import SchemaViewer from '../schema-viewer/schema-viewer.component'

import {isEmpty} from '../../utils/object'

import {connect} from 'react-redux'
import {createStructuredSelector} from 'reselect'

import {
  selectFormLayouts,
  selectFormDefault,
  selectFormModel,
  selectFormSchema,
} from '../../redux/form/form.selectors'
import {
  selectGridConfig,
  selectGridBreakpoint,
} from '../../redux/grid/grid.selectors'

const LayoutGridBuilder = ({config, layouts, form, schema, model}) => {
  const [formPart, setFormPart] = useState({})
  const [fieldKey, setFieldKey] = useState('')

  const onLayoutChange = (layouts) => {
    console.log('Layoutchanged', layouts)
    // setLayout(layouts)
  }

  const onFieldSelect = (form, key) => {
    console.log('fieldKey', key)
    setFieldKey(key)
    setFormPart(form)
  }

  useEffect(() => {}, [layouts])

  const stringifyLayout = useMemo(() => {
    console.log('stringifyLayout', layouts.length)
    if (!!layouts[config.breakpoint]) {
      return layouts[config.breakpoint].map((l) => {
        return (
          <div className="layoutItem" key={l.i}>
            <b>{l.i}</b>: [{l.x}, {l.y}, {l.w}, {l.h}, {}]
          </div>
        )
      })
    }
  }, [layouts])

  return (
    <>
      {console.log('asadasdas', config)}
      <div className="text-black font-sans ">
        <div className="layoutJSON">
          Displayed as <code>[x, y, w, h]</code>:
          <div className="columns">{stringifyLayout}</div>
        </div>
        <div className="">
          <div className="wrapper flex">
            <div className="bg-white text-black shadow-md border-gray-200 border-r">
              <div className="px-1 text-sm font-semibold mb-2 mt-2">Fields</div>
              <FormBuilder />
            </div>
            <div className="bg-backgroundLightest shadow-md p-4">
              {!isEmpty(layouts) && !isEmpty(schema) && (
                <LayoutBuilder
                  handleLayoutChange={onLayoutChange}
                  handleFieldSelect={onFieldSelect}
                  initialLayout={layouts}
                  initialSchema={schema}
                  initialForm={form}
                  initialModel={model}
                />
              )}
            </div>
            <div className="bg-white shadow-md">
              <SchemaViewer form={formPart} fieldKey={fieldKey} />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

const mapStateToProps = createStructuredSelector({
  config: selectGridConfig,
  layouts: selectFormLayouts,
  schema: selectFormSchema,
  model: selectFormModel,
  form: selectFormDefault,
})

export default connect(mapStateToProps)(LayoutGridBuilder)

// const contentDiv = document.getElementById("root");
// const gridProps = window.gridProps || {};
// ReactDOM.render(React.createElement(ExampleLayout, gridProps), contentDiv);
