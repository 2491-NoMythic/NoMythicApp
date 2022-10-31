import { Parent } from '../types/Api'
import { supabase } from './SupabaseClient'

const getParents = async (memberId: number) => {
    const { data, error } = await supabase.from('parent').select().eq('member_id', memberId)

    if (error) throw error

    return data as Parent[]
}

const getParentById = async (parentId: number) => {
    const { data, error } = await supabase.from('parent').select().eq('parent_id', parentId)

    if (error) throw error

    if (data.length === 0) {
        return null
    }
    return data[0] as Parent
}

export { getParents, getParentById }
