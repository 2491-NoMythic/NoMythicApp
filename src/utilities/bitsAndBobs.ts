const isEmpty = (value: any) => {
    if (value === undefined || value === null) {
        return true
    }
    if (typeof value === 'string' && value === '') {
        return true
    }
    // arrays are considered objects
    if (typeof value === 'object' && value.length === 0) {
        return true
    }
    return false
}

const isNotEmpty = (value: any) => {
    return !isEmpty(value)
}

export { isEmpty, isNotEmpty }
