const capitalizeWord = (word: string): string => {
    if (word === undefined || word === null) {
        return ''
    }
    return word.charAt(0).toUpperCase() + word.slice(1)
}

export { capitalizeWord }
