import { Member } from '../types/Api'
import { supabase } from './SupabaseClient'

const getMembers = async (year: string) => {
    const { data, error } = await supabase
        .from('members')
        .select('member_id, first_name, last_name, pronouns, team_role, sub_team, email, phone')

    if (error) throw error

    return data as Member[]
}

const getMemberByEamil = async (email: string) => {
    const { data, error } = await supabase.from('members').select().eq('email', email)

    if (error) throw error

    if (data.length === 0) {
        return null
    }
    return data[0] as Member
}

const saveMemberFromProfile = async (member: Member) => {
    const { error } = await supabase
        .from('members')
        .update({
            first_name: member.first_name,
            last_name: member.last_name,
            pronouns: member.pronouns,
            team_role: member.team_role,
            sub_team: member.sub_team,
            email: member.email,
            phone: member.phone,
        })
        .eq('member_id', member.member_id)

    if (error) throw error
}

export { getMembers, getMemberByEamil, saveMemberFromProfile }
