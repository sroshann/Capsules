import React, { useEffect, useState } from 'react'
import Navbar from '../../Components/Navbar/Navbar'
import Footer from '../../Components/Footer/Footer'
import { useParams } from 'react-router-dom'
import { useGetParticularHome } from '../../Hooks/home.hooks'
import { useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import './SingleHome.css'

function SingleHome() {

    const [homeData, setHomeData] = useState(null) // Used to store home data

    const { homeId } = useParams() // Getting home Id from url
    const getParticularHome = useGetParticularHome() // Hook used to get data of home

    const { userData } = useSelector(state => state.authentication)

    useEffect(() => { getParticularHome(homeId, setHomeData) }, [])

    return (

        <>

            <Navbar />
            <section id='homeDetails-root'>

                <section id='homeDetails'>

                    {/* Left section */}
                    <section id='homeDetails-left'>

                        <section id="home-left-top">

                            {/* Search and create */}
                            <section id="home-left-search-and-create">

                                <form>

                                    <div id='home-left-search'>

                                        <i className='bx  bx-search'  ></i>
                                        <input

                                            type="text"
                                            placeholder='Search your medicines'

                                        />
                                        <i className='bx  bx-x' />

                                    </div>

                                </form>
                                <button id='home-left-create'>

                                    <i className='bx  bx-plus'  ></i>
                                    Add new medicine

                                </button>
                                <button id='home-left-request'>Requests</button>

                            </section>

                        </section>
                        <section id="home-left-bottom"></section>

                    </section>

                    {/* Right section */}
                    <section id='homeDetails-right'>

                        <section id="home-description">

                            <section className='home-right-heading-edit'>

                                <p className='home-right-heading'>Description <i className='bx  bx-note' /></p>
                                <p className='home-right-edit'>Edit ?</p>

                            </section>
                            <p>{homeData?.description}</p>

                        </section>
                        <section id="home-address">

                            <section className='home-right-heading-edit'>

                                <p className='home-right-heading'>Address <i className='bx  bx-street-view' /></p>
                                <p className='home-right-edit'>Edit ?</p>

                            </section>
                            <p>Country : {homeData?.country}</p>
                            <p>State : {homeData?.state}</p>
                            <p>District : {homeData?.district}</p>
                            <p>Pincode : {homeData?.pincode}</p>

                        </section>
                        <section id="home-members">

                            <section className='home-right-heading-edit'>

                                <p className='home-right-heading'>Members <i className='bx  bx-group' /></p>
                                <p className='home-right-edit'>Edit ?</p>

                            </section>

                            {/* Admin section */}
                            <section className='home-admin'>

                                {

                                    userData?.email === homeData?.admin?.email ?

                                        <section className='home-you'>

                                            <motion.img

                                                src={homeData?.admin?.profilePicture}
                                                alt="Admin profile"
                                                whileHover={{ scale: 1.4 }}
                                                transition={{ type: "spring", stiffness: 260, damping: 20 }}

                                            />
                                            <section>

                                                <p className='home-you-text'>You</p>
                                                <p className='home-admin-text'>admin</p>

                                            </section>

                                        </section> :
                                        <section className='home-display-admin'>

                                            <motion.img

                                                src={homeData?.admin?.profilePicture}
                                                alt="Admin profile"
                                                whileHover={{ scale: 1.4 }}
                                                transition={{ type: "spring", stiffness: 260, damping: 20 }}

                                            />
                                            <section>

                                                <section className='home-admin-name'>

                                                    <p className='home-you-text'>{homeData?.admin?.fullName}</p>
                                                    <p className='home-admin-text'>admin</p>

                                                </section>
                                                <p className='home-admin-email'>{homeData?.admin?.email}</p>

                                            </section>

                                        </section>

                                }

                            </section>

                        </section>

                    </section>

                </section>

            </section>
            <Footer />

        </>

    )

}

export default SingleHome