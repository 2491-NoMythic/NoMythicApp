import { Component, createSignal } from 'solid-js'
import logo from '../assets/logo.png'
import animatedLogo from '../assets/logo-animated.gif'
import Config from '../config'

/**
 * Displays the logo and animates it according to logoAnimate parameter in config.ts
 */
const FunLogo: Component = () => {
    const [doSpin, setDoSpin] = createSignal(false)

    const getLogo = () => {
        if (Config.logoAnimate === 'SWITCH' && doSpin()) {
            return animatedLogo
        }
        return logo
    }
    /* When clicked and not spinning, start spin of 2s, after spin done ~2 reset spin for next click
       See tailwind.config.js for how the spin-once is set up */
    const handleSpinClick = () => {
        if (Config.logoAnimate !== 'STATIC' && doSpin() === false) {
            setDoSpin(true)
            setTimeout(() => {
                setDoSpin(false)
            }, 2600)
        }
    }

    return (
        <img
            src={getLogo()}
            class={`${doSpin() && Config.logoAnimate === 'SPIN' ? 'animate-spin-once' : 'animate-none'} w-60 h-60 ${
                Config.logoAnimate !== 'STATIC' ? 'cursor-pointer' : ''
            }`}
            onClick={handleSpinClick}
        ></img>
    )
}

export default FunLogo
