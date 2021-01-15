import {createSelector} from 'reselect'

const selectForm = (state) => state.form

import utils from '../../utils/formBuilder'

export const selectFormDefault = createSelector(
  [selectForm],
  (form) => form.form,
)
export const selectFormSelected = createSelector(
  [selectForm],
  (form) => form.selected,
)
export const selectFormModel = createSelector(
  [selectForm],
  (form) => form.model,
)
export const selectFormLayouts = createSelector(
  [selectForm],
  (form) => form.layouts,
)
export const selectFormSchema = createSelector(
  [selectForm],
  (form) => form.schema,
)
export const selectIsFormFetching = createSelector(
  [selectForm],
  (form) => form.isFetching,
)

export const selectIsFormLoaded = createSelector(
  [selectForm],
  (form) => !!form.form && !!form.schema,
)

export const selectFormCurrentLayout = (breakpoint) =>
  createSelector([selectFormLayouts], (layouts) =>
    layouts ? layouts[breakpoint] : 0,
  )

export const selectFormLayoutLength = (breakpoint) =>
  createSelector([selectFormLayouts], (layouts) =>
    layouts ? layouts[breakpoint].length : 0,
  )
