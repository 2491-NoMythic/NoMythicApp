import { parse, format } from 'date-fns'

const capitalizeWord = (word: string): string => {
    if (word === undefined || word === null) {
        return ''
    }
    return word.charAt(0).toUpperCase() + word.slice(1)
}

const calculatePercent = (count: number, teamSize: number) => {
    if (count === 0 || teamSize === 0) {
        return 0
    }
    return ((count / teamSize) * 100).toFixed(0)
}

const calculateDay = (meeting: string) => {
    const blah = parse(meeting, 'yyyy-MM-dd', new Date())
    return format(blah, 'EEEE')
}

const calculateMonth = (aDate: string) => {
    const blah = parse(aDate, 'yyyy-MM-dd', new Date())
    return format(blah, 'MMMM')
}

export { capitalizeWord, calculateDay, calculatePercent, calculateMonth }
