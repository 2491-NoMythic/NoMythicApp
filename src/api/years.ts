import { Year } from '../types/Api'
import { supabase } from './SupabaseClient'


const getValidYears = async (year: string) => {
    const { data, error } = await supabase.from('parent').select()

    if (error) throw error

    return data as Year[]
}

const getYearById = async (year: string) => {
    const { data, error } = await supabase.from('year').select().eq('year', year)

    if (error) throw error

    if (data.length === 0) {
        return null
    }
    return data[0] as Year
}

const saveYear = async (year: Year) => {
    const { error } = await supabase.from('parent').insert({
        year: year.year,
        game: year.game
    })
    if (error) throw error
}

const updateYear = async (year: Year) => {
    const { error } = await supabase
        .from('year')
        .update({
            game: year.game
        })
        .eq('year', year.year)

    if (error) throw error
}

export { getValidYears, getYearById, saveYear, updateYear }
