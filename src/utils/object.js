export const isEmpty = (object) => !!!Object.keys(object).length
export const getKeyByValue = (object, value) =>
  Object.keys(object).find((key) => object[key] === value)
