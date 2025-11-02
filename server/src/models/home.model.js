import mongoose from "mongoose";

const homeSchema = new mongoose.Schema(

    {

        nickName : { type : String, required : true },
        homeName : {

            type : String,
            required : true,
            minlength : 6,
            unique : true

        },
        accessedUsers : { type : Array },
        admin : { type : String, required : true },
        availableMedicines: [

            { type: mongoose.Schema.Types.ObjectId, ref: "AddedMedicine" }
            
        ],
        country : { type : String, required : true },
        state : { type : String, required : true },
        district : { type : String, required : true },
        pincode : { type : Number, required : true },
        description : { type : String },

    },
    { timestamps : true }

)

const HomeModel = mongoose.models.Home || mongoose.model("Home", homeSchema)
export default HomeModel