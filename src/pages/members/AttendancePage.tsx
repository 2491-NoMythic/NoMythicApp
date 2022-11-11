import { Component, createEffect, createResource, createSignal, Suspense } from 'solid-js'
import SubTeamSelector from '../../components/SubTeamSelector'
import { filterBySubTeam } from '../../utilities/filters'
import { sortByFirstName } from '../../utilities/sorts'
import SelectTeamInfoMessage from '../../components/SelectTeamInfoMessage'
import { MemberAttendance } from '../../types/Api'
import { getMemberAttendance } from '../../api/attendance'
import AttendanceList from '../../components/AttendanceList'
import PageLoading from '../../components/PageLoading'
import { useSessionContext } from '../../contexts/SessionContext'
import { getToday, toDate, toYMD } from '../../calendar/utilities'
import { useMyUser } from '../../contexts/UserContext'
import { DateField } from '../../components/forms'
import * as yup from 'yup'
import { isValid } from 'date-fns'
import { useFormHandler, yupSchema } from 'solid-form-handler'

//TODO using this should be easier if not having a full form
type Fields = {
    event_date: string
}

export const eventSchema: yup.SchemaOf<Fields> = yup.object({
    event_date: yup
        .string()
        .required()
        .test('is-date', 'Not a valid date', (value) => {
            return isValid(toDate(value))
        }),
})

const AttendancePage: Component = () => {
    const [filteredTeam, setFilteredTeam] = createSignal<MemberAttendance[]>([])
    const formatted = toYMD(getToday())
    const [meetingDate, setMeetingDate] = createSignal<string>(formatted)
    const [authSession, googleUser, member, { isAdmin }] = useMyUser()
    const [team, { mutate, refetch }] = createResource(meetingDate, getMemberAttendance)
    const [sessionValues] = useSessionContext()
    const formHandler = useFormHandler(yupSchema(eventSchema))
    const { formData } = formHandler

    // runs whenever team or subTeam are changed
    createEffect(() => {
        const filtered = filterBySubTeam(team(), sessionValues.subTeam)
        const sorted = sortByFirstName(filtered)
        setFilteredTeam(sorted)
    })

    // called when the date field is changed
    const handleDateChange = async (event: Event) => {
        await formHandler.validateForm()
        setMeetingDate(formData().event_date)
    }

    return (
        <Suspense fallback={<PageLoading />}>
            <div class="overflow-x-auto">
                <div class="flex">
                    <div class="grow mr-2">
                        <SubTeamSelector />
                    </div>
                    <DateField
                        label="Event Date"
                        altLabel="Required"
                        name="event_date"
                        value={meetingDate()}
                        formHandler={formHandler}
                        onInput={handleDateChange}
                        onBlur={handleDateChange}
                        readonly={!isAdmin()}
                    />
                </div>
                <SelectTeamInfoMessage
                    show={filteredTeam().length === 0}
                    extraMessage="Using current season. NOTE: YOU ARE ONLY TAKING ATTENDANCE FOR A PARTICULAR DAY. In the future you will pick the event."
                />
                <AttendanceList meetingDate={meetingDate()} teamMembers={filteredTeam} refetch={refetch} />
            </div>
        </Suspense>
    )
}

export default AttendancePage
