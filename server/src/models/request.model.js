import mongoose from "mongoose";

const requestSchema = new mongoose.Schema(

    {

        requester: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
        homeId: { type: mongoose.Schema.Types.ObjectId, required: true },
        homeAdmin: { type: mongoose.Schema.Types.ObjectId, required: true },
        status: { type: String, default: "p" }

        // p -> pending
        // a -> accepted
        // r -> rejected

    },
    { timestamps: true }

)

const RequestModel = mongoose.models.Request || mongoose.model('Request', requestSchema)
export default RequestModel