import React, { useEffect, useRef, useState } from 'react'
import './OTP.css'

const OTP_size = 6

function OTP() {

    const [ otpValue, setOtpValue ] = useState( [] )
    const [ finalValue, setFinalValue ] = useState( 0 )

    useEffect( () => { refArray.current[0]?.focus() }, [] )

    const refArray = useRef([]) // Reference array for each input
    
    // Handling inputting values
    const handleInputClick = ( value, index ) => {

        const newArray = [ ...otpValue ]
        newArray[ index ] = Number( value )
        setOtpValue( newArray )
        setFinalValue( newArray.reduce( ( accumulator, current ) => accumulator * 10 + current, 0 ) )
        value && refArray.current[ index + 1 ]?.focus()

    }

    // Handling back space
    const handleKeyDown = ( event, index ) => {

        if( !event.target.value && event.keyCode === 8 ) {

            refArray.current[ index - 1 ]?.focus()

        }

    }

    return (

        <form action="">

            <div className="input-fields" id='entering-OTP'>

                {

                    new Array( OTP_size ).fill('').map( ( object, index ) => (

                        <div className='OTP' key={ index }><input

                            type="number" placeholder='_'
                            ref={ input => refArray.current[ index ] = input }
                            value={ otpValue[ index ] || '' }
                            onChange={ ( event ) => handleInputClick( event.target.value, index ) }
                            onKeyDown={ event => handleKeyDown( event, index ) }

                        /></div>

                    ) )

                }

            </div>
            <div className="form-buttons"><button type='submit'>Submit OTP</button></div>

        </form>

    )

}

export default OTP