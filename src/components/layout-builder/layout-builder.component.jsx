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
import {formatISO} from '../../utils/date'
import clsx from 'clsx'

import merge from 'lodash/merge'
import isNil from 'lodash/isNil'
import utils from '../common/form/utils'

import {connect} from 'react-redux'
import {createStructuredSelector} from 'reselect'

import {
  selectMapperElements,
  selectMapperTypes,
} from '../../redux/mapper/mapper.selectors'

import {
  selectGridConfig,
  selectGridElementSelected,
  selectGridLastDroppedElement,
} from '../../redux/grid/grid.selectors'
import {
  setBreakpoint,
  setCompactType,
  setElementSelected,
} from '../../redux/grid/grid.actions'

import StatefulDrop from '../stateful-drop/stateful-drop.hoc'

const CustomGrid = memo(
  ({
    config,
    dispatch,
    lastDropped,
    initialLayout,
    handleLayoutChange,
    handleFieldSelect,
    droppedType,
    initialSchema,
    MapperTypes,
    initialForm,
    mapper,
    ignore,
    option,
    initialModel,
    localization,
    evalContext,
    errors,
    elemSelected,
    ...rest
  }) => {
    const [layouts, setLayouts] = useState(initialLayout) // {sm: initialLayout}
    const [layoutLength, setLayoutLength] = useState(initialLayout.length)
    const mounted = useRef(true) // component mounted or not
    const [schema, setSchema] = useState(initialSchema) // how the layout and fields
    const [form, setForm] = useState(initialForm) //how it looks
    const [model, setModel] = useState(initialModel) //how it looks

    useEffect(() => {
      // console.log('use Effect called')
      // setValues()

      return () => {
        mounted.current = false
      }
    }, []) // Using an empty dependency array ensures this only runs

    const onModelChange = (key, val, type) => {
      const newModel = model
      utils.selectOrSet(key, newModel, val, type)
      setModel(newModel)
    }

    // remove an item
    const onRemoveItem = (i) => {
      //console.log('removing', i)
      //console.log('before', layouts)
      setLayouts(
        produce((prev) => {
          prev[config.breakpoint].splice(i, 1)
        }),
      )
      //console.log('after', layouts)
      setLayoutLength(layoutLength - 1)
    }

    const onBreakpointChange = (breakpoint) =>
      dispatch(setBreakpoint(breakpoint))

    const onFieldSelect = (form, key) => {
      handleFieldSelect(form, key)
    }

    const onCompactTypeChange = () => {
      const newCompactType =
        config.compactType === 'horizontal'
          ? 'vertical'
          : config.compactType === 'vertical'
          ? null
          : 'horizontal'

      dispatch(setBreakpoint(newCompactType))
    }

    const onLayoutChange = (layout, item) => {
      handleLayoutChange(layout)
      console.log('onLayoutChange', layout, item)
    }

    const onDrop = (layout, item, event) => {
      // event.preventDefault()
      const key = item['i']

      console.log('droppedType', droppedType)

      console.log('item', item)

      setLayouts(
        produce((prev) => {
          prev[config.breakpoint] = layout
        }),
      )
      setLayoutLength(layoutLength + 1)

      setForm(
        produce((prev) => {
          prev.push(key)
        }),
      )

      setSchema(
        produce((prev) => {
          prev['properties'][key] = {
            title: 'Name',
            type: 'string',
            default: 'Steve',
          }
        }),
      )

      dispatch(setElementSelected(key))
    }

    // Assign default values and save it to the model
    const setDefault = (key, model, form, value) => {
      // console.log('\t\tSchema Form - setDefault', key, model, form, value)

      console.log('setDefault', key, model, form, value)

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
            : formatISO,
      }
    }

    const builder = (form, model, index, mapper, onChange, builder) => {
      // console.log('inside builder schemeForm')
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

      // console.log('the key is ', key)

      const idx = utils.getIndexFromLayout(layouts[config.breakpoint], key)
      const grid = layouts[config.breakpoint][idx]
      // console.log('localizaton', getLocalization())
      console.log('assadsad', elemSelected)
      console.log('assadsad match', elemSelected === grid.i)
      return (
        <div
          key={grid.i}
          className={clsx('form-block', {
            static: grid.static,
            'border-selected': elemSelected === grid.i,
          })}
          data-grid={grid}
          onClick={() => {
            dispatch(setElementSelected(key))
            onFieldSelect(form, key)
          }}>
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
            showErrors={config.showErrors}
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

        console.log()
        console.log('merged', merged)

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
    }, [schema, form, layouts, elemSelected])

    return (
      <>
        {/* {console.log('renddder')} */}
        <div>
          <div className="div">
            Dropped Type: {lastDropped}{' '}
            {/* {getKeyByValue(MapperTypes, droppedType)} */}
          </div>
          Current Breakpoint: {config.breakpoint} (
          {rest.cols[config.breakpoint]} columns)
        </div>
        <div>
          Compaction type: {_.capitalize(config.compactType) || 'No Compaction'}
        </div>
        <button onClick={onCompactTypeChange}>Change Compaction Type</button>
        <ResponsiveReactGridLayout
          {...rest}
          layouts={layouts}
          onBreakpointChange={onBreakpointChange}
          onLayoutChange={(layout, layouts) => onLayoutChange(layout, layouts)}
          measureBeforeMount={true}
          useCSSTransforms={mounted.current}
          compactType={config.compactType}
          preventCollision={!config.compactType}
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
            static: false,
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

const LayoutBuilder = StatefulDrop(CustomGrid)

LayoutBuilder.propTypes = {
  onLayoutChange: PropTypes.func.isRequired,
}

LayoutBuilder.defaultProps = {
  className: 'layout',
  rowHeight: 30,
  onLayoutChange: function () {},
  cols: {lg: 12, md: 10, sm: 6, xs: 4, xxs: 2},
  initialLayout: {},
  localization: undefined,
  showErrors: false,
}

const mapStateToProps = createStructuredSelector({
  mapper: selectMapperElements,
  MapperTypes: selectMapperTypes,
  config: selectGridConfig,
  elemSelected: selectGridElementSelected,
  lastDropped: selectGridLastDroppedElement,
})

export default connect(mapStateToProps)(LayoutBuilder)
