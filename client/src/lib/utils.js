// Convert the Mongo DB date string to 'Month Date, Year' format
export const changeDateFormat = ( dateString, isString = false ) => {

    const date = new Date( dateString )
    const options = { 
        
        year : 'numeric',
        month : isString ? 'long' : 'numeric',
        day : 'numeric'
    
    }

    return date.toLocaleDateString(  isString ? 'en-Us' : 'en-GB' , options )

}