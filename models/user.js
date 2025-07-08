// Core Modules
const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  firstName: {type: String, required: [true, 'First name is required  ']},
  lastName: String,
  email: {type: String, required: [true, 'Email is required'], unique: true},
  password: {type: String, required: [true, 'Password is required']},
  userType: {type: String, enum: ['guest', 'host'], default: 'guest'},
  favourite: [{type: mongoose.Schema.Types.ObjectId, ref: 'Homes'}],  // This links to the _id in the 'Home' collection}
  booking: [{type: mongoose.Schema.Types.ObjectId, ref: 'Homes'}]  // This links to the _id in the 'Home' collection}
})

module.exports = mongoose.model('User', userSchema);