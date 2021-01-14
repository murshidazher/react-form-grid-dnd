import {
  createSelector
} from 'reselect'

const selectMapper = (state) => state.mapper

export const selectMapperElements = createSelector(
  [selectMapper],
  (mapper) => mapper.elements
)

export const selectMapperTypes = createSelector(
  [selectMapper],
  (mapper) => mapper.types
)