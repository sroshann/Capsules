import mongoose from "mongoose"

const userSchema = new mongoose.Schema(

    {

        userName : { type : String, required : true, unique : true },
        phoneNumber : { type : Object, required : true, unique : true, minlength : 10 },
        email : { type : String, required : true, unique : true },
        fullName : { type : String, required : true },
        password : { type : String, required : true, minlength : 6 },
        profilePicture : { type : String, default : "" },
        memberOf : { type : Number, default : 0 }

    },
    { timestamps : true }

)

const UserModel = mongoose.models.User || mongoose.model("User", userSchema)
export default UserModel