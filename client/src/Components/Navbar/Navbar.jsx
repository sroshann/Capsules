import React from 'react'
import mine from '../../Assets/my.jpg'
import './Navbar.css'

function Navbar() {

    return (

        <nav id='navbar'>
            
            <section id="logo"><p>CAPSULES</p></section>
            <section id="menus">

                <div>

                    <p>Home</p>
                    <p>Find other homes</p>
                    <p>Medicines</p>
                    <p>About</p>
                    <p>Notification <i className='bx bx-bell'/></p>

                </div>

            </section>
            <section id="profile-auth">

                    <section id="auth-btns">

                        <button>Login</button>
                        <button>Signup</button>

                    </section>
                <section id='profile-img'><img src={ mine } alt="dp" /></section>

            </section>

        </nav>

    )

}

export default Navbar