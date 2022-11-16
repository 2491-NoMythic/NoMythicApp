const isEmpty = (value: any) => {
    if (value === undefined || value === null) {
        return true
    }
    if (typeof value === 'string' && value === '') {
        return true
    }
    if (typeof value === 'object' && value.length === 0) {
        return true
    }
    return false
}

export { isEmpty }
