const mongoose=require("mongoose");

mongoose.connect("mongodb://localhost:27017/bankDB",{
    useNewUrlParser:true,
    useUnifiedTopology:true
})

const customerSchema=new mongoose.Schema({
    accountNumber:{
        type:Number,
        required:true,
        unique:true
    },
    customerName:{
        type:String,
        required:true

    },
    emailId:{
        type:String,
        required:true

    }
    ,
    currentBalance:{
        type:Number,
    required:true
    }
})

module.exports=mongoose.model("Customer",customerSchema)