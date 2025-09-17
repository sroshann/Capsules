import React, { useRef } from 'react'
import Navbar from '../../Components/Navbar/Navbar'
import Footer from '../../Components/Footer/Footer'
import { useMedicineFormik } from '../../Hooks/medicine.details.hooks'
import { useSelector } from 'react-redux'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/all'
import { useGSAP } from '@gsap/react'
import { animateMedicineData, animateProfile } from '../../lib/gsap.animation'
import { defaultData } from './default.data.medicine'
import './Medicines.css'

function Medicines() {

    const formik = useMedicineFormik()
    const { searchedMed } = useSelector( state => state.medicine )

    const searchRef = useRef()
    const medicineRef = useRef()
    gsap.registerPlugin( ScrollTrigger )
    useGSAP( () => { 
        
        animateProfile( searchRef ) 
        animateMedicineData( medicineRef, searchedMed === null ? true : false )
    
    }, [] )

    return (

        <>

            <Navbar />
            <section id='medicine-roots'>

                {/* Search area */}
                <section id="medicine-search-area" ref={ searchRef }>

                    <form id='medicine-search' onSubmit={ formik.handleSubmit }>

                        <i className='bx  bx-search'  ></i>
                        <input

                            type="text"
                            placeholder='Search for medicines to learn more about their details and usage'
                            { ...formik.getFieldProps('medicine') }

                        />
                        <i className='bx  bx-x' onClick={ () => formik.resetForm() } ></i>

                    </form>
                    <p id='medicine-search-label'>

                        When searching for a medicine, use the name recognized 
                        by <a href='https://www.fda.gov/' target='_blank' rel="noopener noreferrer">
                        
                            <span style={{ color : "#0125f8", cursor : "pointer" }}>FDA</span>
                            
                        </a>.
                        For example, <span>'Paracetamol'</span> is also known as <span>'Acetaminophen</span>.'
                        Therefore, you should <span>search</span> using 'Acetaminophen' to obtain the relevant details. 
                        An example is provided.

                    </p>

                </section>

                {/* Displaying medcine details */}
                <section 
                
                    ref={ medicineRef } 
                    id= "medicine-details" 
                    style={ searchedMed ? { opacity : "1" } : {} }
                    
                >

                    <section id='medicine-data-heading'>
                        
                        <p id='medicine-name'>{ searchedMed ? searchedMed?.name : defaultData?.name }</p>
                        <p className="medicine-sub-headings"> { searchedMed ? searchedMed?.purpose : defaultData?.purpose } </p>

                    </section>

                    {

                        // Indication and usage
                        searchedMed ? <>
                        
                            {

                                searchedMed?.indications_and_usage && <section>

                                    <p className="medicine-sub-headings">Indication and usage</p>
                                    <p className="medicine-desc">{ searchedMed?.indications_and_usage?.[0] }</p>

                                </section>

                            }
                        
                        </> : <section>

                            <p className="medicine-sub-headings">Indication and usage</p>
                            <p className="medicine-desc">{ defaultData?.indications_and_usage }</p>
                            
                        </section>

                    }

                    {

                        // Dosage and administration
                        searchedMed ? <>
                        
                            {

                                searchedMed?.dosage_and_administration && <section>

                                    <p className="medicine-sub-headings">Dosage and administration</p>
                                    <p className="medicine-desc">{ searchedMed?.dosage_and_administration?.[0] }</p>

                                </section>

                            }
                        
                        </> : <section>

                            <p className="medicine-sub-headings">Dosage and administration</p>
                            <p className="medicine-desc">{ defaultData?.dosage_and_administration }</p>

                        </section>

                    }

                    {

                        // Warnings
                        searchedMed ? <>
                        
                            {

                                ( searchedMed?.warnings || searchedMed?.warnings_and_cautions ) && <section>

                                    <p className="medicine-desc-red medicine-sub-headings">Warnings</p>
                                    <p className="medicine-desc">
                                        
                                        { searchedMed?.warnings?.[0] || searchedMed?.warnings_and_cautions?.[0] }
                                        
                                    </p>

                                </section>

                            }
                        
                        </> : <section>

                            <p className="medicine-desc-red medicine-sub-headings">Warnings</p>
                            <p className="medicine-desc">{ defaultData?.warning }</p>

                        </section>

                    }

                    {

                        // Ask doctor
                        searchedMed ? <>
                        
                            {

                                searchedMed?.ask_doctor && <section>

                                    <p className="medicine-sub-headings">Ask doctor</p>
                                    <p className="medicine-desc">{ searchedMed?.ask_doctor?.[0] }</p>

                                </section>

                            }
                        
                        </> : <section>

                            <p className="medicine-sub-headings">Ask doctor</p>
                            <p className="medicine-desc">{ defaultData?.ask_doctor }</p>

                        </section>

                    }

                    {

                        // Information to patients
                        ( searchedMed && searchedMed?.information_for_patients ) && <section>

                            <p className="medicine-sub-headings">Information for patients</p>
                            <p className="medicine-desc">{ searchedMed?.information_for_patients?.[0] }</p>

                        </section>

                    }

                    {

                        // Pregnancy
                        searchedMed ? <>
                        
                            {

                                ( searchedMed?.pregnancy_or_breast_feeding || searchedMed?.pregnancy ) && <section>

                                    <p className="medicine-sub-headings">Pregnancy or breast feeding</p>
                                    <p className="medicine-desc">
                                        
                                        { searchedMed?.pregnancy_or_breast_feeding?.[0] || searchedMed?.pregnancy?.[0] }
                                        
                                    </p>

                                </section>

                            }
                        
                        </> : <section>

                            <p className="medicine-sub-headings">Pregnancy or breast feeding</p>
                            <p className="medicine-desc">{ defaultData?.pregnancy }</p>

                        </section>

                    }

                    {

                        // Pediatric use
                        ( searchedMed && searchedMed?.pediatric_use ) && <section>

                            <p className="medicine-sub-headings">Pediatric use</p>
                            <p className="medicine-desc">{ searchedMed?.pediatric_use?.[0] }</p>

                        </section>

                    }

                    {

                        // Keep out of children
                        searchedMed ? <>

                            {

                                searchedMed?.keep_out_of_reach_of_children && <section>

                                    <p className="medicine-sub-headings">Keep out of reach of children</p>
                                    <p className="medicine-desc">{ searchedMed?.keep_out_of_reach_of_children?.[0] }</p>

                                </section>

                            }
                        
                        </> : <section>

                            <p className="medicine-sub-headings">Keep out of reach of children</p>
                            <p className="medicine-desc">{ defaultData?.children }</p>

                        </section>

                    }

                    {

                        // Over dosage
                        ( searchedMed && searchedMed?.overdosage ) && <section>

                            <p className="medicine-desc-red medicine-sub-headings">Over dosage</p>
                            <p className="medicine-desc">{ searchedMed?.overdosage?.[0] }</p>

                        </section>

                    }

                    {

                        // Stop use
                        searchedMed ? <>
                        
                            {

                                searchedMed?.stop_use && <section>

                                    <p className="medicine-desc-red medicine-sub-headings">Stop use</p>
                                    <p className="medicine-desc">{ searchedMed?.stop_use?.[0] }</p>

                                </section>

                            }
                        
                        </> : <section>

                            <p className="medicine-desc-red medicine-sub-headings">Stop use</p>
                            <p className="medicine-desc">{ defaultData?.stop_use }</p>

                        </section>

                    }
                    
                    { 

                        // Do not use
                        searchedMed ? <>
                    
                            {

                                searchedMed?.do_not_use && <section>

                                    <p className="medicine-desc-red medicine-sub-headings">Do not use</p>
                                    <p className="medicine-desc">{ searchedMed?.do_not_use?.[0] }</p>

                                </section>

                            }
                    
                        </> : <section>

                            <p className="medicine-desc-red medicine-sub-headings">Do not use</p>
                            <p className="medicine-desc">{ defaultData?.do_not_use }</p>

                        </section>

                    }

                </section>

            </section>
            <Footer />

        </>

    )

}

export default Medicines