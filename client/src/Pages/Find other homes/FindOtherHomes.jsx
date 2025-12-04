import React, { useEffect, useRef, useState } from 'react'
import Navbar from '../../Components/Navbar/Navbar'
import Footer from '../../Components/Footer/Footer'
import { useGetAllHomes, useHomeNameFormik } from '../../Hooks/home.hooks'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/all'
import { useGSAP } from '@gsap/react'
import { animateProfile } from '../../lib/gsap.animation'
import { useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import './FindOtherHomes.css'

function FindOtherHomes() {

    const [ filteredHomes, setFilteredHomes ] = useState( null )

    const formik = useHomeNameFormik()
    const otherHomeRef = useRef()

    const { allHomesData } = useSelector( state => state.allHomes )
    const getAllHomes = useGetAllHomes() // Hook used to get all homes data

    gsap.registerPlugin( ScrollTrigger )
    useGSAP( () => { animateProfile( otherHomeRef ) }, [] )

    useEffect( () => { getAllHomes() }, [] )
    useEffect( () => {

        if( allHomesData && allHomesData.length > 0 ) setFilteredHomes( allHomesData )

    }, [ allHomesData ] )

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

                {/* Displaying homes */}
                <section id="listing-other-homes">

                    <section>

                        { filteredHomes && filteredHomes.map( home => (

                            <motion.div 
                            
                                className='other-homes' 
                                key={ home?._id } 
                                whileHover={{ scale : 1.045 }}
                                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                                
                            >

                                <div className='other-home-names'>

                                    <p>{ home?.nickName }</p>
                                    <p>{ home?.homeName }</p>

                                </div>
                                <div className='other-home-address'>

                                    <div>

                                        <i className='bx  bx-street-view' />
                                        <p>{ home?.country }, { home?.state }</p>

                                    </div>
                                    <p>Since : <span>{ home?.createdAt }</span></p>

                                </div>
                                <div className='other-home-admin'>

                                    <img src={ home?.admin?.profilePicture } alt="" />
                                    <div id='oth-hm-ad-name'>

                                        <div>
                                            
                                            <p>{ home?.admin?.fullName }</p>
                                            <p>Admin</p>
                                            
                                        </div>
                                        <p id='email'>{ home?.admin?.email }</p>

                                    </div>

                                </div>
                                <button>Send request</button>

                            </motion.div>

                        ) ) }

                    </section>

                </section>

            </section>
            <Footer />
        
        </>

    )

}

export default FindOtherHomes