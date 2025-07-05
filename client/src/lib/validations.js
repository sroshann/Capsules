import toast from 'react-hot-toast'
import { toastStyle } from '../constants/common.constant'

const validateEmail = (email) => {

    let error
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) error = 'Email cannot be empty'
    else if (!emailRegex.test(email) || email.split(" ").join("") != email)
        error = 'Invalid mail'
    return error

}

const validatePhoneNumber = (phoneNumber) => {

    let { number } = phoneNumber
    number = number.toString()
    let error
    if (!number) error = 'Phone number cannot be empty'
    else if (number.length !== 10) error = 'Invalid phone number'
    return error

}

const validatePassword = (parameters, isConfirm = false) => {

    const { password, confirmPassword } = parameters
    let error = {}

    // Password
    if (!password) error.passwordError = 'Password cannot be empty'
    else if (password.split(" ").join("") !== password) error.passwordError = 'Password includes spaces'
    else if (password.length < 6) error.passwordError = 'Password needs atleast 6 characters'

    if (isConfirm) {

        // Confirm password
        if (!confirmPassword) error.confirmError = 'Password cannot be empty'
        else if (confirmPassword.split(" ").join("") !== confirmPassword) error.confirmError = 'Password includes spaces'
        else if (confirmPassword.length < 6) error.confirmError = 'Password needs atleast 6 characters'

        if (password != confirmPassword) error.missmatch = 'Password missmatches'

    }

    return Object.keys(error).length ? error : null

}

export const validateSignup = values => {

    let error = {}
    const { userName, phoneNumber, email, fullName, password, confirmPassword } = values

    // Full name
    if (!fullName) error.fullName = 'Full name cannot be empty'
    else if (/\d/.test(fullName)) error.fullName = 'Full contains a number'

    // User name
    if (!userName) error.userName = 'Username cannot be empty'
    else if (userName.split(" ").join("") != userName) error.userName = 'User name should not contain spaces'
    else if (userName.length <= 3) error.userName = 'Create a longer username'

    // Email
    let emailError = validateEmail(email)
    if (emailError) error.email = emailError

    // Phone number
    let phoneNumberError = validatePhoneNumber(phoneNumber)
    if (phoneNumberError) error.phoneNumber = phoneNumberError

    // Password
    let checkingPasswords = validatePassword({ password, confirmPassword }, true)
    if (checkingPasswords) {

        const { passwordError, confirmError, missmatch } = checkingPasswords
        if (passwordError) error.password = passwordError
        else if (confirmError) error.confirmPassword = confirmError
        else if (missmatch) error.missmatch = missmatch

    }

    return Object.keys(error).length ? toast.error(Object.values(error)[0], { style: toastStyle }) : null

}

export const validateLogin = values => {

    let error = {}
    const { email, password } = values

    let emailError = validateEmail(email)
    if (emailError) error.email = emailError

    let checkPassword = validatePassword({ password }, false)
    if (checkPassword) {

        const { passwordError } = checkPassword
        if (passwordError) error.password = passwordError

    }

    return Object.keys(error).length ? toast.error(Object.values(error)[0], { style: toastStyle }) : null

}

export const validateForgot = {

    validateForgotEmail: ({ email }) => {

        const emailError = validateEmail(email)
        if( emailError ) return toast.error( emailError, { style : toastStyle } )

    },
    validateForgotChange: (data) => {

        const error = validatePassword(data, true)
        if( error ) {

            let message = {}
            const { passwordError, confirmError, missmatch } = error
            if (passwordError) message.password = passwordError
            else if (confirmError) message.confirmPassword = confirmError
            else if (missmatch) message.missmatch = missmatch
            return Object.keys(message).length ? toast.error(Object.values(message)[0], { style: toastStyle }) : null

        } 

    }

}