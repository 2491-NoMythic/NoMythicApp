import { Member } from '../types/Api'
import { supabase } from './SupabaseClient'

const getMemberByEamil = async (email: string) => {
    const { data, error } = await supabase
        .from('members')
        .select()
        .eq('email', email)

    if (error) throw error
    //console.log(data)

    if (data.length === 0) {
        return null
    }
    return data[0] as Member
}

export { getMemberByEamil }
