var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Define collection and schema for Items
var signUpSchema= new Schema({
  email: {
    type: String
  },
  password: {
    type: String
  },
  cnpj: {
    type: String
  },
  fantasyName: {
    type: String
  },
  classification: {
    type: String
  },
  cep: {
    type: String
  },
  publicPlace: {
    type: String
  },
  neighborhood: {
    type: String
  },
  number: {
    type: Number
  },
  county: {
    type: String
  },
  state: {
    type: String
  },
  complement: {
    type: String
  },
  phone: {
    type: String
  },
  cellPhone: {
    type: String
  }
},{
    collection: 'signUps'
});

module.exports = mongoose.model('signUp', signUpSchema);