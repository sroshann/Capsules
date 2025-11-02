import mongoose from "mongoose"

const addedMedScehema = new mongoose.Schema(

    {

        homeId : { type : mongoose.Schema.Types.ObjectId, ref : 'Home', required : true },
        medicine : { type : String, required : true },
        disease : { type : String, required : true },
        quantity : { type : Number, required : true },
        expiryDate : { type : String, required : true }

    }

)

const AddedMedModel = mongoose.models.AddedMedicine || mongoose.model('AddedMedicine', addedMedScehema)
export default AddedMedModel