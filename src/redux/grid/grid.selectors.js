import {
  createSelector
} from 'reselect'

const selectGrid = (state) => state.grid

export const selectGridElements = createSelector(
  [selectGrid],
  (grid) => grid.elements
)

export const selectGridTypes = createSelector(
  [selectGrid],
  (grid) => grid.types
)