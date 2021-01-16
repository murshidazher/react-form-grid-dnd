import produce from 'immer'
import {getIndexFromLayout} from '../../utils/formBuilder'

export const setNewBreakpointLayout = (state, breakpoint, layout) => {
  console.log('inside the action', state, breakpoint, layout)
  return produce(state, (drafState) => {
    drafState['layouts'][breakpoint] = layout
  })
}

export const removeElementFromLayoutBreakpoint = (
  state,
  breakpoint,
  key,
  idx
) => {
  const x = produce(state, (drafState) => {
    drafState['layouts'][breakpoint].splice(idx, 1) // remove from layout breakpoint schema
    delete drafState['schema']['properties'][key] // remove from schema properties
    drafState['schema']['required'].splice(
      drafState['schema']['required'].indexOf(key),
      1
    ) // remove schema required

    // remove from form ui
    if (!key.includes('text')) {
      const i = drafState['form'].findIndex((x) => x.key[0] === key)
      drafState['form'].splice(i, 1)
    } else {
      drafState['form'].splice(drafState['form'].indexOf(key), 1)
    }
  })

  console.log('removeElementFromLayoutBreakpoint - form', x['form'])
  console.log(
    'removeElementFromLayoutBreakpoint - layouts',
    x['layouts'][breakpoint]
  )
  console.log('removeElementFromLayoutBreakpoint - schema', x['schema'])
  return x
}

export const addNewElementToForm = (form, key) => {
  return produce(form, (draftForm) => {
    draftForm.push(key)
  })
}

export const addNewPropertyToSchema = (schema, key, property) => {
  return produce(schema, (draftSchema) => {
    draftSchema['properties'][key] = property
  })
}
