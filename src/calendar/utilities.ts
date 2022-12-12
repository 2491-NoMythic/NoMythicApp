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
    getDate,
    endOfWeek,
    isValid,
} from 'date-fns'
import { RobotEvent } from '../types/Api'
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
    const month = getMonth(justDate) // this is 0 based?
    const justToday = getToday()
    const beginOfMonthDate = new Date(year, month)
    const startOfCalMonth = startOfWeek(beginOfMonthDate, { weekStartsOn })
    const startDayOfCal = getDay(startOfCalMonth)
    const endOfMonthDate = endOfMonth(justDate)
    const endOfCalMonth = endOfWeek(endOfMonthDate, { weekStartsOn })
    const lastDayOfCal = getDay(endOfMonthDate)
    const weeks = getWeeksInMonth(justDate)
    const days = getDaysInMonth(justDate)
    return {
        weekStartsOn,
        today: justToday,
        baseDate: justDate,
        year,
        month,
        beginOfMonthDate,
        startOfCalMonth,
        endOfCalMonth,
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
            const isSelected = isEqual(theDate, monthValues.baseDate)
            aWeek[didx] = { date: theDate, inMonth, isToday, isSelected }
        }
        weekStart = addDays(aWeek[6].date, 1)
        aMonth[widx] = aWeek
    }
    return aMonth
}

/**
 * Get array of events for a given date
 *
 * @param aDate type Date in the calendar
 * @param eventData Array of events for that date
 * @returns
 */
const getSelectedEvents = (aDate: Date | string, eventData: RobotEvent[]) => {
    if (!eventData) return []
    const dateStr = typeof aDate === 'string' ? aDate : toYMD(aDate)
    return eventData.filter((aEvent) => dateStr === aEvent.event_date) || []
}

/**
 * Returns a canendar merged with events for display in ui
 * can we just use one version of these getCalendar methods??
 *
 * @param monthValues type MonthValues
 * @param eventData Array of event data
 * @returns
 */

const getCalendarMerged = (monthValues: MonthValues, eventData: RobotEvent[]) => {
    let weekStart = monthValues.startOfCalMonth
    const aMonth = [] as Month
    for (let widx = 0; widx < monthValues.weeks; widx++) {
        const aWeek = [] as Week
        for (let didx = 0; didx < 7; didx++) {
            const theDate = addDays(weekStart, didx)
            const inMonth = getMonth(theDate) === monthValues.month
            const isToday = isEqual(theDate, monthValues.today)
            const isSelected = isEqual(theDate, monthValues.baseDate)
            const data = getSelectedEvents(theDate, eventData)
            aWeek[didx] = { date: theDate, inMonth, isToday, isSelected, data }
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
    return new Date(getYear(aDate), getMonth(aDate), getDate(aDate))
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
    if (aDate === undefined || aDate === null) {
        return ''
    }
    return format(aDate, 'yyyy-MM-dd')
}
/**
 * Formats the date to MM/dd/yyyy
 *
 * @param aDate type Date
 * @returns string 'MM/dd/yyyy'
 */
const toMDY = (aDate: Date) => {
    if (aDate === undefined || aDate === null) {
        return null
    }
    return format(aDate, 'MM/dd/yyyy')
}

/**
 * Creates a Date object
 *
 * @param aDate string in formate 'yyyy-MM-dd'
 * @returns type Date
 */
const toDate = (aDate: string) => {
    if (aDate === undefined || aDate === null) {
        return null
    }
    return parse(aDate, 'yyyy-MM-dd', new Date())
}

const isValidTime = (timeString: string) => {
    if (timeString === undefined || timeString === null) {
        return true
    }
    if (timeString.length < 8) {
        return false
    }
    const theTime = parse(timeString, 'h:m a', new Date())
    return isValid(theTime)
}

export {
    getMonthValues,
    getCalendar,
    getCalendarMerged,
    getSelectedEvents,
    toYMD,
    toMDY,
    stripTime,
    getToday,
    toDate,
    isValidTime,
}
