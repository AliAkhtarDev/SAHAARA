const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    name:{
        type:String,
        require:true,
    },
    phoneNumber:{
        type:Number,
        require:true,
    },
    address:{
        type:String,
        require:true,
    },
    emergencyType:{
        type:String,
        require:true,
    },
    additionalDetails:{
        type:String,
        require:true,
    },
    bookingConfimred:{
        driverName:{
            type:String,

        },
        driverPhone:{
            type:Number,
        },
        vehicleNumber:{
            type:String,
        },
        
        
    }
})

const Booking = mongoose.model("Booking",bookingSchema);
module.exports=Booking ;