import {
    getYear,
    getMonth,
    getDay,
    startOfWeek,
    endOfMonth,
    getWeeksInMonth,
    getDaysInMonth,
    addDays,
    isEqual,
    format,
    parse,
} from 'date-fns'
import { MonthValues, Month, Week } from './types'

/**
 * Takes a date and get relevent calendar information for a month based calendar
 *
 * @param aDate and day within the month you want to create a calendar for
 * @returns MonthValues
 */
const getMonthValues = (aDate: Date): MonthValues => {
    const justDate = stripTime(aDate)
    const weekStartsOn = 0
    const year = getYear(justDate)
    const month = getMonth(justDate) // why 0 based?
    const justToday = getToday()
    const beginOfMonthDate = new Date(year, month, 1)
    const startOfCalMonth = startOfWeek(beginOfMonthDate, { weekStartsOn })
    const startDayOfCal = getDay(startOfCalMonth)
    const endOfMonthDate = endOfMonth(justDate)
    const lastDayOfCal = getDay(endOfMonthDate)
    const weeks = getWeeksInMonth(justDate)
    const days = getDaysInMonth(justDate)
    return {
        weekStartsOn,
        today: justToday,
        year,
        month,
        beginOfMonthDate,
        startOfCalMonth,
        startDayOfCal,
        endOfMonthDate,
        lastDayOfCal,
        weeks,
        days,
    }
}

/**
 * Builds a calendar for UI display
 * @param monthValues type MonthValues
 * @returns type Month
 */
const getCalendar = (monthValues: MonthValues) => {
    let weekStart = monthValues.startOfCalMonth
    const aMonth = [] as Month
    for (let widx = 0; widx < monthValues.weeks; widx++) {
        const aWeek = [] as Week
        for (let didx = 0; didx < 7; didx++) {
            const theDate = addDays(weekStart, didx)
            const inMonth = getMonth(theDate) === monthValues.month
            const isToday = isEqual(theDate, monthValues.today)
            aWeek[didx] = { date: theDate, inMonth, isToday }
        }
        weekStart = addDays(aWeek[6].date, 1)
        aMonth[widx] = aWeek
    }
    return aMonth
}

/**
 * Remove the time component from a date
 *
 * @param aDate type Date
 * @returns type Date
 */
const stripTime = (aDate: Date) => {
    return new Date(getYear(aDate), getMonth(aDate), getDay(aDate))
}

/**
 * Get the date of today with no time component
 *
 * @returns type Date
 */
const getToday = () => {
    return stripTime(new Date())
}

/**
 * Formats the date to yyyy-MM-dd
 *
 * @param aDate type Date
 * @returns string 'yyyy-MM-dd'
 */
const toYMD = (aDate: Date) => {
    return format(aDate, 'yyyy-MM-dd')
}
/**
 * Formats the date to MM/dd/yyyy
 *
 * @param aDate type Date
 * @returns string 'MM/dd/yyyy'
 */
const toMDY = (aDate: Date) => {
    return format(aDate, 'MM/dd/yyyy')
}

/**
 * Creates a Date object
 *
 * @param aDate string in formate 'yyyy-MM-dd'
 * @returns type Date
 */
const toDate = (aDate: string) => {
    return parse(aDate, 'yyyy-MM-dd', new Date())
}

export { getMonthValues, getCalendar, toYMD, toMDY, stripTime, getToday, toDate }
