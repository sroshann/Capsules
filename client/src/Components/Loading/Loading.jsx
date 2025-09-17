import React, { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/all'
import { useGSAP } from '@gsap/react'
import { animateProfile } from '../../lib/gsap.animation'
import './Loading.css'

function Loading() {

    const loadingRef = useRef()
    gsap.registerPlugin( ScrollTrigger )
    useGSAP( () => { animateProfile( loadingRef ) }, [] )

    return (

        <section ref={ loadingRef } id='loading-root'><p id='loading-text'>LOADING</p></section>

    )

}

export default Loading