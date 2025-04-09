import React from 'react'
import { useMediaQuery } from 'react-responsive'
import './Navbar.css'
import DesktopNav from './DesktopNav'
import MobileNav from './MobileNav'

function Navbar() {

    const isMobile = useMediaQuery({ maxWidth : 1024 })
    const isDesktop = useMediaQuery({ minWidth : 1025 })

    return (

        <>
            
            { isMobile && <MobileNav /> }
            { isDesktop && <DesktopNav /> }

        </>

    )

}

export default Navbar