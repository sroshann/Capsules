import React, { useRef } from 'react'
import mine from '../../Assets/my.jpg'
import { useGSAP } from '@gsap/react'
import './Navbar.css'
import { desktopNav } from './navbar.animate'
import { useNavigateTo } from '../../Hooks/navbar.hooks'

function DesktopNav() {

    const navRef = useRef()
    useGSAP( () => { desktopNav( navRef ) }, [])
    const navigate = useNavigateTo() // Hook used to navigate

    return (

        <nav id='navbar' ref={ navRef }>

            <section id="logo"><p onClick={ () => navigate('landing') }>CAPSULES</p></section>
            <section id="menus">

                <div>

                    <p>Home</p>
                    <p>Find other homes</p>
                    <p>Medicines</p>
                    <p>About</p>
                    <p>Notification <i className='bx bx-bell' /></p>

                </div>

            </section>
            <section id="profile-auth">

                <section id="auth-btns">

                    <button>Login</button>
                    <button onClick={ () => navigate('signup') }>Signup</button>

                </section>
                <section id='profile-img'><img src={mine} alt="dp" /></section>

            </section>

        </nav>

    )
}

export default DesktopNav