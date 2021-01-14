export const formatISO = (date) => {
    let value =
        (date && typeof date === 'object' && date.toISOString().slice(0, 10)) ||
        date
    if (!value) value = ''
    if (value.length > 0) value = new Date(value).toISOString().slice(0, 10)
    return value
}