import { RobotEvent } from '../types/Api'

type Day = {
    date: Date // date of day
    inMonth: boolean // is this day in the month or just showing in the UI
    isToday: boolean // is this day today?
    isSelected?: boolean // is this day selected in the UI?
    data?: RobotEvent[] // generic data object
}

type Week = Day[]
type Month = Week[]

type MonthValues = {
    weekStartsOn: 0 | 1 | 2 | 3 | 4 | 5 | 6
    today: Date
    baseDate: Date
    year: number
    month: number
    beginOfMonthDate: Date
    startOfCalMonth: Date // day on cal might be before month starts
    endOfCalMonth: Date // day on cal might be after month ends
    startDayOfCal: 0 | 1 | 2 | 3 | 4 | 5 | 6
    endOfMonthDate: Date
    lastDayOfCal: 0 | 1 | 2 | 3 | 4 | 5 | 6
    weeks: number
    days: number
}

export type { Day, Week, Month, MonthValues }
