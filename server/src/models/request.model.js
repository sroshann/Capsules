import mongoose from "mongoose";

const requestSchema = new mongoose.Schema(

    {

        requesterId : { type : mongoose.Schema.Types.ObjectId, required : true },
        homeId : { type : mongoose.Schema.Types.ObjectId, required : true },
        homeAdmin : { type : mongoose.Schema.Types.ObjectId, required : true },
        status : { type : String, default : "p" }

        // p -> pending
        // a -> accepted
        // r -> rejected

    },
    { timestamps : true }

)

const RequestModel = mongoose.models.RequestModel || mongoose.models('Request', requestSchema)
export default RequestModel