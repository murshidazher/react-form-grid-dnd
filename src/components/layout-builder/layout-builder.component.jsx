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
import {Responsive, WidthProvider} from 'react-grid-layout'
import produce from 'immer'
const ResponsiveReactGridLayout = WidthProvider(Responsive)
import {formatISO} from '../../utils/date'
import clsx from 'clsx'

import {v4 as uuidv4} from 'uuid'
// uuidv4(); // ⇨ '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d'
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
import {
  selectFormLayouts,
  selectFormSchema,
  selectFormDefault,
  selectFormModel,
} from '../../redux/form/form.selectors'

import {setLastDroppedElement} from '../../redux/grid/grid.actions'
import {
  addNewElementToForm,
  addNewPropertyToSchema,
  setBreakpointLayout,
  setModel,
  removeElementFromLayoutBreakpoint,
} from '../../redux/form/form.actions'

const CustomGrid = memo(
  ({
    config,
    dispatch,
    lastDropped,
    layouts,
    setNewBreakpointLayout,
    addNewPropertyToSchema,
    addNewElementToForm,
    removeElementFromLayoutBreakpoint,
    setModel,
    handleLayoutChange,
    handleFieldSelect,
    schema,
    MapperTypes,
    form,
    mapper,
    ignore,
    option,
    model,
    localization,
    evalContext,
    errors,
    elemSelected,
    ...rest
  }) => {
    const [layoutLength, setLayoutLength] = useState(2)
    const mounted = useRef(true) // component mounted or not

    useEffect(() => {
      return () => {
        mounted.current = false
      }
    }, []) // Using an empty dependency array ensures this only runs

    const onModelChange = (key, val, type) => {
      const newModel = produce(model, (drafModel) => {
        return utils.selectOrSet(key, drafModel, val, type)
      })

      setModel(newModel)
    }

    // remove an item
    const onRemoveItem = (key, i) => {
      removeElementFromLayoutBreakpoint(config.breakpoint, key, i)

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
    }

    const onDrop = (layout, item, event) => {
      // const key = `${lastDropped}${layoutLength}`
      // const temp = layout.map((obj) =>
      //   obj.i === 'form_element0' ? {...obj, i: key} : obj
      // )

      const key = item['i']

      addNewElementToForm(key)

      addNewPropertyToSchema(key, {
        title: 'Name',
        type: 'string',
        default: 'Steve',
      })

      setNewBreakpointLayout(config.breakpoint, layout)

      setLayoutLength(layoutLength + 1)
    }

    // Assign default values and save it to the model
    const setDefault = (key, model, form, value) => {
      console.log('setDefault', key, model)
      // const currentValue = utils.selectOrSet(key, model)

      const currentValue = produce(model, (drafModel) => {
        return utils.selectOrSet(key, drafModel)
      })

      // If current value is not setted and exist a default, apply the default over the model
      if (isNil(currentValue) && !isNil(value))
        onModelChange(key, value, form.type, form)
    }

    const getLocalization = () => {
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

    const onGridElementSelect = (formPart, key) => {
      dispatch(setElementSelected(key))
      onFieldSelect(formPart, key)
    }

    const builder = (form, model, index, mapper, onChange, builder) => {
      console.log('builder', form, model, layouts)
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

      const idx = utils.getIndexFromLayout(layouts[config.breakpoint], key)
      console.log('getIndexFromLayout', layouts, key, idx)

      const grid = layouts[config.breakpoint][idx]

      return (
        <div
          key={grid.i}
          // key={idx}
          className={clsx('form-block', {
            static: grid.static,
            'border-selected': elemSelected === grid.i,
          })}
          data-grid={grid}
          onClick={() => {
            onGridElementSelect(form, key)
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
          <span
            className="remove btn-remove"
            onClick={() => onRemoveItem(key, idx)}>
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

        console.log('inside children', schema, form, ignore, option, null)

        return merged.map((formPart, index) => {
          return builder(
            formPart,
            model,
            index,
            mergedMapper,
            onModelChange,
            builder
          )
        })
      }
    }, [layouts, elemSelected])

    return (
      <>
        <div>
          <div className="div">Dropped Type: {lastDropped} </div>
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
            i: `${lastDropped}${layoutLength}`,
            w: 6,
            h: 2,
            minH: 2,
            maxH: 4,
            static: false,
            isBounded: true,
            isDroppable: true,
            static: false,
            resizeHandles: ['s', 'n'],
          }}
          resizeHandles={['s', 'n']}>
          {children}
        </ResponsiveReactGridLayout>
      </>
    )
  }
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

const mapDispatchToProps = (dispatch) => ({
  setNewBreakpointLayout: (breakpoint, layout) =>
    dispatch(setBreakpointLayout(breakpoint, layout)),
  addNewPropertyToSchema: (key, property) =>
    dispatch(addNewPropertyToSchema(key, property)),
  addNewElementToForm: (key) => dispatch(addNewElementToForm(key)),
  setModel: () => dispatch(setModel()),
  removeElementFromLayoutBreakpoint: (breakpoint, key, idx) =>
    dispatch(removeElementFromLayoutBreakpoint(breakpoint, key, idx)),
  dispatch: (cb) => dispatch(cb),
})

const mapStateToProps = createStructuredSelector({
  mapper: selectMapperElements,
  MapperTypes: selectMapperTypes,
  config: selectGridConfig,
  elemSelected: selectGridElementSelected,
  lastDropped: selectGridLastDroppedElement,
  layouts: selectFormLayouts,
  schema: selectFormSchema,
  model: selectFormModel,
  form: selectFormDefault,
})

export default connect(mapStateToProps, mapDispatchToProps)(LayoutBuilder)
