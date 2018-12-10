var mongoose = require('mongoose');

mongoose.connect('mongodb://eowyn-reconsidere-enterprise/organization');

var OrganizationSchema = new mongoose.Schema({
  id: String,
  company: String,
  cnpj: String,
  tradingName: String,
  active: Boolean,
  class: String,
  phone: Number,
  creationDate: { type: Date, default: Date.now},
  activationDate: Date,
  verificationDate: Date,
  creditcard: {},
  supports: [{
    material: String,
    processing: String
  }],
  units: [{
    location: {
      country: String,
      state: String,
      latitude: Number,
      longitude: Number,
    },
  }],
  users: [{
    name: String,
    email: String,
    profiles: [{
      name: String,
      access: [String]
    }],
    password: String,
    active: Boolean
  }],
  vehicles: [{
    plate: String,
    capacity: {type: number, min: 0, max: 30000}
  }],
  calendars: [{
    name: String,
    startDate: Date,
    endDate: Date,
    geoRoute: {
      name: String,
      turns: [{startTime: Date, endTime: Date}],
    },
  }],
});

var organization = mongoose.model('Organization', OrganizationSchema);
