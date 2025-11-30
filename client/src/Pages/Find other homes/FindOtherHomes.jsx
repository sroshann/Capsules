import React, { useRef } from 'react'
import Navbar from '../../Components/Navbar/Navbar'
import Footer from '../../Components/Footer/Footer'
import { useHomeNameFormik } from '../../Hooks/home.hooks'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/all'
import { useGSAP } from '@gsap/react'
import { animateProfile } from '../../lib/gsap.animation'
import './FindOtherHomes.css'

function FindOtherHomes() {

    const formik = useHomeNameFormik()
    const otherHomeRef = useRef()

    gsap.registerPlugin( ScrollTrigger )
    useGSAP( () => { animateProfile( otherHomeRef ) }, [] )

    return (

        <>
        
            <Navbar />
            <section id="other-homes-root" ref={ otherHomeRef }>

                {/* Search area */}
                <section id="find-search-area" >

                    <form id='home-search' onSubmit={ formik.handleSubmit } >

                        <i className='bx  bx-search'  ></i>
                        <input

                            type="text"
                            placeholder='Find homes you are familiar with, and you would like to collaborate'
                            { ...formik.getFieldProps('homeName') }

                        />
                        <i className='bx  bx-x' onClick={ () => formik.resetForm() } ></i>

                    </form>
                    <p id='home-search-label'>

                        Explore homes gloablly and send membership request to join those you are familiar with, 
                        fostering a trusted and connected <span style={{ color : 'red' }}>family</span> where health 
                        and medicinal details are shared.

                    </p>

                </section>

            </section>
            <Footer />
        
        </>

    )

}

export default FindOtherHomes