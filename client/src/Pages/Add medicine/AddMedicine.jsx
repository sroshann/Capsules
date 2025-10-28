import React, { useEffect, useRef, useState } from 'react'
import Navbar from '../../Components/Navbar/Navbar'
import Footer from '../../Components/Footer/Footer'
import { useParams } from 'react-router-dom'
import { useGSAP } from '@gsap/react'
import { animateProfile } from '../../lib/gsap.animation'
import SelectMedicine from '../../Components/Select medicine/SelectMedicine'
import { AnimatePresence } from 'framer-motion'
import { useAddMedFormik, useGetMedicineNames } from '../../Hooks/medicine.details.hooks'
import './AddMedicine.css'

function AddMedicine() {

    const [ selectMed, setSelectMed ] = useState( false ) // Used to display the medicine name listing
    const [ medicineName, setMedicineNames ] = useState([])
    const [ filterMed, setFilterMed ] = useState([])
    const { homeId, nickName } = useParams() // Fetching home Id and nickname from URL
    const addMedRef = useRef()
    useGSAP( () => { animateProfile( addMedRef ) }, [] )
    const getMedicines = useGetMedicineNames()
    const formik = useAddMedFormik()

    const handleMedAync = async () => {

        const data = await getMedicines()
        setMedicineNames( data )
        setFilterMed( data )

    }

    const filterMedicine = ( search ) => {

        if ( medicineName?.length > 0 ) {

            let filter = medicineName.filter( medicine => 

                medicine.toLowerCase().includes( search.toLowerCase() )

            )
            setFilterMed( filter )

        }

    }
    
    useEffect( () => {
        
        // The medicine data is fetched when 'selectMed' is true and name array is empty
        if ( selectMed && medicineName.length === 0 ) handleMedAync()

    }, [ selectMed ] )

    return (

        <>
            
            <Navbar />
            <section id="add-medicine-root" ref={ addMedRef }>

                <section id="add-med-left">

                    <section>

                        <p>ADD NEW MEDICINE</p>
                        <p>
                            
                            Select medicine that you would like to add 
                            to your home <br /> and provide its details
                            
                        </p>

                    </section>

                </section>
                <section id="add-med-right">

                    <form action="" onSubmit={ formik.handleSubmit }>

                        <div className="add-med-divs">
                            
                            <input 
                            
                                type="text" 
                                placeholder='Select medicine' 
                                {...formik.getFieldProps('medicine')}
                                onFocus={ () => setSelectMed(true) } 
                                onBlur={(e) => { 

                                    // Have to do like this when I need both formik and manual also for change
                                    setSelectMed(false)
                                    formik.handleBlur(e)

                                }}
                                value = { formik.values.medicine }
                                onChange={(e) => {

                                    filterMedicine(e.target.value)
                                    formik.handleChange(e)

                                }}
                                style={{ width : '100%', height : '100%' }}
                                
                            />
                            <i className='bx  bx-chevron-down'  ></i> 
                            
                        </div>
                        <AnimatePresence > 

                            {   ( selectMed && medicineName.length > 0 )  && 
                            
                                <SelectMedicine maxHeight={ 300 } width={ 364.8 } medicines={ filterMed } formik = { formik } /> 
                                
                            } 

                            
                        </AnimatePresence>
                        <div className="add-med-divs">
                            
                            <input 
                            
                                type="text" 
                                placeholder='Disease in which the medicine is used for' 
                                { ...formik.getFieldProps('disease') }
                                
                            />
                            
                        </div>
                        <section>

                            <div className="add-med-divs">
                                
                                <input 
                                    
                                    type="number" 
                                    placeholder='Quantity' 
                                    { ...formik.getFieldProps('quantity') }
                                    
                                />
                                
                            </div>
                            <div className="add-med-divs">
                                
                                <input 
                                
                                    type="date" 
                                    { ...formik.getFieldProps('expiryDate') }
                                    
                                />
                                
                            </div>

                        </section>
                        <button type='sumit'>Add medicine to { nickName }</button>

                    </form>

                </section>

            </section>
            <Footer />

        </>
    )

}

export default AddMedicine