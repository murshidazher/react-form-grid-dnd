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
import { Responsive, WidthProvider } from 'react-grid-layout'
import produce from 'immer'
const ResponsiveReactGridLayout = WidthProvider(Responsive)
import GridLayout from 'react-grid-layout'
import { getKeyByValue } from '../../utils/object'
import Text from '../common/form/Text'
import { useDrop } from 'react-dnd'
import { FormElements } from '../FormElements'
import SchemaForm from '../common/form/SchemaForm'

// export default One
const withStatefulDrop = (BaseComponent) => (props) => {
  const [lastDroppedColor, setLastDroppedColor] = useState(null)
  const onDrop = useCallback((color) => setLastDroppedColor(color), [])

  const [{ isOver, draggingColor, canDrop }, drop] = useDrop({
    accept: [FormElements.markdown, FormElements.text],
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

      {!canDrop && lastDroppedColor && (
        <p>Last dropped item: {lastDroppedColor}</p>
      )}
      <BaseComponent {...props} droppedType={lastDroppedColor} />
    </div>
  )
}

const initialJSONSchema = {
  type: 'object',
  title: 'Comment',
  required: ['form_element1'],
  properties: {
    form_element1: {
      title: 'Name',
      type: 'string',
      default: 'Steve',
    },
  },
}

const initialUISchema = {
  form_element1: {
    type: 'text',
    'ui:autofocus': true,
  },
}

const mapper = {
  text: Text,
}

const MyGrid = memo(
  ({
    initialLayout,
    initialBreakpoint = 'sm',
    initialCompactType = 'vertical',
    handleLayoutChange,
    handleFieldSelect,
    droppedType,
    children,
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
    const [schema, setSchema] = useState(initialJSONSchema) // how the layout and fields
    const [form, setForm] = useState(initialUISchema) //how it looks

    useEffect(() => {
      console.log('use Effect called')
      return () => {
        mounted.current = false
      }
    }, []) // Using an empty dependency array ensures this only runs

    // remove an item
    const onRemoveItem = (i) => {
      //console.log('removing', i)
      //console.log('before', layouts)
      setLayouts(
        produce((prev) => {
          prev[currentBreakpoint].splice(i, 1)
        })
      )
      //console.log('after', layouts)
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
      setLayouts(
        produce((prev) => {
          prev[currentBreakpoint] = layout
        })
      )
      setLayoutLength(layoutLength + 1)
    }

    const builder = (form, key) => {
      const Field = mapper[form.type]
      if (!Field) {
        return null
      }

      return (
        <Field
          key={key}
          form={initialJSONSchema['properties'][key]}
          error={''}
        />
      )
    }

    const generateChildren = useMemo(() => {
      //console.log('children generate')
      return _.orderBy(layouts[currentBreakpoint], ['y'], ['asc']).map(
        (l, i) => {
          console.log('data-grid', l)
          return (
            <a
              key={l.i}
              id={l.i}
              className={l.static ? 'static' : ''}
              data-grid={l}
              onClick={(e) => e.preventDefault()}
            >
              {l.static ? (
                <span
                  className="text"
                  title="This item is static and cannot be removed or resized."
                >
                  Static - {i}
                </span>
              ) : l.i === 'form_element1' ? (
                builder(form[l.i], l.i)
              ) : (
                // <span className="text">
                //   {l.i} - {i}
                // </span>
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
                className="remove btn-remove"
                onClick={() => onRemoveItem(i)}
              >
                x
              </span>
            </a>
          )
        }
      )
    }, [layouts])

    return (
      <>
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
            i: 'form_element' + layoutLength.toString(),
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
        >
          {children || generateChildren}
        </ResponsiveReactGridLayout>
      </>
    )
  }
)

const LayoutBuilder = withStatefulDrop(MyGrid)

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
  // generate: null,
}

export default LayoutBuilder

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
