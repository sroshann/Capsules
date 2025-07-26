// Convert the Mongo DB date string to 'Month Date, Year' format
export const changeDateFormat = ( dateString ) => {

    const date = new Date( dateString )
    const options = { 
        
        year : 'numeric',
        month : 'long',
        day : 'numeric'
    
    }

    return date.toLocaleDateString( 'en-US', options )

}