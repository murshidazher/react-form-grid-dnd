import React, {
  memo,
  useState,
  useMemo,
  useCallback,
  useRef,
  useEffect,
} from 'react'
import PropTypes from 'prop-types'
import _, {template} from 'lodash'
import {Responsive, WidthProvider} from 'react-grid-layout'
import produce from 'immer'
const ResponsiveReactGridLayout = WidthProvider(Responsive)
import {getKeyByValue} from '../../utils/object'
import {useDrop} from 'react-dnd'
import {FormElements} from '../FormElements'

import merge from 'lodash/merge'
import isNil from 'lodash/isNil'
import utils from '../common/form/utils'

import {connect} from 'react-redux'
import {createStructuredSelector} from 'reselect'

import {selectMapperSections} from '../../redux/mapper/mapper.selectors'

import StatefulDrop from '../stateful-drop/stateful-drop.hoc'

const formatDate = (date) => {
  let value =
    (date && typeof date === 'object' && date.toISOString().slice(0, 10)) ||
    date
  if (!value) value = ''
  if (value.length > 0) value = new Date(value).toISOString().slice(0, 10)
  return value
}

const MyGrid = memo(
  ({
    initialLayout,
    initialBreakpoint = 'sm',
    initialCompactType = 'vertical',
    handleLayoutChange,
    handleFieldSelect,
    droppedType,
    initialSchema,
    initialForm,
    mapper,
    ignore,
    option,
    initialModel,
    localization,
    showErrors,
    evalContext,
    errors,
    ...rest
  }) => {
    const [currentBreakpoint, setCurrentBreakpoint] = useState(
      initialBreakpoint,
    )
    const [compactType, setCompactType] = useState(initialCompactType)
    const [layouts, setLayouts] = useState({}) // {sm: initialLayout}
    const [layoutLength, setLayoutLength] = useState(initialLayout.length)
    const mounted = useRef(true) // component mounted or not
    const [schema, setSchema] = useState(initialSchema) // how the layout and fields
    const [form, setForm] = useState(initialForm) //how it looks
    const [model, setModel] = useState(initialModel) //how it looks

    useEffect(() => {
      console.log('use Effect called')
      setValues()

      return () => {
        mounted.current = false
      }
    }, []) // Using an empty dependency array ensures this only runs

    const onModelChange = (key, val, type) => {
      const newModel = model
      utils.selectOrSet(key, newModel, val, type)
      setModel(newModel)
    }

    const setValues = async () => {
      onSelectChange({
        target: {value: 'data/login.json'},
      }).then((res) => {
        setLayouts(res['initialLayout'])
        setSchema(res['initialSchema'])
        setForm(res['initialForm'])
        setLayoutLength(res['initialLayout']['sm'].length)
        mapper = res['mapper']
        setModel(res['model'])
      })
    }
    // remove an item
    const onRemoveItem = (i) => {
      //console.log('removing', i)
      //console.log('before', layouts)
      setLayouts(
        produce((prev) => {
          prev[currentBreakpoint].splice(i, 1)
        }),
      )
      //console.log('after', layouts)
      setLayoutLength(layoutLength - 1)
    }

    const onBreakpointChange = (breakpoint) => setCurrentBreakpoint(breakpoint)

    const onFieldSelect = (form, key) => {
      console.log('ddfdfsfadfds')
      handleFieldSelect(form, key)
    }

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
        }),
      )
    }

    const onDrop = (layout, item, event) => {
      // event.preventDefault()
      // console.log('layout', layout)

      const newLayout = layouts[currentBreakpoint]
      newLayout[0].y = layout[0].y
      newLayout[0].x = layout[0].x
      newLayout[1] = layout[1]
      setLayouts(
        produce((prev) => {
          prev[currentBreakpoint] = newLayout
        }),
      )
      setLayoutLength(layoutLength + 1)

      setForm(
        produce((prev) => {
          prev.push('form_element0')
        }),
      )

      setSchema(
        produce((prev) => {
          prev['properties']['form_element0'] = {
            title: 'Name',
            type: 'string',
            default: 'Steve',
          }
        }),
      )
    }

    // Assign default values and save it to the model
    const setDefault = (key, model, form, value) => {
      // console.log('\t\tSchema Form - setDefault', key, model, form, value)
      const currentValue = utils.selectOrSet(key, model)

      // If current value is not setted and exist a default, apply the default over the model
      if (isNil(currentValue) && !isNil(value))
        onModelChange(key, value, form.type, form)
    }

    const getLocalization = () => {
      // console.log('\t\tSchema Form - getLocalization', localization)
      return {
        getLocalizedString:
          localization && localization.getLocalizedString
            ? localization.getLocalizedString
            : (value) => value,
        getLocalizedNumber:
          localization && localization.getLocalizedNumber
            ? localization.getLocalizedNumber
            : (value) => value,
        getLocalizedDate:
          localization && localization.getLocalizedDate
            ? localization.getLocalizedDate
            : formatDate,
      }
    }

    const builder = (form, model, index, mapper, onChange, builder) => {
      console.log('inside builder schemeForm')
      const Field = mapper[form.type]
      if (!Field) {
        return null
      }

      // Apply conditionals to review if this field must be rendered
      if (
        form.condition &&
        !utils.safeEval(form.condition, {
          model,
          form,
          ...evalContext,
        })
      ) {
        return null
      }

      const key = (form.key && form.key.join('.')) || index

      const error = errors && key in errors ? errors[key] : null

      console.log('the key is ', key)

      const idx = utils.getIndexFromLayout(layouts[currentBreakpoint], key)
      const grid = layouts[currentBreakpoint][idx]
      return (
        <div
          key={idx}
          id={key}
          className={grid.static ? 'form-block static' : 'form-block'}
          data-grid={grid}
          onClick={() => onFieldSelect(form, key)}>
          <Field
            model={model}
            form={form}
            key={key}
            onChange={onChange}
            setDefault={setDefault}
            mapper={mapper}
            builder={builder}
            errorText={error}
            localization={getLocalization()}
            showErrors={showErrors}
            disabled
          />
          <span className="remove btn-remove" onClick={() => onRemoveItem(key)}>
            x
          </span>
        </div>
      )
    }

    const children = useMemo(() => {
      if (form) {
        const merged = utils.merge(schema, form, ignore, option, null)

        let mergedMapper = mapper
        if (mapper) {
          mergedMapper = merge(mapper, mapper)
        }

        return merged.map((formPart, index) => {
          return builder(
            formPart,
            model,
            index,
            mergedMapper,
            onModelChange,
            builder,
          )
        })
      }
    }, [schema, form, layouts])

    // const generateChildren = useMemo(() => {
    //   console.log('children generate', layouts)
    //   return _.orderBy(layouts[currentBreakpoint], ['y'], ['asc']).map(
    //     (l, i) => {
    //       console.log('data-grid', l)
    //       return (
    //         <a
    //           key={l.i}
    //           id={l.i}
    //           className={l.static ? 'static' : ''}
    //           data-grid={l}
    //           onClick={(e) => e.preventDefault()}
    //         >
    //           {l.static ? (
    //             <span
    //               className="text"
    //               title="This item is static and cannot be removed or resized."
    //             >
    //               Static - {i}
    //             </span>
    //           ) : l.i === 'form_element1' ? (
    //             builder(form[l.i], l.i)
    //           ) : (
    //             // <span className="text">
    //             //   {l.i} - {i}
    //             // </span>
    //             <>
    //               <input
    //                 type="text"
    //                 name="example"
    //                 id="example"
    //                 onSelect={() => onFieldSelect('email')}
    //               />
    //               {/* <TextInput /> */}
    //               <span className="text">
    //                 {l.i} - {i}
    //               </span>
    //             </>
    //           )}

    //           <span
    //             className="remove btn-remove"
    //             onClick={() => onRemoveItem(i)}
    //           >
    //             x
    //           </span>
    //         </a>
    //       )
    //     }
    //   )
    // }, [layouts])

    return (
      <>
        {console.log('renddder')}
        <div>
          <div className="div">
            Dropped Type: {droppedType}{' '}
            {getKeyByValue(FormElements, droppedType)}
          </div>
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
          isBounded={true}
          isDroppable={true}
          resizeHandles={['se', 'ne']}
          onDrop={(layout, item, e) => onDrop(layout, item, e)}
          droppingItem={{
            i: 'form_element0',
            w: 6,
            h: 2,
            minH: 2,
            static: false,
            isBounded: true,
            isDroppable: true,
            resizeHandles: ['s', 'n'],
            field: 'text',
          }}
          resizeHandles={['s', 'n']}>
          {children}
        </ResponsiveReactGridLayout>
      </>
    )
  },
)

