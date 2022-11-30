import { Component, Suspense } from 'solid-js'
import logo from '../assets/logo.png'
import PageLoading from '../components/PageLoading'

const Guest: Component = () => {
    return (
        <Suspense fallback={<PageLoading />}>
            <div class="flex flex-col items-center justify-center">
                <h1 class="text-3xl mt-20">Welcome Friend!</h1>
                <div class="mt-20">
                    <img src={logo} class="w-80 h-80"></img>
                </div>
            </div>
        </Suspense>
    )
}

export default Guest
