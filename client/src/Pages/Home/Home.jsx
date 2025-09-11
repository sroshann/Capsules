import React, { useEffect, useRef, useState } from 'react'
import Navbar from '../../Components/Navbar/Navbar'
import Footer from '../../Components/Footer/Footer'
import { useGSAP } from '@gsap/react'
import { animateProfile } from '../Signup/signup.animate'
import { useNavigateTo } from '../../Hooks/navbar.hooks'
import { useGetHomes, useSearchYourHome } from '../../Hooks/home.hooks'
import { useSelector } from 'react-redux'
import './Home.css'

function Home() {

    const [ search, setSearch ] = useState('') // Used to store the searching home
    // Used to check status of searching whether data found or not
    const [ searchStatus, setSearchStatus ] = useState( false )
    const [ filteredHome, setFilteredHome ] = useState( null ) // Used to render the searched homes too

    // This home data is stored in this store
    const { homesData } = useSelector( state => state.homes )
    const { userData } = useSelector( state => state.authentication )

    const navigate = useNavigateTo() // Hook used for navigation
    const getHomes = useGetHomes() // Hook used to get all homes
    const searchHome = useSearchYourHome() // Hook used to filter out accessed homes

    // GSAP
    const homeRef = useRef()
    useGSAP( () => { animateProfile( homeRef ) }, [] ) // Using the same animation of profile page

    // Handling search features
    const handleSearch = ( event = null, searching = false ) => {

        // Function works both for searching and clearing search input

        if( searching ) { 

            // Passing the search string and result setting state into state function
            // if the value is found, then status retured as 'true' otherwise 'false'.
            
            event.preventDefault()
            const status = searchHome( search, setFilteredHome )
            setSearchStatus( status )
            
        } else {
            
            // On clearing the search input, we should reset the 'filtered' state with the whole home data
            // But if data is not found the search state become false, and also we need to just
            // clear the search input no need to reassing the 'filtered' state, because the data
            // in the state is not changed

            setSearch('')
            if( searchStatus ) setFilteredHome( homesData )

        }

    }

    useEffect( () => { getHomes() }, [] )
    useEffect( () => { 
        
        // Setting the homes data in home store into filtered list
        // the filtered array is maped down ( displayed )
        setFilteredHome( homesData ) 
    
    }, [ homesData ] )

    return (

        <>
        
            <Navbar />
            <section id="home-root" ref={ homeRef }>

                {/* Search and create */}
                <section id="search-and-create">

                    <form onSubmit={ ( event ) => handleSearch( event, true ) }>

                        <div id='search'>

                            <i className='bx  bx-search'  ></i> 
                            <input 
                            
                                type="text" 
                                placeholder='Search your home using home name or home nickname' 
                                value = { search }
                                onChange={ ( event ) => setSearch( event.target.value ) }
                                
                            />
                            <i className='bx  bx-x' onClick={ () => handleSearch( null, false ) }  ></i> 

                        </div>

                    </form>
                    <button id='create' onClick={ () => navigate('createHome') }>
                        
                        <i className='bx  bx-plus'  ></i> 
                        Create a new home
                        
                    </button>

                </section>

                {/* Home data listing */}
                <section id="listing-homes">

                    { filteredHome && filteredHome.length > 0 && 
                    
                        filteredHome.map(( object, index ) => (

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