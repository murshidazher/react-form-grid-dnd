export const addItemToForm = (formItems, formItemToAdd) => {
  const existingFormItem = formItems.find(
    (formItem) => formItem.id === formItemToAdd.id,
  )

  if (existingFormItem) {
    return formItems.map((formItem) =>
      formItem.id === formItemToAdd.id
        ? {...formItem, quantity: formItem.quantity + 1}
        : formItem,
    )
  }

  return [...formItems, {...formItemToAdd, quantity: 1}]
}

export const removeItemFromForm = (formItems, formItemToRemove) => {
  const existingFormItem = formItems.find(
    (formItem) => formItem.id === formItemToRemove.id,
  )

  if (existingFormItem.quantity === 1) {
    return formItems.filter((formItem) => formItem.id !== formItemToRemove.id)
  }

  return formItems.map((formItem) =>
    formItem.id === formItemToRemove.id
      ? {...formItem, quantity: formItem.quantity - 1}
      : formItem,
  )
}

export const getSchema = (formItems, formItemToAdd) => {
  const existingFormItem = formItems.find(
    (formItem) => formItem.id === formItemToAdd.id,
  )

  if (existingFormItem) {
    return formItems.map((formItem) =>
      formItem.id === formItemToAdd.id
        ? {...formItem, quantity: formItem.quantity + 1}
        : formItem,
    )
  }

  return [...formItems, {...formItemToAdd, quantity: 1}]
}
