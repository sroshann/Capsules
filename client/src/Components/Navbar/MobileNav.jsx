import React, { useState } from 'react'

function MobileNav() {

    const [openMenu, setOpenMenu] = useState(false)
    const handleMenu = () => setOpenMenu(previous => !previous)

    return (

        <>

            {!openMenu && <button onClick={handleMenu} className='nav-menu-button'>Menu</button>}
            {openMenu &&

                <section id='display-nav-items'>

                    <section id="upper">

                        <p>CAPSULES</p>
                        <button onClick={handleMenu} className='nav-menu-button white'>Close</button>

                    </section>
                    <section id="lower">

                        <p>Home</p>
                        <p>Find other homes</p>
                        <p>Medicines</p>
                        <p>About</p>
                        <p>Profile</p>
                        <p>Notification <i className='bx bx-bell' /></p>

                    </section>

                </section>

            }

        </>

    )

}

export default MobileNav