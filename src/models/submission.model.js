import mongoose from "mongoose";
const submissionSchema=new mongoose.Schema({
    user_id:{
        type:String,
        required:true
    },
    problem_id:{
        type:Number,
    },
    code:{
        type:String,
    },
    status:{
        type:String,
    }
}, {timestamps:true});
export const Submission=mongoose.model("Submission", submissionSchema);