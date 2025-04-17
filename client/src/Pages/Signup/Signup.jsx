import React, { useRef, useState } from 'react'
import Navbar from '../../Components/Navbar/Navbar'
import Footer from '../../Components/Footer/Footer'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/all'
import { animateCountry, animateSignup } from './signup.animate'
import { useGetCounrtyDetails } from '../../Hooks/common.hooks'
import { useMediaQuery } from 'react-responsive'
import './Signup.css'

function Signup() {

    const [showPassword, setShowPassword] = useState(false)
    const [showCnfrmPsswrd, setShowCnfrmPsswrd] = useState(false)
    const [countryDetails, setCountryDetails] = useState([])
    const [ selectedCountry, setSelectedCountry ] = useState({})

    const getCountries = useGetCounrtyDetails() // Get country codes and flags

    const handleShowPassword = (filed) => {

        if (filed === 'password') setShowPassword(previous => !previous)
        else setShowCnfrmPsswrd(previous => !previous)

    }
    const handleCountryDetails = async () => setCountryDetails( await getCountries() ) 
    const handleSelectedCountry = ( code, flag ) => {

        setSelectedCountry({ code, flag })
        setCountryDetails([])

    }

    const formRef = useRef()
    const labelRef = useRef()
    const countryRef = useRef()
    gsap.registerPlugin(ScrollTrigger)
    useGSAP(() => { animateSignup(labelRef, formRef) }, [])
    useGSAP( () => { animateCountry( countryRef ) }, [ countryDetails ] )

    const isMobile = useMediaQuery({ maxWidth : 1024 })
    const isDesktop = useMediaQuery({ minWidth : 1025 })

    return (

        <>

            <Navbar />
            <section id="signup-root">

                <section id="signup-left">

                    <section ref={labelRef}>

                        <p id='main-label'>CREATE NEW ACCOUNT</p>
                        { isDesktop && <p>Already have an account? <span>Login here!</span></p> }

                    </section>

                </section>
                <section id="signup-right">

                    <form action="" ref={formRef}>

                        <div id="input-fields">

                            <div><input type="text" placeholder='Enter full name' /></div>
                            <div><input type="text" placeholder='Enter an unique username' /></div>
                            <div><input type="text" placeholder='Enter email address' /></div>
                            <div id='phonenumbe-input'>

                                <section id='country-details' >

                                    <section onClick={ handleCountryDetails }>
                                         
                                        <img src={ selectedCountry?.flag ? selectedCountry?.flag
                                            : 'https://upload.wikimedia.org/wikipedia/en/4/41/Flag_of_India.svg'} alt="" />
                                        <p>{ selectedCountry?.code ? selectedCountry?.code : '+91' } 
                                            <i className='bx bx-chevron-down'/></p>
                                    
                                    </section>
                                    { countryDetails.length > 0 && <section id='pop-up' ref={ countryRef }>

                                        { countryDetails.map( ( object ) => (

                                            <div key={ object.code } 
                                            onClick={ () => handleSelectedCountry( object.dial_code, object.flag ) }>

                                                <img src={ object.flag } alt="" />
                                                <p>{ object.dial_code }</p>

                                            </div>

                                        ))}

                                    </section>}

                                </section>
                                <input type="text" placeholder='Enter phone number' />

                            </div>
                            <div className='password-input'>

                                <input type="password" placeholder='Enter password' />
                                {showPassword ?

                                    <svg onClick={() => handleShowPassword('password')} xmlns="http://www.w3.org/2000/svg" width={20} height={22} viewBox="0 0 24 24">

                                        <path fill="currentColor" d="M12 17.5c-3.8 0-7.2-2.1-8.8-5.5H1c1.7 4.4 6 7.5 11 7.5s9.3-3.1 11-7.5h-2.2c-1.6 3.4-5 5.5-8.8 5.5"></path>

                                    </svg> :
                                    <svg onClick={() => handleShowPassword('password')} xmlns="http://www.w3.org/2000/svg" width={22} height={22} viewBox="0 0 24 24">

                                        <path fill="currentColor" d="M12 18.75c-5.83 0-8.57-6.19-8.69-6.45a.78.78 0 0 1 0-.6c.12-.26 2.86-6.45 8.69-6.45s8.57 6.19 8.69 6.45a.78.78 0 0 1 0 .6c-.12.26-2.86 6.45-8.69 6.45M4.83 12c.59 1.15 3 5.25 7.17 5.25s6.58-4.1 7.17-5.25c-.59-1.15-3-5.25-7.17-5.25S5.42 10.85 4.83 12"></path>
                                        <path fill="currentColor" d="M12 15.25A3.25 3.25 0 1 1 15.25 12A3.26 3.26 0 0 1 12 15.25m0-5A1.75 1.75 0 1 0 13.75 12A1.76 1.76 0 0 0 12 10.25"></path>

                                    </svg>

                                }
                            </div>
                            <div className='password-input'>

                                <input type="password" placeholder='Confirm password' />
                                {showCnfrmPsswrd ?

                                    <svg onClick={() => handleShowPassword('confirm')} xmlns="http://www.w3.org/2000/svg" width={20} height={22} viewBox="0 0 24 24">

                                        <path fill="currentColor" d="M12 17.5c-3.8 0-7.2-2.1-8.8-5.5H1c1.7 4.4 6 7.5 11 7.5s9.3-3.1 11-7.5h-2.2c-1.6 3.4-5 5.5-8.8 5.5"></path>

                                    </svg> :
                                    <svg onClick={() => handleShowPassword('confirm')} xmlns="http://www.w3.org/2000/svg" width={22} height={22} viewBox="0 0 24 24">

                                        <path fill="currentColor" d="M12 18.75c-5.83 0-8.57-6.19-8.69-6.45a.78.78 0 0 1 0-.6c.12-.26 2.86-6.45 8.69-6.45s8.57 6.19 8.69 6.45a.78.78 0 0 1 0 .6c-.12.26-2.86 6.45-8.69 6.45M4.83 12c.59 1.15 3 5.25 7.17 5.25s6.58-4.1 7.17-5.25c-.59-1.15-3-5.25-7.17-5.25S5.42 10.85 4.83 12"></path>
                                        <path fill="currentColor" d="M12 15.25A3.25 3.25 0 1 1 15.25 12A3.26 3.26 0 0 1 12 15.25m0-5A1.75 1.75 0 1 0 13.75 12A1.76 1.76 0 0 0 12 10.25"></path>

                                    </svg>

                                }

                            </div>

                        </div>
                        <div id="form-buttons">

                            <button type='submit'>Sign Up</button>
                            <button>Continue with

                                <span>

                                    <svg xmlns="http://www.w3.org/2000/svg" width={17} height={17} viewBox="0 0 48 48">

                                        <path fill="#ffc107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917"></path>
                                        <path fill="#ff3d00" d="m6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691"></path>
                                        <path fill="#4caf50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.9 11.9 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44"></path>
                                        <path fill="#1976d2" d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002l6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917"></path>

                                    </svg>oogle

                                </span>

                            </button>

                        </div>
                        { isMobile && <p id='signup-mobile-lable'>Already have an account? <span>Login here!</span></p> }

                    </form>

                </section>

            </section>
            <Footer />

        </>

    )

}

export default Signup