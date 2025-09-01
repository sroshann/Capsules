import React, { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { desktopNav } from './navbar.animate'
import { useNavigateTo } from '../../Hooks/navbar.hooks'
import { useSelector } from 'react-redux'
import { useLogout } from '../../Hooks/authentication.hooks'
import './Navbar.css'

function DesktopNav() {
    
    // Redux store used to store user data
    const { userData } = useSelector( state => state.authentication )

    const navRef = useRef()
    useGSAP( () => { desktopNav( navRef ) }, [])

    const navigate = useNavigateTo() // Hook used to navigate
    const logout = useLogout() // Hook used to logout

    const handleLogout = () => {

        logout()
        navigate('landing')

    }

    return (

        <nav id='navbar' ref={ navRef }>

            <section id="logo"><p onClick={ () => navigate('landing') }>CAPSULES</p></section>
            <section id="menus">

                <div>

                    <p onClick={ () => navigate('home') }>Home</p>
                    <p>Find other homes</p>
                    <p onClick={ () => navigate('medicines') }>Medicines</p>
                    <p>About</p>
                    <p>Notification <i className='bx bx-bell' /></p>

                </div>

            </section>
            <section id="profile-auth" style={ userData ? { justifyContent : 'end' } : { justifyContent : 'center' } }>

                <section id="auth-btns">

                    { 
                    
                        userData ? <button onClick={ handleLogout }>Logout</button> : 
                        
                        <>
                        
                            <button onClick={ () => navigate('login') }>Login</button>
                            <button onClick={ () => navigate('signup') }>Signup</button>
                        
                        </> 
                        
                    }

                </section>
                { userData && 
                
                    <section id='profile-img'>

                        {userData.profilePicture ? 
                        
                            <img 
                        
                                src={userData.profilePicture} 
                                alt="dp" 
                                onClick={ () => navigate('profile') }
                            
                            /> 
                        : <i className='bx  bxs-user-circle' onClick={ () => navigate('profile') }></i>}
                    
                    </section>
                    
                }

            </section>

        </nav>

    )
}

export default DesktopNav