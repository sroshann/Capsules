import React from 'react'
import './Landing.css'

function DesktopBento() {

    return (

        <section id="bento-grid">

            <section className="bento-upper">

                <div id="management" className='green'>

                    <section className="div-heading">

                        <p>Medication Management</p>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 48 48"><g fill="currentColor"><path d="M37.084 15.735a1 1 0 1 0 .448-1.949l-6.616-1.52a1 1 0 1 0-.448 1.948z" /><path fill-rule="evenodd" d="M34 22a8 8 0 1 0 0-16a8 8 0 0 0 0 16m0-2a6 6 0 1 0 0-12a6 6 0 0 0 0 12M16.778 9.245c-.647-1.532-2.813-1.686-3.682-.263L6.292 20.115c-.785 1.284.092 2.924 1.623 3.033l11.866.846c1.53.11 2.644-1.388 2.06-2.77zm-1.967.768l-.009.012L8.01 21.14l.002.002l.01.004a.1.1 0 0 0 .036.007l11.867.846h.038a.1.1 0 0 0 .029-.015l-5.056-11.96l-.004-.01a.1.1 0 0 0-.054-.014a.13.13 0 0 0-.062.009l-.003.001v.001zM35.385 36.36a6 6 0 0 0-5.071-10.876l-10.876 5.07a6 6 0 1 0 5.071 10.877zm-15.102-3.992a4 4 0 1 0 3.381 7.25l4.466-2.083l-3.38-7.25zm9.66 4.322l-3.381-7.25l4.597-2.144a4 4 0 1 1 3.38 7.25z" clip-rule="evenodd" /></g></svg>

                    </section>
                    <p className="div-description">Our platform offers a secure and organized way to manage medications.
                        Users can store records, track usage, and keep medicines up to date. Collaboration with family,
                        caregivers, or healthcare professionals ensures efficient and accurate management.</p>

                </div>
                <div id="storage" className='white'>

                    <section className="div-heading">

                        <p>Personal Medicine Storage</p>
                        <i className='bx bx-data' />

                    </section>
                    <p className="div-description">Each user can create a personal Home, a dedicated space where they can
                        organize and store information about the medicines they use. This feature allows users to keep track
                        of medication details, including dosage, purpose, and administration instructions,
                        ensuring all essential information is easily accessible at any time.</p>

                </div>
                <div id="admin" className='green'>

                    <section className="div-heading">

                        <p>Home Admin Controls</p>
                        <i className='bx bx-user' />

                    </section>
                    <p className="div-description">The Home Admin has full control over data,
                        managing member requests, permissions, and medication records to ensure security and integrity.</p>

                </div>

            </section>
            <section className="bento-lower">

                <div id="auto-remove" className='white'>

                    <section className="div-heading">

                        <p>Auto-Remove Expired Medicines</p>
                        <i className='bx bx-trash' />

                    </section>
                    <p className="div-description">The platform automatically removes expired medicines,
                        ensuring safety and preventing the use of outdated medications.
                        This keeps the medicine list accurate and up to date.</p>

                </div>
                <div id="insights" className='green'>

                    <section className="div-heading">

                        <p>Medicine Insights</p>
                        <i className='bx bx-command' />

                    </section>
                    <p className="div-description">Each medicine entry includes detailed insights,
                        such as when, how, and why it should be used. Users can access crucial information,
                        including medical benefits, recommended dosage, and potential side effects,
                        helping them make informed decisions about their healthcare.</p>

                </div>
                <div id="collaborate" className='white'>

                    <section className="div-heading">

                        <p>Invite & Collaborate</p>
                        <i className='bx bx-user-plus' />

                    </section>
                    <p className="div-description">Medication management often requires collaboration
                        with family or caregivers. Users can invite trusted members to their Home for
                        shared tracking, while the Home Admin controls approvals and permissions for viewing,
                        adding, or modifying records.</p>

                </div>

            </section>

        </section>
        
    )

}

export default DesktopBento