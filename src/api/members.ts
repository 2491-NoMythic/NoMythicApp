import { Member } from '../types/Api'
import { supabase } from './SupabaseClient'

const getMembers = async (year: string) => {
    const { data, error } = await supabase
        .from('members')
        .select('member_id, first_name, last_name, pronouns, team_role, sub_team, email, phone, food_needs')

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

const getMemberById = async (memberId: number) => {
    const { data, error } = await supabase.from('members').select().eq('member_id', memberId)

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
            food_needs: member.food_needs,
        })
        .eq('member_id', member.member_id)

    if (error) throw error
}

const saveMemberFromAdmin = async (member: Member) => {
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
            food_needs: member.food_needs,
            address: member.address,
            school: member.school,
            advisor: member.advisor,
            grade: member.grade,
        })
        .eq('member_id', member.member_id)

    if (error) throw error
}

const newMemberFromAdmin = async (member: Member) => {
    const { error } = await supabase.from('members').insert({
        first_name: member.first_name,
        last_name: member.last_name,
        pronouns: member.pronouns,
        team_role: member.team_role,
        sub_team: member.sub_team,
        email: member.email,
        phone: member.phone,
        food_needs: member.food_needs,
        address: member.address,
        school: member.school,
        advisor: member.advisor,
        grade: member.grade,
    })

    if (error) throw error
}

export { getMembers, getMemberByEamil, getMemberById, saveMemberFromProfile, saveMemberFromAdmin, newMemberFromAdmin }
