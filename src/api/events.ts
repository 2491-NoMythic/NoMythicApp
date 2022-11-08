import { supabase } from './SupabaseClient'
import { RobotEvent } from '../types/Api'
import { getMonthValues, toDate, toYMD } from '../calendar/utilities'

const getEvents = async (aDate: Date) => {
    console.log('getEvents', aDate)
    const eventMonth = getMonthValues(aDate)
    const { data, error } = await supabase
        .from('events')
        .select('event_id, event_date, event_type, description')
        .gte('event_date', toYMD(eventMonth.beginOfMonthDate))
        .lte('event_date', toYMD(eventMonth.endOfMonthDate))
        .eq('deleted', false)

    if (error) throw error

    return data as RobotEvent[]
}

const getEventById = async (eventId: number) => {
    const { data, error } = await supabase
        .from('events')
        .select('event_id, event_date, event_type, description')
        .eq('event_id', eventId)

    if (error) throw error

    if (data.length === 0) {
        return null
    }
    // the type from the db is not coming back as a 'date'
    return data[0] as RobotEvent
}

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
        })
        .eq('event_id', event.event_id)

    if (error) throw error
}

export { getEvents, getEventById, deleteEvent, saveEvent, updateEvent }
