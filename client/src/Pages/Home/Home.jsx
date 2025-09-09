import React, { useEffect, useRef } from 'react'
import Navbar from '../../Components/Navbar/Navbar'
import Footer from '../../Components/Footer/Footer'
import { useGSAP } from '@gsap/react'
import { animateProfile } from '../Signup/signup.animate'
import { useNavigateTo } from '../../Hooks/navbar.hooks'
import { useGetHomes } from '../../Hooks/home.hooks'
import { useSelector } from 'react-redux'
import './Home.css'

function Home() {

    // This home data is stored in this store
    const { homesData } = useSelector( state => state.homes )
    const { userData } = useSelector( state => state.authentication )

    const navigate = useNavigateTo() // Hook used for navigation
    const getHomes = useGetHomes() // Hook used to get all homes

    // GSAP
    const homeRef = useRef()
    // Using the same animation of profile page
    useGSAP( () => { animateProfile( homeRef ) }, [] )

    useEffect( () => { getHomes() }, [] )

    return (

        <>
        
            <Navbar />
            <section id="home-root" ref={ homeRef }>

                {/* Search and create */}
                <section id="search-and-create">

                    <div id='search'>

                        <i className='bx  bx-search'  ></i> 
                        <input type="text" placeholder='Search your home' />
                        <i className='bx  bx-x'  ></i> 

                    </div>
                    <button id='create' onClick={ () => navigate('createHome') }>
                        
                        <i className='bx  bx-plus'  ></i> 
                        Create a new home
                        
                    </button>

                </section>

                {/* Home data listing */}
                <section id="listing-homes">

                    { homesData && homesData.length > 0 && 
                    
                        homesData.map(( object, index ) => (

                            <div key={ index } className='home'>

                                <section className='home-upper-section'>

                                    <section>

                                        <section className='home-names'>
                                            
                                            <p className='home-nickname'>{ object?.nickName }</p>
                                            <p className='home-homename'>{ object?.homeName }</p>
                                            
                                        </section>

                                        { 
                                        
                                            object?.availableMedicines?.length === 0 ? 
                                            <p className='medicine-number no-medicine'>No medicines were added</p> : 
                                            <p className='medicine-number'>
                                                
                                                Number of medicines added = { object?.availableMedicines?.length }
                                                
                                            </p> 
                                        
                                        }

                                    </section>

                                    <section className='home-member-section'>

                                        <p className='home-member-headline'>Members</p>
                                        <section className='home-admin'>

                                            {

                                                userData?.email === object?.admin?.email ? 
                                                <section className='home-you'>

                                                    <p className='home-you-text'>You</p>
                                                    <p className='home-admin-text'>admin</p>

                                                </section> : 
                                                <section className='home-display-admin'> 

                                                    <img src={ object?.admin?.profilePicture } alt="" />
                                                    <section>

                                                        <section className='home-admin-name'>

                                                            <p>{ object?.admin?.fullName }</p>
                                                            <p className='home-admin-text'>admin</p>

                                                        </section>
                                                        <p className='home-admin-email'>{ object?.admin?.email }</p>

                                                    </section>

                                                </section>

                                            }

                                        </section>

                                    </section>

                                </section>
                                <section className='home-lower-section'>

                                    <p>Click to see more details</p>
                                    <p><span>Created on : </span>{ object?.createdAt }</p>

                                </section>

                            </div>

                        )) 

                    }

                </section>

            </section>
            <Footer />

        </>

    )

}

export default Home