function generateLayout() {
  return _.map(_.range(0, 1), function (item, i) {
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

const onSelectChange = async ({target: {value}}) => {
  let temp = {}
  if (!value) {
    temp = {
      schemaJson: '',
      formJson: '',
      layoutJson: '',
      selected: '',
      initialSchema: {},
      initialLayout: {},
      model: {},
      initialForm: [],
      showErrors: false,
    }

    return temp
  }

  if (!value.endsWith('json')) {
    const elem = examples[value]
    temp = {
      schemaJson: JSON.stringify(elem.schema, undefined, 2),
      formJson: JSON.stringify(elem.form, undefined, 2),
      layoutJson: JSON.stringify(elem.layout, undefined, 2),
      selected: value,
      initialSchema: elem.schema,
      model: elem.model || {},
      initialLayout: elem.layout,
      initialForm: elem.form,
      localization: elem.localization,
      showErrors: false,
    }

    return temp
  } else {
    return fetch(value)
      .then((x) => x.json())
      .then(({form, schema, model, layout}) => {
        temp = {
          schemaJson: JSON.stringify(schema, undefined, 2),
          formJson: JSON.stringify(form, undefined, 2),
          layoutJson: JSON.stringify(layout, undefined, 2),
          selected: value,
          initialSchema: schema,
          initialLayout: layout,
          model: model || {},
          initialForm: form,
          showErrors: false,
        }

        return temp
      })
  }
}

const LayoutBuilder = StatefulDrop(MyGrid)

LayoutBuilder.propTypes = {
  onLayoutChange: PropTypes.func.isRequired,
}

LayoutBuilder.defaultProps = {
  className: 'layout',
  rowHeight: 30,
  initialBreakpoint: 'sm',
  compactType: 'vertical',
  onLayoutChange: function () {},
  cols: {lg: 12, md: 10, sm: 6, xs: 4, xxs: 2},
  initialLayout: {},
  localization: undefined,
  showErrors: false,
}

const mapStateToProps = createStructuredSelector({
  mapper: selectMapperSections,
})

export default connect(mapStateToProps)(LayoutBuilder)
