var mongoose = require('mongoose');

var Contacts = new mongoose.Schema({
    number: {
    type: Number,
    unique: true,
    required: true,
    trim: true
  },
  email:{
    type:String,
    required:true,
    trim:true
  },
  name:{
    type:String,
    required:true,
    trim:true
  } 
});
var Contacts = mongoose.model('Contacts', Contacts);
module.exports = Contacts;