import { Component, createResource, createSignal, onMount, Suspense } from 'solid-js'
import unicorn from '../assets/2491_logo_disc_outline.png'
import PageLoading from '../components/PageLoading'

const Guest: Component = () => {
    return (
        <Suspense fallback={<PageLoading />}>
            <div class="flex flex-col items-center justify-center">
                <h1 class="text-3xl mt-20">Welcome Friend!</h1>
                <div class="mt-20">
                    <img src={unicorn} class="w-80 h-80"></img>
                </div>
            </div>
        </Suspense>
    )
}

export default Guest
