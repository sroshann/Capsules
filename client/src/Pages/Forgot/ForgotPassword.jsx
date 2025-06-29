import React, { useRef, useState } from 'react'
import Navbar from '../../Components/Navbar/Navbar'
import Footer from '../../Components/Footer/Footer'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/all'
import { useGSAP } from '@gsap/react'
import { animateSignup } from '../Signup/signup.animate'
import './ForgotPassword.css'

function ForgotPassword() {

    const [ showPassword, setShowPassword ] = useState( false )
    const [ showCnfrmPsswrd, setShowCnfrmPsswrd ] = useState( false )

    // GSAP
    const forgotLblRf = useRef()
    const forgotFrmRf = useRef()
    gsap.registerPlugin( ScrollTrigger )
    // I need the same animation used in signup page 
    useGSAP( () => { animateSignup( forgotLblRf, forgotFrmRf ) }, [] )

    // Function used to visible entered password
    const handleShowPassword = ( option ) => {

        if( option === 'password' ) setShowPassword( previous => !previous )
        else setShowCnfrmPsswrd( previous => !previous )

    }

    return (

        <>
        
            <Navbar />
            <section id="forgot-root">

                <section id="forgot-left">

                    <section ref={ forgotLblRf }>

                        <p id='main-label'>FORGOT PASSWORD ?</p>

                    </section>

                </section>
                <section id="forgot-right" ref={ forgotFrmRf }>

                    {/* onSubmit={ formik.handleSubmit } */}
                    <form action=""  >

                        <div className="input-fields">

                            <div><input 
                            
                                type="text" placeholder='Enter registered email address' 
                                // { ...formik.getFieldProps('email') }
                                
                            /></div>

                        </div>
                        <div className="form-buttons">

                            <button type='submit'>Get OTP</button>

                        </div>

                    </form>

                    <form action="">

                        <div className="input-fields" id='entering-OTP'>

                            <div className='OTP'><input 
                            
                                type="number" placeholder='_' 
                                // { ...formik.getFieldProps('email') }
                                
                            /></div>
                            <div className='OTP'><input 
                            
                                type="number" placeholder='_' 
                                // { ...formik.getFieldProps('email') }
                                
                            /></div>
                            <div className='OTP'><input 
                            
                                type="number" placeholder='_' 
                                // { ...formik.getFieldProps('email') }
                                
                            /></div>
                            <div className='OTP'><input 
                            
                                type="number" placeholder='_' 
                                // { ...formik.getFieldProps('email') }
                                
                            /></div>
                            <div className='OTP'><input 
                            
                                type="number" placeholder='_' 
                                // { ...formik.getFieldProps('email') }
                                
                            /></div>
                            <div className='OTP'><input 
                            
                                type="number" placeholder='_' 
                                // { ...formik.getFieldProps('email') }
                                
                            /></div>

                        </div>
                        <div className="form-buttons">

                            <button type='submit'>Submit OTP</button>

                        </div>

                    </form>

                    <form action="" >

                        <div className="input-fields">

                            <div className='password-input'>

                                <input 
                                
                                    type={ showPassword ? 'text' : 'password' } 
                                    placeholder='Enter a strong password' 
                                    // { ...formik.getFieldProps('password') }
                                    
                                />
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

                                <input 
                                
                                    type={ showCnfrmPsswrd ? 'text' : 'password' } 
                                    placeholder='Confirm password' 
                                    // { ...formik.getFieldProps('confirmPassword') }
                                    
                                />
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
                        <div className="form-buttons">

                            <button type='submit'>Change password</button>

                        </div>

                    </form>

                </section>

            </section>
            <Footer />
        
        </>

    )

}

export default ForgotPassword