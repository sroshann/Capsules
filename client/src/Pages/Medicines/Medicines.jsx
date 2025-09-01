import React, { useRef } from 'react'
import Navbar from '../../Components/Navbar/Navbar'
import Footer from '../../Components/Footer/Footer'
import { useMedicineFormik } from '../../Hooks/medicine.details.hooks'
import { useSelector } from 'react-redux'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/all'
import { useGSAP } from '@gsap/react'
import { animateMedicineData, animateProfile } from '../Signup/signup.animate'
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

                        When searching for a medicine, use its <span>chemical name</span>. For example,
                        the chemical name of <span>'Paracetamol'</span> is <span>'Acetaminophen</span>.'
                        Therefore, you should <span>search</span> using 'Acetaminophen' to obtain the relevant details. 
                        An example data is provided.

                    </p>

                </section>

                {/* Displaying medcine details */}
                <section 
                
                    ref={ medicineRef } 
                    id= "medicine-details" 
                    style={ searchedMed ? { opacity : "1" } : {} }
                    
                >

                    <section id='medicine-data-heading'>
                        
                        <p id='medicine-name'>{ searchedMed ? searchedMed?.name : "Acetaminophen" }</p>
                        <p className="medicine-sub-headings">
                            
                            { searchedMed ? searchedMed?.purpose : "Pain reliever/fever reducer" }
                            
                        </p>

                    </section>

                    <section>

                        <p className="medicine-sub-headings">Indication and usage</p>
                        <p className="medicine-desc">
                            
                            { searchedMed ? searchedMed?.indications_and_usage?.[0] :
                            
                                <>Uses • temporarily relieves minor aches and pains due to: • headache • muscular aches • backache 
                                • minor pain of arthritis • the common cold • toothache • premenstrual and menstrual cramps 
                                • temporarily reduces fever.</>

                            }
                            
                        </p>

                    </section>

                    <section>

                        <p className="medicine-sub-headings">Dosage and administration</p>
                        <p className="medicine-desc">
                            
                            { searchedMed ? searchedMed?.dosage_and_administration?.[0] :
                            
                                <>Directions • do not take more than directed (see overdose warning) adults and children 
                                12 years and over • take 2 caplets every 6 hours while symptoms last • do not take 
                                more than 6 caplets in 24 hours, unless directed by a doctor • do not use for more than 
                                10 days unless directed by a doctor children under 12 years ask a doctor</>
                            
                            }
                            
                        </p>

                    </section>

                    <section>

                        <p className="medicine-desc-red medicine-sub-headings">Warnings</p>
                        <p className="medicine-desc">
                            
                            { searchedMed ? searchedMed?.warnings?.[0] :
                            
                                <>Warnings Liver warning: This product contains acetaminophen. Severe liver damage may occur 
                                if you take • more than 4,000 mg of acetaminophen in 24 hours • with other drugs containing 
                                acetaminophen • 3 or more alcoholic drinks every day while using this product Allergy alert: 
                                Acetaminophen may cause severe skin reactions. Symptoms may include: • skin reddening • blisters 
                                • rash If a skin reaction occurs, stop use and seek medical help right away. Do not use 
                                • with any other drug containing acetaminophen (prescription or nonprescription). If you are 
                                not sure whether a drug contains acetaminophen, ask a doctor or pharmacist. • if you have ever 
                                had an allergic reaction to this product or any of its ingredients Ask a doctor before use if 
                                you have liver disease Ask a doctor or pharmacist before use if you are taking the blood thinning 
                                drug warfarin Stop use and ask a doctor if • pain gets worse or lasts more than 10 days • fever 
                                gets worse or lasts more than 3 days • new symptoms occur • redness or swelling is present These 
                                could be signs of a serious condition. If pregnant or breast-feeding, ask a health professional 
                                before use. Keep out of reach of children. Overdose warning: In case of overdose, get medical help 
                                or contact a Poison Control Center right away (1-800-222-1222). Quick medical attention is 
                                critical for adults as well as for children even if you do not notice any signs or symptoms.</>
                            
                            }
                            
                        </p>

                    </section>

                    <section>

                        <p className="medicine-sub-headings">Ask doctor</p>
                        <p className="medicine-desc">
                            
                            { searchedMed ? searchedMed?.ask_doctor?.[0] :
                            
                                <>Ask a doctor before use if you have liver disease 
                                and if you are taking the blood thinning drug warfarin.</>
                            
                            }
                            
                        </p>

                    </section>

                    <section>     

                        <p className="medicine-sub-headings">Pregnancy or breast feeding</p>
                        <p className="medicine-desc">
                            
                            { searchedMed ? searchedMed?.pregnancy_or_breast_feeding?.[0] :
                            
                                <>If pregnant or breast-feeding, ask a health professional before use.</>
                            
                            }
                            
                        </p>
                    
                    </section>
                    
                    <section>

                        <p className="medicine-sub-headings">Keep out of reach of children</p>
                        <p className="medicine-desc">
                            
                            { searchedMed ? searchedMed?.keep_out_of_reach_of_children?.[0] :
                            
                                <>Keep out of reach of children. Overdose warning: In case of overdose, get medical help 
                                or contact a Poison Control Center right away. Quick medical attention is critical for 
                                adults as well as for children even if you do not notice any signs or symptoms.</>
                            
                            }
                            
                        </p>

                    </section>
                    
                    <section>

                        <p className="medicine-desc-red medicine-sub-headings">Stop use</p>
                        <p className="medicine-desc">
                            
                            { searchedMed ? searchedMed?.stop_use?.[0] :
                            
                                <>Stop use and ask a doctor if • pain gets worse or lasts more than 10 days • fever gets 
                                worse or lasts more than 3 days • new symptoms occur • redness or swelling is present 
                                These could be signs of a serious condition.</>
                            
                            }
                            
                        </p>

                    </section>
                    
                    <section>

                        <p className="medicine-desc-red medicine-sub-headings">Do not use</p>
                        <p className="medicine-desc">
                            
                            { searchedMed ? searchedMed?.do_not_use?.[0] :
                            
                                <>Do not use • with any other drug containing acetaminophen (prescription or nonprescription). 
                                If you are not sure whether a drug contains acetaminophen, ask a doctor or pharmacist. 
                                • if you have ever had an allergic reaction to this product or any of its ingredients</>
                            
                            }
                            
                        </p>

                    </section>

                </section>

            </section>
            <Footer />

        </>

    )

}

export default Medicines