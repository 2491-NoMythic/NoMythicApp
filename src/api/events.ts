import { supabase } from './SupabaseClient'
import { RobotEvent } from '../types/Api'
import { getMonthValues, getToday, toDate, toYMD } from '../calendar/utilities'
import { isEmpty } from '../utilities/bitsAndBobs'
import { getStartEndOfSeason } from '../utilities/converters'
import { isBefore } from 'date-fns'
import Config from '../config'

/**
 * Get the events for the month that aDate falls within that are not deleted
 * @param aDate Date
 * @returns RobotEvent[]
 */
const getEvents = async (aDate: Date) => {
    const eventMonth = getMonthValues(aDate)
    const { data, error } = await supabase
        .from('events')
        .select('*')
        .gte('event_date', toYMD(eventMonth.startOfCalMonth))
        .lte('event_date', toYMD(eventMonth.endOfCalMonth))
        .eq('deleted', false)

    if (error) throw error

    return data as RobotEvent[]
}

/**
 * Returns all the events that are currently in a season (so far)
 * that are not deleted and you can take attendance for
 * @param season string
 * @returns RobotEvents[]
 */
const getSeasonEvents = async (season: string) => {
    const { startDate, endDate } = getStartEndOfSeason(season)
    const theEnd = isBefore(getToday(), toDate(endDate)) ? toYMD(getToday()) : endDate
    const { data, error } = await supabase
        .from('events')
        .select('*')
        .gte('event_date', startDate)
        .lte('event_date', theEnd)
        .eq('deleted', false)
        .eq('take_attendance', true)
        .order('event_date', { ascending: false })

    if (error) throw error

    return data as RobotEvent[]
}

/**
 * Get the events for a single day not deleted
 * @param meetingDate string
 * @returns RobotEvent[]
 */
const getEventsForDay = async (meetingDate: string) => {
    if (isEmpty(meetingDate)) return [] as RobotEvent[]
    const { data, error } = await supabase.from('events').select('*').eq('event_date', meetingDate).eq('deleted', false)

    if (error) throw error

    return data as RobotEvent[]
}

/**
 * Find next 3 events starting from meetingDate
 * @param meetingDate string to start search
 * @returns RobotEvent
 */
const getNextEvents = async (meetingDate: string) => {
    if (isEmpty(meetingDate)) return [] as RobotEvent[]
    const { data, error } = await supabase
        .from('events')
        .select('*')
        .gte('event_date', meetingDate)
        .eq('deleted', false)
        .order('event_date')
        .limit(Config.numberOfNextEvents)

    if (error) throw error
    return data as RobotEvent[]
}

/**
 * Get a single robot event
 * @param eventId number
 * @returns RobotEvent
 */
const getEventById = async (eventId: number) => {
    if (eventId === -1) {
        return null
    }
    const { data, error } = await supabase.from('events').select('*').eq('event_id', eventId)

    if (error) throw error

    if (data.length === 0) {
        return null
    }
    // the type from the db is not coming back as a 'date'
    return data[0] as RobotEvent
}

/**
 * Soft delete of an event
 * @param eventId number
 */
const deleteEvent = async (eventId: number) => {
    const { error } = await supabase
        .from('events')
        .update({
            deleted: true,
        })
        .eq('event_id', eventId)

    if (error) throw error
}

const saveEvent = async (event: RobotEvent) => {
    const { error } = await supabase.from('events').insert({
        event_date: event.event_date,
        event_type: event.event_type,
        description: event.description,
        title: event.title,
        start_time: event.start_time,
        end_time: event.end_time,
        virtual: event.virtual,
        all_day: event.all_day,
        take_attendance: event.take_attendance,
        has_meal: event.has_meal,
    })
    if (error) throw error
}

const updateEvent = async (event: RobotEvent) => {
    const { error } = await supabase
        .from('events')
        .update({
            event_date: event.event_date,
            event_type: event.event_type,
            description: event.description,
            title: event.title,
            start_time: event.start_time,
            end_time: event.end_time,
            virtual: event.virtual,
            all_day: event.all_day,
            take_attendance: event.take_attendance,
            has_meal: event.has_meal,
        })
        .eq('event_id', event.event_id)

    if (error) throw error
}

/**
 * Total number of events in season (so far) not deleted that you can take attendance at
 * Season is the year the game comes out (in January)
 */
const getNumberOfEvents = async (season: string) => {
    const { startDate, endDate } = getStartEndOfSeason(season)
    const theEnd = isBefore(getToday(), toDate(endDate)) ? toYMD(getToday()) : endDate
    const { count, error } = await supabase
        .from('events')
        .select('*', { count: 'exact', head: true })
        .eq('deleted', false)
        .gte('event_date', startDate)
        .lte('event_date', theEnd)
        .eq('take_attendance', true)

    if (error) throw error
    return count as number
}

export {
    getEvents,
    getEventsForDay,
    getEventById,
    deleteEvent,
    saveEvent,
    updateEvent,
    getSeasonEvents,
    getNextEvents,
    getNumberOfEvents,
}
