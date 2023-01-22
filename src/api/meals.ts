import { Meal, MealInfo } from '../types/Api'
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

export { getMealById, getMealByEventId, getMealInfoByEventId, saveMeal, updateMeal, deleteMeal }
