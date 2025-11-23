import React, { useEffect, useRef, useState } from 'react'
import Navbar from '../../Components/Navbar/Navbar'
import Footer from '../../Components/Footer/Footer'
import { useParams } from 'react-router-dom'
import { useConsumeMedicine, useGetParticularHome } from '../../Hooks/home.hooks'
import { useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import { useGSAP } from '@gsap/react'
import { animateProfile } from '../../lib/gsap.animation'
import { useNavigateTo } from '../../Hooks/navbar.hooks'
import './SingleHome.css'

function SingleHome() {

    const [homeData, setHomeData] = useState(null) // Used to store home data
    const [ searchedMed, setSearchedMed ] = useState([])
    const [ search, setSearch ] = useState('')
    const [ currentPage, setCurrentPage ] = useState( 0 )

    const { userData } = useSelector(state => state.authentication)
    const { homeId } = useParams() // Getting home Id from url
    const getParticularHome = useGetParticularHome() // Hook used to get data of home
    const consumeMedicine = useConsumeMedicine() // Hooke used to change medicine count
    const navigate = useNavigateTo()

    useEffect(() => { getParticularHome(homeId, setHomeData) }, [])

    const HSref = useRef()
    useGSAP( () => { animateProfile( HSref ) }, [] )

    // Update medicine count
    const consume = ( medId, homeId ) => {

        // Updating this seperate array and filtering out if any medicine quantity becomes 0
        let updated = searchedMed
        .map( medicine => {
            
            if( medicine._id === medId ) {
                
                return {
                        
                    ...medicine,
                    quantity : medicine.quantity - 1
                        
                }
                
            }
            return medicine
            
        } )
        .filter( medicine => medicine.quantity > 0 )
        setSearchedMed( updated )
        consumeMedicine( medId, homeId, setHomeData ) 
        
    }

    useEffect( () => {

        // Filtered data is only provided on initial rendering and clearing search
        if( homeData?.availableMedicines && searchedMed.length === 0 ) setSearchedMed( homeData?.availableMedicines )

    }, [ homeData?.availableMedicines ] )

    const searchMedicines = ( event ) => {

        event.preventDefault()
        const filtered = homeData?.availableMedicines.filter( object => 
            
            object.medicine.toLowerCase().includes( search.toLowerCase() ) 
        
        )
        setSearchedMed( filtered )

    }

    const clearSearch = () => {

        setSearch('')
        setSearchedMed( homeData?.availableMedicines )

    }

    const PAGE_SIZE = 8
    const pageNumber = Math.ceil( searchedMed.length / PAGE_SIZE )
    const starting = currentPage * PAGE_SIZE
    const ending = starting + PAGE_SIZE

    const incrementPage = () => setCurrentPage( previous => previous + 1 )
    const decrementPage = () => setCurrentPage( previous => previous - 1 )

    return (

        <>

            <Navbar />
            <section id='homeDetails-root' ref={ HSref }>

                <section id='homeDetails'>

                    {/* Left section */}
                    <section id='homeDetails-left'>

                        <section id="home-left-top">

                            {/* Search and create */}
                            <section id="home-left-search-and-create">

                                <form onSubmit={ e => searchMedicines(e) }>

                                    <div id='home-left-search'>

                                        <i className='bx  bx-search'  ></i>
                                        <input

                                            type="text"
                                            placeholder='Search your medicines'
                                            value={ search }
                                            onChange={ e => setSearch( e.target.value ) }

                                        />
                                        <i className='bx  bx-x' onClick={ clearSearch } />

                                    </div>

                                </form>
                                <button 
                                
                                    id='home-left-create' 
                                    onClick={ () => 
                                        
                                        navigate('addMedicine', { homeId : homeData?._id, nickName : homeData?.nickName }) 
                                    
                                    }
                                    
                                >

                                    <i className='bx  bx-plus'  ></i>
                                    Add new medicine

                                </button>
                                <button id='home-left-request'>Requests</button>

                            </section>

                        </section>
                        <section id="home-left-bottom">

                            {/* Listing medicines */}
                            <section id="headings">

                                <div>Medicine</div>
                                <div>Disease</div>
                                <div>Quantity</div>
                                <div>Expiry date</div>
                                <div>Total : { homeData?.availableMedicines.length }</div>

                            </section>
                            <section id="medicine-list">

                                {

                                    searchedMed && searchedMed.slice( starting, ending ).map( ( med, index ) => (

                                        <motion.div 
                                        
                                            className="medicine" 
                                            key={ index }
                                            whileHover={{ scale : 1.06 }}
                                            transition={{ type: "spring", stiffness: 260, damping: 20 }}
                                            
                                        >

                                            <section><p>{ med?.medicine }</p></section>
                                            <section><p>{ med?.disease }</p></section>
                                            <section><p>{ med?.quantity }</p></section>
                                            <section><p>{ med?.expiryDate }</p></section>
                                            <section>

                                                <p onClick={ () => consume( med?._id, med?.homeId ) } >Use</p>
                                                <p>Delete</p>

                                            </section>

                                        </motion.div>

                                    ) )

                                }

                            </section>

                            { pageNumber > 1 && <section id="medicine-pagination">

                                <button 
                                    
                                    className='current-page page-arrow' 
                                    onClick={ decrementPage }
                                    disabled = { currentPage === 0 }
                                    
                                ><i className='bx  bx-caret-left'></i></button>
                                <section>

                                    {

                                        [ ...Array( pageNumber ).keys() ].map( number => (

                                            <div 
                                            
                                                key={ number }  
                                                onClick={ () => setCurrentPage( number ) } 
                                                className={ currentPage === number ? "current-page" : "" }
                                                
                                            ><p>{ number + 1 }</p></div>

                                        ) )

                                    }
                                    
                                </section>
                                <button 
                                
                                    className='current-page page-arrow' 
                                    onClick={ incrementPage }
                                    disabled = { currentPage + 1 === pageNumber }
                                    
                                ><i className='bx  bx-caret-right'></i></button>

                            </section> }

                        </section>

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