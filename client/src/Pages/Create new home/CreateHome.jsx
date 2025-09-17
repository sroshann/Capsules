import React, { useState } from 'react'
import Navbar from '../../Components/Navbar/Navbar'
import Footer from '../../Components/Footer/Footer'
import FlagandCode from '../../Components/Country popup/FlagandCode'
import { homeFormik } from '../../Hooks/home.hooks'
import { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/all'
import { useGSAP } from '@gsap/react'
import { animateSignup } from '../../lib/gsap.animation'
import './CreateHome.css'

function CreateHome() {

    const [ country, setCountry ] = useState({

        flag : 'https://upload.wikimedia.org/wikipedia/en/4/41/Flag_of_India.svg',
        countryName : 'India'

    })

    const [ showCountry, setShowCountry ] = useState( false )
    const handleShowCountry = () => setShowCountry( previous => !previous )

    const formik = homeFormik()

    // GSAP
    const labelRef = useRef()
    const formRef = useRef()
    gsap.registerPlugin( ScrollTrigger )
    useGSAP( () => { animateSignup( labelRef, formRef ) }, [] )

    return (

        <>

            <Navbar />
            <section id="createHome-root">

                {/* Left section */}
                <section id="createHome-left" ref={ labelRef }>

                    <section>

                        <p id="createHome-main-label">CREATE NEW HOME</p>
                        <p id="createHome-sub-label">

                            Provide details of your home in order to create and add medicinal details

                        </p>

                    </section>

                </section>
                {/* Right section */}
                <section id="createHome-right" ref={ formRef }>

                    <form onSubmit={ formik.handleSubmit }>

                        <section id="CHome-input-fields">

                            <div><input

                                type="text"
                                placeholder='Provide a nickname for your home'
                                { ...formik.getFieldProps('nickName') }

                            /></div>
                            <div><input

                                type="text"
                                placeholder='Enter an unique name for your home'
                                { ...formik.getFieldProps('homeName') }

                            /></div>
                            <section>

                                <div 
                                
                                    id='country-input' 
                                    onClick={ handleShowCountry } 
                                    onBlur={ () => setShowCountry( false ) } 
                                    tabIndex={ 0 }
                                    
                                >
                                    
                                    <img src={ country?.flag } alt="Selected counrty" />
                                    <input

                                        type="text"
                                        placeholder={ country?.countryName }
                                        { ...formik.getFieldProps('country') }
                                        readOnly

                                    />
                                
                                </div>
                                <div><input

                                    type="text"
                                    placeholder='State'
                                    { ...formik.getFieldProps('state') }

                                /></div>
                                <div><input

                                    type="text"
                                    placeholder='District'
                                    { ...formik.getFieldProps('district') }

                                /></div>
                                <div><input

                                    type="number"
                                    placeholder='Pincode'
                                    { ...formik.getFieldProps('pincode') }

                                /></div>

                            </section>
                            <div>
                                
                                <textarea

                                    id="" 
                                    placeholder='Tell us about your home ( optional )'
                                    { ...formik.getFieldProps('description') }
                                
                                ></textarea>
                                
                            </div>

                        </section>
                        <button type='submit'>Create home</button>

                    </form>

                    { showCountry && <FlagandCode select = { setCountry } formik={ formik } from={ 'createHome' } /> }
                    
                </section>

            </section>
            <Footer />

        </>

    )

}

export default CreateHome