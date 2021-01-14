const INITIAL_STATE = {
  selected: 'data/login.json',
  className: 'layout',
  rowHeight: 30,
  breakpoint: 'sm',
  compactType: 'vertical',
  onLayoutChange: () => {},
  cols: {
    lg: 12,
    md: 10,
    sm: 6,
    xs: 4,
    xxs: 2
  },
  localization: undefined,
  showErrors: false,
}

const gridReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    default:
      return state
  }
}

export default gridReducer