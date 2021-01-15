import {createSelector} from 'reselect'

const selectGrid = (state) => state.grid

export const selectGridConfig = createSelector([selectGrid], (grid) => grid)

export const selectGridBreakpoint = createSelector(
  [selectGridConfig],
  (grid) => grid.breakpoint,
)
