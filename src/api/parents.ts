import { Parent } from '../types/Api'
import { supabase } from './SupabaseClient'

const getParents = async (memberId: number) => {
    const { data, error } = await supabase.from('parent').select().eq('member_id', memberId).eq('deleted', false)

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

const deleteParent = async (parentId: number) => {
    const { error } = await supabase
        .from('parent')
        .update({
            deleted: true,
        })
        .eq('parent_id', parentId)

    if (error) throw error
}

const saveParent = async (parent: Parent) => {
    const { error } = await supabase.from('parent').insert({
        member_id: parent.member_id,
        first_name: parent.first_name,
        last_name: parent.last_name,
        pronouns: parent.pronouns,
        email: parent.email,
        phone: parent.phone,
        addr1: parent.addr1,
        addr2: parent.addr2,
        city: parent.city,
        state: parent.state,
        zip: parent.zip,
    })
    if (error) throw error
}

const updateParent = async (parent: Parent) => {
    const { error } = await supabase
        .from('parent')
        .update({
            first_name: parent.first_name,
            last_name: parent.last_name,
            pronouns: parent.pronouns,
            email: parent.email,
            phone: parent.phone,
            addr1: parent.addr1,
            addr2: parent.addr2,
            city: parent.city,
            state: parent.state,
            zip: parent.zip,
        })
        .eq('parent_id', parent.parent_id)

    if (error) throw error
}

export { getParents, getParentById, deleteParent, saveParent, updateParent }
