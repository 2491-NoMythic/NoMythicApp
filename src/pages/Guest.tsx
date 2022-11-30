import { Component, createResource, createSignal, onMount, Suspense } from 'solid-js'
import logo from '../assets/logo.png'
import PageLoading from '../components/PageLoading'

const Guest: Component = () => {
    return (
        <Suspense fallback={<PageLoading />}>
            <div class="flex flex-col items-center justify-center gap-y-4">
                <h1 class="text-3xl mt-20">Welcome Friend!</h1>
               
                <img src={logo} class="w-80 h-80"></img>
                
                <a target="new" href="https://github.com/2491-NoMythic" class="mt-20">
                    <button class="btn btn-wide">
                       NoMythic Github
                     </button>
                </a>

                 <a target="new" href="https://2491nomythic-docs.netlify.app/">
                    <button class="btn btn-wide">
                       NoMythic Robot Docs
                     </button>
                </a>
               
            </div>
        </Suspense>
    )
}

export default Guest
