import { createSignal, lazy, Match, Suspense, Switch } from 'solid-js'
import PageLoading from '../../components/PageLoading'
import YearPicker from '../../components/YearPicker'
import { SessionValueKeys, useSessionContext } from '../../contexts/SessionContext'
import { getSeason } from '../../utilities/converters'

const AttendanceForSeasonByMember = lazy(() => import('./AttendanceForSeasonByMember'))
const AttendanceForSeasonByPractice = lazy(() => import('./AttendanceForSeasonByPractice'))

const AttendanceForSeason = () => {
    const today = new Date()
    const formatted = getSeason(today) + ''
    const [season, setSeason] = createSignal<string>(formatted)
    const [sessionValues, { updateSessionValue }] = useSessionContext()
    const [tab, setTab] = createSignal(sessionValues.attendanceTab || 'PRACTICES')

    const changeTab = (tabName: string) => {
        setTab(tabName)
        updateSessionValue(SessionValueKeys.ATTENDANCE_TAB, tabName)
    }

    let currentMonth = ''

    return (
        <Suspense fallback={<PageLoading />}>
            <div class="mt-4 flex items-end">
                <div class="grow">
                    <div class="tabs">
                        <a
                            class={`tab tab-lg tab-bordered lg:tab-lifted ${tab() === 'PRACTICES' ? 'tab-active' : ''}`}
                            onClick={() => changeTab('PRACTICES')}
                        >
                            Practices
                        </a>
                        <a
                            class={`tab tab-lg tab-bordered lg:tab-lifted ${tab() === 'MEMBERS' ? 'tab-active' : ''}`}
                            onClick={() => changeTab('MEMBERS')}
                        >
                            Members
                        </a>
                    </div>
                </div>
                <div class="ml-4 min-w-max">
                    <YearPicker year={season} setYear={setSeason} labelLocation="SIDE" />
                </div>
            </div>
            <div class="md:border md:border-8 md:rounded md:border-base-100 pt-4 md:p-4">
                <Switch>
                    <Match when={tab() === 'PRACTICES'}>
                        <AttendanceForSeasonByPractice season={season} />
                    </Match>
                    <Match when={tab() === 'MEMBERS'}>
                        <AttendanceForSeasonByMember season={season} />
                    </Match>
                </Switch>
            </div>
        </Suspense>
    )
}

export default AttendanceForSeason
