import {
  createSelector
} from 'reselect'

const selectMapper = (state) => state.mapper

export const selectMapperSections = createSelector(
  [selectMapper],
  (mapper) => mapper
)