import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
dotenv.config()

// Transporter
const transporter = nodemailer.createTransport({

    service : 'gmail',
    host : 'smtp.gmail.com',
    port : 465,
    secure : process.env.NODE_ENV === 'development' ? false : true,
    auth : {

        user : process.env.EMAIL,
        pass : process.env.PASSWORD

    }

})

// Mailing function
export const sendMailTo = ( emailTo, subject, description ) => {

    try {

        const mailOptions  = {

            from : {

                address : process.env.EMAIL,
                name : 'Capsules'

            },
            to : emailTo,
            subject : subject,
            text : description

        }

        transporter.sendMail( mailOptions )
        // console.log( response )

    } catch ( error ) { return 'Error occured while sending mail' }

}   