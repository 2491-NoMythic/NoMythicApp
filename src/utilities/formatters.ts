import { parse, format, isAfter, differenceInYears, differenceInCalendarYears } from 'date-fns'
import { mixed } from 'yup'

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

// return a day of week string like 'Monday'
const calculateDay = (meeting: string) => {
    const blah = parse(meeting, 'yyyy-MM-dd', new Date())
    return format(blah, 'EEEE')
}

// return a month string like 'February'
const calculateMonth = (aDate: string) => {
    const blah = parse(aDate, 'yyyy-MM-dd', new Date())
    return format(blah, 'MMMM')
}

// remove _ and capitalize words
const formatEnumValue = (value: string) => {
    if (value === undefined || value === null) return ''
    let words = value.split('_')
    words = words.map((word) => capitalizeWord(word))
    const word = words.reduce((prev, curr) => prev + ' ' + curr)
    return word
}

/*
 *  Return the grade of the student or 'Graduated'
 *  - graduation considered last day of june
 */
const calculateGrade = (gradYear: number) => {
    if (gradYear === null || gradYear === undefined) {
        return ''
    }
    const today = new Date()
    const gradDateString = gradYear.toString() + '-06-30'
    const gradDate = parse(gradDateString, 'yyyy-MM-dd', new Date())
    if (isAfter(today, gradDate)) {
        return 'Graduated ' + gradYear
    }
    const diff = differenceInYears(gradDate, today)
    return 12 - diff
}

type props = { mid?: number | string; pid?: number | string; id?: number | string }
/**
 * Formats a URL with id values and query string
 *
 * @param url the RouterKeys.nav url with :mid or :pid in it
 * @param props the mid or pid values to insert into the url
 * @param params the query string parameters to add to the end
 * @returns
 */
const formatUrl = (url: string, props?: props, params?: {}) => {
    let newUrl = url
    if (props) {
        if (props.mid !== undefined) {
            newUrl = newUrl.replace(':mid', props.mid.toString())
        }
        if (props.pid !== undefined) {
            newUrl = newUrl.replace(':pid', props.pid.toString())
        }
        if (props.id !== undefined) {
            newUrl = newUrl.replace(':id', props.id.toString())
        }
    }
    if (params) {
        const searchParams = new URLSearchParams(params)
        newUrl = newUrl + '?' + searchParams.toString()
    }
    return newUrl
}

export { capitalizeWord, calculateDay, calculatePercent, calculateMonth, formatEnumValue, calculateGrade, formatUrl }
