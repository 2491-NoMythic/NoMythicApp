import { Member } from '../types/Api'
import { supabase } from './SupabaseClient'

type MemberYear = {
    members: Member
}

const flattenMembers = (memberYears: MemberYear[]) => {
    if (memberYears.length === 0) {
        return null;
    }
    let members = [] as Member[]
    memberYears.forEach((memberYear: MemberYear) => { 
        let member: Member = {}
        member.member_id = memberYear.members.member_id
        member.first_name = memberYear.members.first_name
        member.last_name = memberYear.members.last_name
        member.pronouns= memberYear.members.pronouns
        member.team_role = memberYear.members.team_role
        member.sub_team = memberYear.members.sub_team
        member.email = memberYear.members.email
        member.phone = memberYear.members.phone
        member.food_needs = memberYear.members.food_needs
        members.push(member) 
    })
    return members
} 

const getMembers = async (year: string) => {
    const { data, error } = await supabase
        .from('member_year')
        .select('members(member_id, first_name, last_name, pronouns, team_role, sub_team, email, phone, food_needs)')
        .eq('year', year)

    if (error) throw error
    return flattenMembers(data as MemberYear[]) as Member[]
}

const getMemberByEmail = async (email: string) => {
    const { data, error } = await supabase.from('members').select().eq('email', email).eq('deleted', false)

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
            grad_year: member.grad_year,
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
        grad_year: member.grad_year,
    })

    if (error) throw error
}

// soft delete of member
const deleteMember = async (memberId: number) => {
    const { error } = await supabase
        .from('members')
        .update({
            deleted: true,
        })
        .eq('member_id', memberId)

    if (error) throw error
}

const getMemberCount = async () => {
    const { count, error } = await supabase
        .from('members')
        .select('*', { count: 'exact', head: true })
        .eq('deleted', false)

    if (error) throw error
    return count as number
}

const linkMember = async () => {
    const { data, error } = await supabase.rpc('link_member')

    if (error) throw error
}

export {
    getMembers,
    getMemberByEmail,
    getMemberById,
    saveMemberFromProfile,
    saveMemberFromAdmin,
    newMemberFromAdmin,
    deleteMember,
    getMemberCount,
    linkMember,
}
