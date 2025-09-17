import React, { useRef } from 'react'
import Navbar from '../../Components/Navbar/Navbar'
import Footer from '../../Components/Footer/Footer'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/all'
import { useGSAP } from '@gsap/react'
import { animateProfile } from '../../lib/gsap.animation'
import './About.css'

function About() {

    const aboutRef = useRef()
    gsap.registerPlugin( ScrollTrigger )
    useGSAP( () => { animateProfile( aboutRef ) }, [] )

    return (

        <>

            <Navbar />
            <section id='about-root' ref={ aboutRef }>

                <section id='about-contents'>

                    <section><p id='about-heading'>ABOUT US</p></section>
                    <section id='about-description'>

                        <p>Our platform is a robust and intuitive medicine management system designed to help users
                        efficiently track and organize medications used for human diseases. It provides a structured and
                        collaborative environment where individuals can store and manage their medicinal records while allowing
                        controlled access to trusted members.</p>

                        <p>Each user can create a Home, a dedicated space where they can log details about the medicines they use,
                        including dosage, purpose, and administration guidelines. This ensures that all essential information is
                        readily available for personal reference and shared use. To enhance collaboration, users can send requests
                        to join existing Homes, enabling families, caregivers, or healthcare groups to manage medication records
                        collectively. The Home Admin, who is the creator of the Home, has full control over these requests and can
                        approve or deny access based on their discretion.</p>

                        <p>The platform also provides detailed insights into each medicine, offering comprehensive information about
                        its usage, benefits, and recommended administration. This feature ensures that users have access to
                        reliable medical information, helping them make informed decisions about their healthcare. Additionally,
                        once a user gains access to a Home, they can contribute by adding, updating, or removing medicines based
                        on their permissions. The Home Admin retains the authority to manage these roles, ensuring data integrity
                        and security. To maintain accuracy and prevent outdated medications from being stored, the system
                        automatically removes medicines that have exceeded their usage date, keeping the Home updated and reliable.</p>

                        <p>Built for efficiency, security, and ease of use, this platform streamlines the process of medication
                        tracking, making it an essential tool for individuals, families, and healthcare communities seeking an
                        organized approach to medicine management.</p>

                    </section>

                </section>

            </section>
            <Footer />

        </>

    )

}

export default About