import React, { useEffect, useRef, useState } from 'react'
import Navbar from '../../Components/Navbar/Navbar'
import Footer from '../../Components/Footer/Footer'
import { useParams } from 'react-router-dom'
import { 
    
    useAddressFormik, useConsumeMedicine, useDeleteMedicine, 
    useGetParticularHome, useUpdateBSCHMData, useValidateAcsRqst

} from '../../Hooks/home.hooks'
import { useSelector } from 'react-redux'
import { AnimatePresence, motion } from 'framer-motion'
import { useGSAP } from '@gsap/react'
import { animateProfile } from '../../lib/gsap.animation'
import { useNavigateTo } from '../../Hooks/navbar.hooks'
import ConfirmPopUp from '../../Components/Confirm popup/ConfirmPopUp'
import { toastStyle } from '../../constants/common.constant'
import toast from 'react-hot-toast'
import './SingleHome.css'

function SingleHome() {

    const [homeData, setHomeData] = useState(null) // Used to store home data
    const [ searchedMed, setSearchedMed ] = useState([])
    const [ search, setSearch ] = useState('')
    const [ currentPage, setCurrentPage ] = useState( 0 )
    const [ editPopUp, setEditPopUp ] = useState( false ) // Boolean state used to show pop up for consume medicine
    const [ deletePopUp, setDeletePopUp ] = useState( false ) // Boolean state used to show pop up for deleting medicine 
    // Hook used to store the parameters which should be passed to function after confirming the pop up
    const [ executionParams, setExecutionParams ] = useState({}) 
    const [ showRequests, setShowRequests ] = useState( false ) // Used to view and close request list
    const [ acceptPopUp, setAcceptPopup ] = useState( false )
    const [ rejectPopUp, setRejectPopUp ] = useState( false )

    // Updating description
    const [ editDesc, setEditDesc ] = useState( false )
    const [ description, setDesription ] = useState('')

    // Updating location
    const [ editAddress, setEditAddress ] = useState( false )

    const { userData } = useSelector(state => state.authentication)
    const { homeId } = useParams() // Getting home Id from url
    const getParticularHome = useGetParticularHome() // Hook used to get data of home
    const consumeMedicine = useConsumeMedicine() // Hooke used to change medicine count
    const deleteMedicine = useDeleteMedicine() // Hook used to delete medicine
    const updateHomeData = useUpdateBSCHMData() // Hook used to update basic home data
    const validatUsrAcsRqst = useValidateAcsRqst() // Hook used to validate access requests
    const navigate = useNavigateTo()
    const formik = useAddressFormik( homeData, setHomeData, setEditAddress )

    useEffect(() => { getParticularHome(homeId, setHomeData) }, [])

    const HSref = useRef()
    useGSAP( () => { animateProfile( HSref ) }, [] )

    // Update medicine count
    const consume = ({ medId, homeId }) => {

        // This function will only execute after confirming the pop up box
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

    // Delete medicine
    const deleteMed = ( parameters ) => {

        // This function will only execute after confirming the pop up box
        // Updating this seperate array and delting the medicine
        let updated = searchedMed.filter( medicine => medicine?._id != parameters?.medId )
        setSearchedMed( updated )
        deleteMedicine( parameters, setHomeData )

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

        if ( filtered.length === 0 ) toast.error('Medicine not found', { style : toastStyle })
        else setSearchedMed( filtered )

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
            <AnimatePresence>

                {/* Medicine using pop up */}
                { editPopUp && <ConfirmPopUp 
                    
                    description={'Do you really used the medicine ?'} 
                    execution = { consume }
                    params = { executionParams }
                    final = { setEditPopUp }
                        
                />}

            </AnimatePresence>
            <AnimatePresence>

                {/* Medicine deleting pop up */}
                { deletePopUp && <ConfirmPopUp 
                    
                    description={'Do you really want to delete the medicine ?'} 
                    execution = { deleteMed }
                    params = { executionParams }
                    final = { setDeletePopUp }
                        
                />}

            </AnimatePresence>
            <AnimatePresence>

                {/* Accepting user access request */}
                { acceptPopUp && <ConfirmPopUp 
                
                    description={'Do you really want to accept the request ?'} 
                    execution = { validatUsrAcsRqst }
                    params = { executionParams }
                    final = { setAcceptPopup }
                    
                /> }

            </AnimatePresence>
            <AnimatePresence>

                {/* Rejecting user access request */}
                { rejectPopUp && <ConfirmPopUp 
                
                    description={'Do you really want to reject the request ?'} 
                    execution = { validatUsrAcsRqst }
                    params = { executionParams }
                    final = { setRejectPopUp }
                    
                /> }

            </AnimatePresence>

            <section id='homeDetails-root' ref={ HSref }>

                <section id='homeDetails'>

                    {/* Left section */}
                    <section id='homeDetails-left'>

                        {/* Search and create */}
                        <section id="home-left-search-and-create">

                            <form onSubmit={e => searchMedicines(e)} >

                                <div id='home-left-search'>

                                    <i className='bx  bx-search'  ></i>
                                    <input

                                        type="text"
                                        placeholder='Search your medicines'
                                        value={search}
                                        onChange={e => setSearch(e.target.value)}

                                    />
                                    <i className='bx  bx-x' onClick={clearSearch} />

                                </div>

                            </form>
                            <button

                                id='home-left-create'
                                onClick={() =>

                                    navigate('addMedicine', { homeId: homeData?._id, nickName: homeData?.nickName })

                                }

                            >

                                <i className='bx  bx-plus'  ></i>
                                Add new medicine

                            </button>
                            {homeData?.admin?._id === userData?._id && <section>

                                <button id='home-left-request' onClick={() => setShowRequests(true)}>Requests</button>
                                <>

                                    { homeData?.accessRequest?.length > 0 && <div id='home-request-count'>
                                        
                                        <p>{homeData?.accessRequest.length}</p>
                                        
                                    </div> }
                                    <AnimatePresence>

                                        {

                                            showRequests && <motion.section

                                                id="request-list"
                                                initial={{ y: -5, opacity: 0 }}
                                                animate={{ y: 0, opacity: 1 }}
                                                exit={{ y: -5, opacity: 0 }}
                                                transition={{ duration: 0.4 }}

                                            >

                                                { homeData?.accessRequest?.length > 0 ? 
                                                
                                                    <section id='list'>

                                                        {

                                                            homeData?.accessRequest.map(req => (

                                                                <div key={req?._id} className='requests' >

                                                                    <img src={req?.requester?.profilePicture} alt="" />
                                                                    <section>

                                                                        <div>

                                                                            <p>{req?.requester?.userName}</p>
                                                                            <p>{req?.createdAt}</p>

                                                                        </div>
                                                                        <div>

                                                                            <button onClick={ () => {

                                                                                setAcceptPopup( true )
                                                                                setExecutionParams({

                                                                                    homeId : homeData?._id,
                                                                                    requestId : req?._id,
                                                                                    requesterId : req?.requester?._id,
                                                                                    option : "a",
                                                                                    setHomeData

                                                                                })

                                                                            } } >Accept</button>
                                                                            <button onClick={ () => {

                                                                                setRejectPopUp( true )
                                                                                setExecutionParams({

                                                                                    homeId : homeData?._id,
                                                                                    requestId : req?._id,
                                                                                    requesterId : req?.requester?._id,
                                                                                    option : "r",
                                                                                    setHomeData

                                                                                })

                                                                            } }>Reject</button>

                                                                        </div>

                                                                    </section>

                                                                </div>

                                                            ))

                                                        }

                                                    </section> : <section id='empty-req-list'>

                                                        <p>No access requests have been received yet.</p>

                                                    </section> 
                                                    
                                                }

                                                <button id='close-rq-list' onClick={() => setShowRequests(false)}>Close</button>

                                            </motion.section>

                                        }

                                    </AnimatePresence>

                                </>

                            </section>}

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
                                            <section><p>{ med?.expiryDate === 'e' ? 'Expired' : med?.expiryDate }</p></section>
                                            <section>

                                                {/* The 'use' option is enabled only if it not expired */}
                                                { med?.expiryDate != 'e' && 
                                                
                                                    <p 
                                                    
                                                        className='use-medicine'
                                                        onClick={ () => {

                                                            setEditPopUp(true) // Showing the pop up
                                                            // Setting the parameters for 'consume'
                                                            // function after executing pop up
                                                            setExecutionParams({ medId: med?._id, homeId: med?.homeId })

                                                        }}
                                                    
                                                    >Use</p> 
                                                
                                                }
                                                <p 
                                                
                                                    className='delete-medicine'
                                                    onClick={ () => {

                                                        setDeletePopUp( true )
                                                        setExecutionParams({ medId: med?._id, homeId : med?.homeId })

                                                    } }

                                                >Delete</p>

                                            </section>

                                        </motion.div>

                                    ) )

                                }

                            </section>

                            {/* Pagination */}
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

                        <section id="home-description" style={ !editDesc ? { rowGap : '3px' } : {} }>

                            <section className='home-right-heading-edit'>

                                <p className='home-right-heading'>Description <i className='bx  bx-note' /></p>
                                { userData?._id === homeData?.admin?._id && 
                                
                                    <p onClick={ () => setEditDesc( previous => !previous ) } className='home-right-edit'>Edit ?</p> 
                                    
                                }

                            </section>
                            { editDesc ? 
                            
                                <textarea 
                                
                                    placeholder={ homeData?.description }
                                    onChange={ ( e ) => setDesription( e.target.value ) }  
                                    value={ description }
                                    
                                /> : 
                                <p>{homeData?.description}</p> 
                                
                            }
                            { editDesc && 
                            
                                <button className='save-changes-button' onClick = { () => 
                                    
                                    updateHomeData('description', homeData?._id, description, setHomeData, setEditDesc) 
                                
                                }>Save changes</button> 
                            
                            }

                        </section>
                        <section id="home-address" style={ !editAddress ? { rowGap : '3px' } : {} }>

                            <section className='home-right-heading-edit'>

                                <p className='home-right-heading'>Address <i className='bx  bx-street-view' /></p>
                                { userData?._id === homeData?.admin?._id &&

                                    <p className='home-right-edit' onClick={ () => setEditAddress( previous => !previous ) }>Edit ?</p>

                                }

                            </section>
                            <form onSubmit={ formik.handleSubmit } style={ editAddress ? { display : 'grid', rowGap : '5px' } : {} }>

                                { 
                                
                                    editAddress ? <input 
                                    
                                        type="text" 
                                        name = 'country'
                                        { ...formik.getFieldProps('country') }
                                        
                                    /> : 
                                    <p>Country : { homeData?.country }</p> 
                                    
                                }
                                {

                                    editAddress ? <input 
                                    
                                        type="text" 
                                        name = 'state'
                                        { ...formik.getFieldProps('state') }
                                        
                                    /> :
                                    <p>State : {homeData?.state}</p>

                                }
                                {

                                    editAddress ? <input 
                                    
                                        type="text" 
                                        name = 'district'
                                        { ...formik.getFieldProps('district') }
                                        
                                    /> :
                                    <p>District : {homeData?.district}</p>

                                }
                                {

                                    editAddress ? <input 
                                    
                                        type="number" 
                                        name = 'pincode'
                                        { ...formik.getFieldProps('pincode') }
                                        
                                    /> :
                                    <p>Pincode : {homeData?.pincode}</p>

                                }

                            { editAddress && <button type='submit' className='save-changes-button'>Save changes</button> }
                            </form>

                        </section>
                        <section id="home-members">

                            <section className='home-right-heading-edit'>

                                <p className='home-right-heading'>Members <i className='bx  bx-group' /></p>
                                { userData?._id === homeData?.admin?._id && <p className='home-right-edit'>Edit ?</p> }
                                
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

                            {/* Listing members */}
                            {homeData?.accessedUsers.length > 0 &&

                                homeData?.accessedUsers?.map(member => (

                                    <section className='home-display-admin' key={member?._id}>

                                        <motion.img

                                            src={member?.profilePicture}
                                            alt="Admin profile"
                                            whileHover={{ scale: 1.4 }}
                                            transition={{ type: "spring", stiffness: 260, damping: 20 }}

                                        />
                                        <section>

                                            <section className='home-admin-name'>

                                                <p className='home-you-text'>{member?.fullName}</p>

                                            </section>
                                            <p className='home-admin-email'>{member.email}</p>

                                        </section>

                                    </section>

                                ))

                            }

                        </section>

                    </section>

                </section>

            </section>
            <Footer />

        </>

    )

}

export default SingleHome