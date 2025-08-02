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
                {/* <section id="listing-homes">

                    { homesData.length > 0 && 
                    
                        homesData.map(( object, index ) => (

                            <div key={ index }>

                                <section>

                                    <section>

                                        <section>
                                            
                                            <p>{ object?.nickName }</p>
                                            <p>{ object?.homeName }</p>
                                            
                                        </section>

                                        <p>Total number of medicines = { object?.availableMedicines?.length }</p>

                                    </section>

                                    <section>

                                        <p>Members</p>
                                        

                                    </section>

                                </section>
                                <section>

                                    <p>Click to see more details 
                                        
                                        <img src="https://res.cloudinary.com/dle6cdwdb/image/upload/v1754089292/long-arrow-icon-1337191-512_iaro2i.png" alt="" />
                                    
                                    </p>
                                    <p>Created on : { object?.createdAt }</p>

                                </section>

                            </div>

                        )) 

                    }

                </section> */}

            </section>
            <Footer />

        </>

    )

}

export default Home