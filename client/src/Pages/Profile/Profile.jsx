import React, { useEffect, useRef, useState } from 'react'
import Navbar from '../../Components/Navbar/Navbar'
import Footer from '../../Components/Footer/Footer'
import { useSelector } from 'react-redux'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/all'
import { useGSAP } from '@gsap/react'
import { animateProfile } from '../Signup/signup.animate'
import FlagandCode from '../../Components/Country popup/FlagandCode'
import { useConvertToBS6, useGetParticularFlag } from '../../Hooks/common.hooks'
import { useProfileFormik } from '../../Hooks/authentication.hooks'
import { useMediaQuery } from 'react-responsive'
import './Profile.css'

function Profile() {

    const { userData } = useSelector( state => state.authentication )
    const [ selectedImage, setSelectedImage ] = useState( null )
    const [ edit, setEdit ] = useState( false )
    const [ showCountry, setShowCountry ] = useState( false )

    // This state function is passed to flag component inorder to store the selected country data
    const [ selectedCountry, setSelectedCountry ] = useState({})

    // Hook used to get user flag, a state variable is returned from the hook so 
    // there is no need another state here
    const flag = useGetParticularFlag( userData?.phoneNumber?.countryCode )
    const imageBS6 = useConvertToBS6( selectedImage ) // Hook used to convert image into its BS6 format
    const formik = useProfileFormik( setEdit )

    const handleEdit = () => setEdit( previous => !previous )
    const handleShowCountry = () => {

        // Show the country details only when editing
        if ( edit ) setShowCountry( previous => !previous )

    }

    // GSAP
    const profileRef = useRef()
    gsap.registerPlugin( ScrollTrigger ) 
    useGSAP( () => animateProfile( profileRef ) , [] )

    useEffect( () => { 
        
        // This is used to add the selected image BS6 code to formik values
        formik.setFieldValue('profilePicture', imageBS6)
    
    } , [ imageBS6 ] )

    const isMobile = useMediaQuery({ maxWidth : 767 })

    return (

        <>
        
            <Navbar />
            <section id='profile-root' ref={ profileRef }>

                <form id="user-data-display" onSubmit={ formik.handleSubmit }>

                    <section id='photo-and-name'>

                        <section id='edit-option'>{ !isMobile && <p onClick={ handleEdit }>Edit ?</p> } </section>
                        <section>

                            <section id="outer-green-circle">

                                <section id='inner-white-circle'>
                                    
                                    { 
                                    
                                        imageBS6 ? <img src={ imageBS6 } /> : 
                                        ( 
                                            
                                            userData?.profilePicture ? <img src={ userData?.profilePicture } alt="" />  : 
                                            <i className='bx  bxs-user-circle' ></i>  
                                    
                                        )
                                    
                                    }    
                                
                                </section>    
                                
                            </section>   
                            <section id='user-names' style={ edit ? { margin : '-25px 0px 0px 0px' } : { margin: '5px 0px 0px 0px' } }>
                            {   edit &&

                                <section id="edit-image">

                                    <input 
                                    
                                        type="file" 
                                        id="fileInput" 
                                        style={{ display : 'none' }}
                                        onChange={ ( event ) => setSelectedImage( event.target.files[0] ) }
                                        
                                    />
                                    <svg  
                                    
                                        onClick={ () => document.querySelector('#fileInput').click() }
                                        xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24" >
                                        <path className="b" d="m18.71,5.29c-.39-.39-1.02-.39-1.41,0l-11,11c-.19.19-.29.44-.29.71v3c0,.55.45,1,1,1h3c.27,0,.52-.11.71-.29l11-11c.39-.39.39-1.02,0-1.41l-3-3Zm-9.12,13.71h-1.59v-1.59l7.5-7.5,1.59,1.59-7.5,7.5Zm8.91-8.91l-1.59-1.59,1.09-1.09,1.59,1.59-1.09,1.09Z"></path>
                                        <path className="b" d="m7,12c.26,0,.5-.15.61-.4l1.23-2.77,2.77-1.23c.24-.11.4-.35.4-.61s-.16-.5-.4-.61l-2.77-1.23-1.23-2.77c-.11-.24-.34-.39-.6-.4-.27-.02-.5.15-.61.39l-1.23,2.67-2.78,1.34c-.23.11-.38.35-.38.61,0,.26.16.49.4.6l2.77,1.23,1.23,2.77c.11.24.35.4.61.4Z"></path>
                                        <path className="b" d="m21.76,18.63l-1.66-.74-.74-1.66c-.06-.14-.21-.24-.36-.24-.16-.01-.3.09-.37.23l-.74,1.6-1.67.8c-.14.07-.23.21-.23.37,0,.16.1.3.24.36l1.66.74.74,1.66c.06.14.21.24.37.24s.3-.09.37-.24l.74-1.66,1.66-.74c.14-.06.24-.21.24-.37s-.09-.3-.24-.37Z"></path>
                                    
                                    </svg>
                                        
                                </section> 

                            }

                                <p id='username'>{ userData?.userName }</p>
                                <p id='fullname'>{ userData?.fullName }</p>
                                <p id='usermail'>{ userData?.email }</p>

                            </section>
                            
                        </section>  

                    </section>          
                    {

                        isMobile && <section id="edit-button">
                            
                            <button type='button' onClick={ handleEdit }>Edit ?</button>
                            
                        </section>  

                    }        
                    <section id='member-and-joined'>
                        
                        <section id='member'><p>Member of : { userData?.memberOf }</p></section>    
                        <section id='joined'><p>Joined on : { userData?.createdAt }</p></section>    
                    
                    </section>                    
                    <section id='input-section'>

                        <div>

                            { !isMobile && <p>Fullname</p> }
                            <input 
                            
                                type="text" 
                                readOnly={ !edit } 
                                { ...formik.getFieldProps('fullName') }
                                
                            />

                        </div>
                        <div>

                            { !isMobile && <p>Username</p> }
                            <input 

                                type="text" 
                                readOnly={ !edit } 
                                { ...formik.getFieldProps('userName') }
                                
                            />

                        </div>
                        <div>

                            { !isMobile && <p>Email</p> }
                            <input 
                            
                                type="text" 
                                readOnly={ !edit } 
                                { ...formik.getFieldProps('email') }
                                
                            />

                        </div>
                        <div>

                            { !isMobile && <p>Phone</p> }
                            <section id='profile-phone-number-input'>

                                <div onClick={ handleShowCountry } onBlur={ handleShowCountry } tabIndex={0}>

                                    <img src={ selectedCountry?.flag ? selectedCountry.flag : flag } alt="" />
                                    <p>{ selectedCountry?.dialCode ? selectedCountry.dialCode : userData?.phoneNumber?.dialCode }</p>

                                </div>
                                <input 
                                
                                    type="number"  
                                    readOnly={ !edit } 
                                    { ...formik.getFieldProps('phoneNumber.number') }
                                    
                                />

                            </section>

                        </div>  
                        { showCountry && <FlagandCode select={ setSelectedCountry } formik={ formik }/> }
                        
                    </section>                    
                    { edit && <section id='save-button'><button type='submit'>Save changes</button></section> }                 

                </form>

            </section>
            <Footer />
        
        </>

    )

}

export default Profile