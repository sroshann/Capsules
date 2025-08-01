import React, { useRef } from 'react'
import Navbar from '../../Components/Navbar/Navbar'
import Footer from '../../Components/Footer/Footer'
import { useGSAP } from '@gsap/react'
import { animateProfile } from '../Signup/signup.animate'
import './Home.css'

function Home() {

    // GSAP
    const homeRef = useRef()
    // Using the same animation of profile page
    useGSAP( () => { animateProfile( homeRef ) }, [] )

    return (

        <>
        
            <Navbar />
            <section id="home-root" ref={ homeRef }>

                <section id="search-and-create">

                    <div id='search'>

                        <i className='bx  bx-search'  ></i> 
                        <input type="text" placeholder='Search your home' />
                        <i className='bx  bx-x'  ></i> 

                    </div>
                    <button id='create'><i className='bx  bx-plus'  ></i> Create a new home</button>

                </section>

                <section id="listing-homes"></section>

            </section>
            <Footer />

        </>

    )

}

export default Home