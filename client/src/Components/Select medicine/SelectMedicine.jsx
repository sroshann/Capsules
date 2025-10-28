import React from 'react'
import { motion } from 'framer-motion'
import './SelectMedicine.css'

function SelectMedicine({ maxHeight, width, medicines, formik }) {

    const provideData = ( med ) => formik.setValues({  ...formik.values, 'medicine' : med })
    
    return (

        <motion.div

            style={{ maxHeight, width, display : 'block' }}
            id='select-med-root'
            initial={{ y : -20, opacity : 0 }}
            animate={{ y : 0, opacity : 1 }}
            exit={{ y : -20, opacity : 0 }}
            transition={{ duration : 0.4 }}

        >

            {

                medicines?.map( ( med, index ) => (

                    <section key={ index } onClick={ () => provideData( med ) } >

                        <p>{ med }</p>
                        <svg  
                        
                            xmlns="http://www.w3.org/2000/svg" 
                            fill="currentColor" viewBox="0 0 24 24" >
                            <path d="M17 16V7H8v2h5.59l-6.3 6.29 1.42 1.42 6.29-6.3V16z"></path>

                        </svg>

                    </section>

                ) )

            }

        </motion.div>

    )

}

export default SelectMedicine