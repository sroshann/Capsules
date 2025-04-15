import React from 'react'
import './Landing.css'
import { useGSAP } from '@gsap/react'
import { animateMobileBento } from './landing.animate'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/all'

function MobileBento() {

    gsap.registerPlugin( ScrollTrigger )
    useGSAP( () => { animateMobileBento() }, [] )

    return (

        <section id="mobile-bento-grid">

            <section className="bento-left">

                <div id="management" className='green mobile-bento-upper'>

                    <section className="div-heading"><p>Medication Management</p></section>
                    <p className="div-description">Our platform offers a secure and organized way to manage medications.
                        Users can store records, track usage, and keep medicines up to date. Collaboration with family,
                        caregivers, or healthcare professionals ensures efficient and accurate management.</p>

                </div>
                <div id="storage" className='white mobile-bento-left'>

                    <section className="div-heading"><p>Personal Medicine Storage</p></section>
                    <p className="div-description">Each user can create a personal Home, a dedicated space where they can
                        organize and store information about the medicines they use. This feature allows users to keep track
                        of medication details, including dosage, purpose, and administration instructions,
                        ensuring all essential information is easily accessible at any time.</p>

                </div>
                <div id="admin" className='green mobile-bento-lower'>

                    <section className="div-heading"><p>Home Admin Controls</p></section>
                    <p className="div-description">The Home Admin has full control over data,
                        managing member requests, permissions, and medication records to ensure security and integrity.</p>

                </div>

            </section>
            <section className="bento-right ">

                <div id="auto-remove" className='white mobile-bento-upper'>

                    <section className="div-heading"><p>Auto-Remove Expired Medicines</p></section>
                    <p className="div-description">The platform automatically removes expired medicines,
                        ensuring safety and preventing the use of outdated medications.
                        This keeps the medicine list accurate and up to date.</p>

                </div>
                <div id="insights" className='green mobile-bento-right'>

                    <section className="div-heading"><p>Medicine Insights</p></section>
                    <p className="div-description">Each medicine entry includes detailed insights,
                        such as when, how, and why it should be used. Users can access crucial information,
                        including medical benefits, recommended dosage, and potential side effects,
                        helping them make informed decisions about their healthcare.</p>

                </div>
                <div id="collaborate" className='white mobile-bento-lower'>

                    <section className="div-heading"><p>Invite & Collaborate</p></section>
                    <p className="div-description">Medication management often requires collaboration
                        with family or caregivers. Users can invite trusted members to their Home for
                        shared tracking, while the Home Admin controls approvals and permissions for viewing,
                        adding, or modifying records.</p>

                </div>

            </section>

        </section>

    )

}

export default MobileBento