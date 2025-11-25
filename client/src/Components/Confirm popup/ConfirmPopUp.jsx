import React from 'react'
import './ConfirmPopUp.css'

function ConfirmPopUp({ description, execution, params, final }) {

    // description -> It contains what should be displayed on the box
    // execution -> It is the function which should be executed on confirming
    // params -> It contains the parametes for execution function
    // final -> It is function which should execute after whole the pop up operation
    //          like closing the pop up which ever the option chooses

    const confirm = () => {

        execution( params )
        final( false )
            
    }
    const cancel = () => final( false )

    return (

        <section id='confirm-popup-root'>
            
            <div id="pop-up">

                <p id='pop-desc'>{ description }</p>
                <div>

                    <button onClick={ confirm } >Confirm</button>
                    <button onClick={ cancel } >Cancel</button>

                </div>

            </div>

        </section>

    )

}

export default ConfirmPopUp