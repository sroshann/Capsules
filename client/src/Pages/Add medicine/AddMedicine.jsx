import React, { useRef } from 'react'
import Navbar from '../../Components/Navbar/Navbar'
import Footer from '../../Components/Footer/Footer'
import { useParams } from 'react-router-dom'
import { useGSAP } from '@gsap/react'
import { animateProfile } from '../../lib/gsap.animation'
import './AddMedicine.css'

function AddMedicine() {

    const { homeId, nickName } = useParams() // Fetching home Id and nickname from URL
    const addMedRef = useRef()
    useGSAP( () => { animateProfile( addMedRef ) }, [] )

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

                    <form action="">

                        <div className="add-med-divs">
                            
                            <input type="text" placeholder='Select medicine' id="" />
                            <i className='bx  bx-chevron-down'  ></i> 
                            
                        </div>
                        <div className="add-med-divs">
                            
                            <input 
                            
                                type="text" 
                                placeholder='Disease in which the medicine is used for' 
                                
                            />
                            
                        </div>
                        <section>

                            <div className="add-med-divs"><input type="number" placeholder='Quantity' id="" /></div>
                            <div className="add-med-divs"><input type="date" placeholder='' id="" /></div>

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