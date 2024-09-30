const mongoose = require('mongoose');

// Define the Ambulance schema
const adminSchema = new mongoose.Schema({
  driverName: {
    type: String,
    required: [true, 'Driver name is required'],
  },
  driverPhone: {
    type: String,
    required: [true, 'Driver phone number is required'],
    match: [/^\d{10}$/, 'Please enter a valid 10-digit phone number'],
  },
  ambulanceNumber: {
    type: String,
   
    
  },
  vehicleType: {
    type: String,
    required: [true, 'Vehicle type is required'],
   
  },

 

  organisation:{
    type:String,
    required:true,
  },
  email:{
    type:String,
    require:true,
  },
  isAvailable: {
    type: Boolean,
    default: true, // Ambulance is available by default
  },
  
  password:{
    type:String,
    require:true,
  },
//   location: {
//     latitude: {
//       type: Number,
//       required: [true, 'Latitude is required'],
//     },
//     longitude: {
//       type: Number,
//       required: [true, 'Longitude is required'],
//     },
//   },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create the Ambulance model
const Admin = mongoose.model('Admin',adminSchema);

module.exports = Admin;
