import mongoose from "mongoose"

const userSchema = new mongoose.Schema(

    {

        userName : {

            type : 'String',
            required : true,
            unique : true

        },
        phoneNumber : {

            type : 'Number',
            required : true,
            unique : true,
            minlength : 10

        },
        email : {

            type : 'Email',
            required : true,
            unique : true

        },
        fullName : {

            type : 'String',
            required : true

        },
        password : {

            type : 'Object',
            required : true,
            minlength : 6

        },
        profilePicture : {

            type : 'String',
            default : ""

        }

    },
    { timestamps : true }

)

const UserModel = mongoose.models.User || mongoose.model("User", userSchema)
export default UserModel