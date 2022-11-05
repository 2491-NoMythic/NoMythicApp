type Day = {
    date: Date
    inMonth: boolean
    isToday: boolean
}
type Week = Day[]
type Month = Week[]

type MonthValues = {
    weekStartsOn: 0 | 1 | 2 | 3 | 4 | 5 | 6
    today: Date
    year: number
    month: number
    beginOfMonthDate: Date
    startOfCalMonth: Date
    startDayOfCal: 0 | 1 | 2 | 3 | 4 | 5 | 6
    endOfMonthDate: Date
    lastDayOfCal: 0 | 1 | 2 | 3 | 4 | 5 | 6
    weeks: number
    days: number
}

export type { Day, Week, Month, MonthValues }
