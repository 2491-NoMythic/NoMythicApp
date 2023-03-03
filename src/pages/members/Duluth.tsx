import { Component, createSignal, Match, Suspense, Switch } from 'solid-js'
import PageLoading from '../../components/PageLoading'

const Duluth: Component = () => {
    const [activeTab, setActiveTab] = createSignal('friday')

    type Data = { newTab: string }
    const changeTab = (data: Data, event: Event) => {
        event.preventDefault()
        setActiveTab(data.newTab)
    }

    return (
        <Suspense fallback={<PageLoading />}>
            <div class="tabs mt-8">
                <a
                    class={`tab tab-lg tab-bordered ${activeTab() === 'friday' ? 'tab-active' : ''}`}
                    onClick={[changeTab, { newTab: 'friday' }]}
                >
                    Friday
                </a>
                <a
                    class={`tab tab-lg tab-bordered ${activeTab() === 'saturday' ? 'tab-active' : ''}`}
                    onClick={[changeTab, { newTab: 'saturday' }]}
                >
                    Saturday
                </a>
                <a
                    class={`tab tab-lg tab-bordered ${activeTab() === 'matches' ? 'tab-active' : ''}`}
                    onClick={[changeTab, { newTab: 'matches' }]}
                >
                    Matches
                </a>
            </div>
            <div class="card max-w-lg bg-base-100 shadow-xl mt-4">
                <div class="card-body">
                    <Switch>
                        <Match when={activeTab() === 'friday'}>
                            <Friday />
                        </Match>
                        <Match when={activeTab() === 'saturday'}>
                            <Saturday />
                        </Match>
                        <Match when={activeTab() === 'matches'}>
                            <Matches />
                        </Match>
                    </Switch>
                </div>
            </div>
        </Suspense>
    )
}

const Friday: Component = () => {
    return (
        <div class="grid grid-cols-3 gap-4">
            <div>6:30</div>
            <div class="col-span-2">Hotel breakfast opens</div>
            <div>6:30</div>
            <div class="col-span-2">Lunch packing opens - The Condo</div>
            <div>7:15</div>
            <div class="col-span-2">Leave for DECC</div>
            <div>8:00</div>
            <div class="col-span-2">Pits and stands open</div>
            <div>8:30</div>
            <div class="col-span-2">Opening ceremony</div>
            <div>9:00</div>
            <div class="col-span-2">Qualification matches</div>
            <div>12:00</div>
            <div class="col-span-2">Lunch</div>
            <div>1:00</div>
            <div class="col-span-2">Qualification matches</div>
            <div>5:45</div>
            <div class="col-span-2">Awards ceremony</div>
            <div>6:15</div>
            <div class="col-span-2">Pits close</div>
            <div>6:30</div>
            <div class="col-span-2">Team dinner - Potato Bar</div>
            <div>8:00</div>
            <div class="col-span-2">Team meeting</div>
            <div>?:??</div>
            <div class="col-span-2">Pick list meeting</div>
            <div>10:30</div>
            <div class="col-span-2">Lights out</div>
        </div>
    )
}

const Saturday: Component = () => {
    return (
        <div class="grid grid-cols-3 gap-4">
            <div>6:30</div>
            <div class="col-span-2">Lunch packing opens - The Condo</div>
            <div>7:00</div>
            <div class="col-span-2">Hotel breakfast opens</div>
            <div>7:15</div>
            <div class="col-span-2">Leave for DECC</div>
            <div>8:00</div>
            <div class="col-span-2">Pits and stands open</div>
            <div>8:30</div>
            <div class="col-span-2">Opening ceremony</div>
            <div>9:00</div>
            <div class="col-span-2">Qualification matches</div>
            <div>12:15</div>
            <div class="col-span-2">Alliance Selection</div>
            <div>12:30</div>
            <div class="col-span-2">Lunch</div>
            <div>1:30</div>
            <div class="col-span-2">Playoff matches and awards ceremony</div>
            <div>5:00</div>
            <div class="col-span-2">Pits close / Load out</div>
            <div>6:00</div>
            <div class="col-span-2">Buss leaves</div>
            <div>7:00</div>
            <div class="col-span-2">Stop for dinner</div>
            <div>9:30ish</div>
            <div class="col-span-2">Back at GRS</div>
        </div>
    )
}

const Matches: Component = () => {
    return (
        <div>
            <a href="https://frc-events.firstinspires.org/2023/MNDU2/qualifications">Official Schedule</a>
            <div class="grid grid-cols-3 gap-4 mt-8">
                <div>Qualification 2</div>
                <div>Fri - 9:09 AM</div>
                <div>Blue 1</div>
                <div>Qualification 11</div>
                <div>Fri - 10:30 AM</div>
                <div>Red 2</div>
                <div>Qualification 21</div>
                <div>Fri - 11:50 AM</div>
                <div>Red 3</div>
                <div>Qualification 39</div>
                <div>Fri - 2:52 PM</div>
                <div>Red 3</div>
                <div>Qualification 48</div>
                <div>Fri - 3:55 PM</div>
                <div>Blue 3</div>
                <div>Qualification 59</div>
                <div>Fri - 5:12 PM</div>
                <div>Blue 3</div>
                <div>Qualification 68</div>
                <div>Sat - 9:28 AM</div>
                <div>Blue 2</div>
                <div>Qualification 74</div>
                <div>Sat - 10:10 AM</div>
                <div>Blue 1</div>
                <div>Qualification 80</div>
                <div>Sat - 10:52 AM</div>
                <div>Red 1</div>
                <div>Qualification 89</div>
                <div>Sat - 11:55 AM</div>
                <div>Blue 2</div>
            </div>
        </div>
    )
}

export default Duluth
