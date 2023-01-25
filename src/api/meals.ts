import { Meal, MealInfo, MealListItem } from '../types/Api'
import { supabase } from './SupabaseClient'

const getMealById = async (mealId: number) => {
    const { data, error } = await supabase.from('meals').select('*').eq('meal_id', mealId)

    if (error) throw error

    if (data.length === 0) {
        return null
    }
    return data[0] as Meal
}

const getMealByEventId = async (eventId: number) => {
    const { data, error } = await supabase.from('meals').select('*').eq('event_id', eventId)

    if (error) throw error

    if (data.length === 0) {
        return null
    }
    return data[0] as Meal
}

const getMealInfoByEventId = async (eventId: number) => {
    const { data, error } = await supabase
        .from('meals')
        .select('meal_id, event_id, meal_name, description, members(*), parent(*)')
        .eq('event_id', eventId)

    if (error) throw error

    if (data.length === 0) {
        return null
    }
    return data[0] as unknown as MealInfo
}

const getMealList = async (year: string) => {
    const { data, error } = await supabase
        .from('events')
        .select(
            'event_id, event_type, event_date, has_meal, title, meals(event_id, meal_id, meal_name, members(*), parent(*))'
        )
        .eq('has_meal', true)
        .eq('deleted', false)

    if (error) throw error
    if (data.length === 0) {
        return null
    }
    return data as MealListItem[]
}

const saveMeal = async (meal: Meal) => {
    const { error } = await supabase.from('meals').insert({
        event_id: meal.event_id,
        mentor_id: meal.mentor_id,
        parent_id: meal.parent_id,
        meal_name: meal.meal_name,
        description: meal.description,
    })
    if (error) throw error
}
const saveMentor = async (eventId: number, mentorId: number) => {
    const { error } = await supabase.from('meals').insert({
        event_id: eventId,
        mentor_id: mentorId,
        parent_id: null,
        meal_name: null,
        description: null,
    })
    if (error) throw error
}
/**
 * Update just the mentor on a meal
 * @param mentorId member_id number
 */
const updateMentor = async (eventId: number, mentorId: number) => {
    const { error } = await supabase.from('meals').update({ mentor_id: mentorId }).eq('event_id', eventId)
    if (error) throw error
}

const updateMeal = async (meal: Meal) => {
    const { error } = await supabase
        .from('meals')
        .update({
            mentor_id: meal.mentor_id,
            parent_id: meal.parent_id,
            meal_name: meal.meal_name,
            description: meal.description,
        })
        .eq('meal_id', meal.meal_id)

    if (error) throw error
}

/**
 * Soft delete of a meal
 * @param mealId number
 */
const deleteMeal = async (mealId: number) => {
    const { error } = await supabase
        .from('meals')
        .update({
            deleted: true,
        })
        .eq('meal_id', mealId)

    if (error) throw error
}

export {
    getMealById,
    getMealByEventId,
    getMealInfoByEventId,
    getMealList,
    saveMeal,
    saveMentor,
    updateMentor,
    updateMeal,
    deleteMeal,
}
