mongoose = require('mongoose');
var OrganizationSchema = new mongoose.Schema({
  id: String,
  company: String,
  cnpj: String,
  tradingName: String,
  active: Boolean,
  class: String,
  phone: Number,
  email: String,
  password: String,
  classification: String,
  cellPhone: Number,
  creationDate: { type: Date, default: Date.now },
  activationDate: Date,
  verificationDate: Date,
  creditcard: {},
  supports: [
    {
      material: String,
      processing: String
    }
  ],
  units: [
    {
      location: {
        country: String,
        state: String,
        latitude: Number,
        longitude: Number,
        cep: String,
        publicPlace: String,
        neighborhood: String,
        number: Number,
        county: String,
        complement: String
      }
    }
  ],
  users: [
    {
      name: String,
      email: String,
      profiles: [
        {
          name: String,
          access: [String]
        }
      ],
      password: String,
      active: Boolean
    }
  ],
  vehicles: [
    {
      carPlate: String,
      emptyVehicleWeight: Number,
      weightCapacity: Number,
      active: Boolean,
      fuel: Number,
      typeFuel: String,
    }
  ],
  calendars: [
    {
      name: String,
      startDate: Date,
      endDate: Date,
      geoRoute: {
        name: String,
        turns: [{ startTime: Date, endTime: Date }]
      }
    }
  ]
});

var organizationModel = mongoose.model('Organization', OrganizationSchema);

const express = require('express');
(path = require('path')),
  (bodyParser = require('body-parser')),
  (cors = require('cors'));
var organizations = express.Router();
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

const URL = 'mongodb://eowyn-reconsidere-enterprise:27017/organization';
const TestURL = 'mongodb://localhost:27017/eowyn-reconsidere-enterprise';
const options = {
  autoIndex: false, // Don't build indexes
  reconnectTries: 30, // Retry up to 30 times
  reconnectInterval: 500, // Reconnect every 500ms
  poolSize: 10, // Maintain up to 10 socket connections
  // If not connected, return errors immediately rather than waiting for reconnect
  bufferMaxEntries: 0
};

mongoose
  .connect(
    TestURL,
    options
  )
  .catch(err => {
    console.error('Erro ao conectar no banco: ' + err.stack);
  });

organizations.route('/add').post(function(req, res) {
  var organization = new organizationModel(req.body);
  organization
    .save()
    .then(item => {
      res.status(200).json({ Organizations: 'added successfully' });
    })
    .catch(err => {
      res.status(400).send('unable to save to database' + err.stack);
    });
});

//Defined get data(index or listing) route
organizations.route('/').get(function (req, res) {
  organizationModel.find(function (err, org){
   if(err){
     console.log(err);
   }
   else {
     res.json(org);
   }
 });
});

// // Defined edit route
// signUpRoutes.route('/edit/:id').get(function (req, res) {
//  var id = req.params.id;
//  SignUp.findById(id, function (err, signUp){
//      res.json(signUp);
//  });
// });

// //  Defined update route
// signUpRoutes.route('/update/:id').post(function (req, res) {
//   SignUp.findById(req.params.id, function(err, signUp) {
//    if (!signUp)
//      return next(new Error('Could not load Document'));
//    else {
//      signUp.email = req.body.email;
//      signUp.password = req.body.password;
//      signUp.cnpj = req.body.cnpj;
//      signUp.fantasyName = req.body.fantasyName;
//      signUp.classification = req.body.classification;
//      signUp.cep = req.body.cep;
//      signUp.publicPlace = req.body.publicPlace;
//      signUp.neighborhood = req.body.neighborhood;
//      signUp.number = req.body.number;
//      signUp.county = req.body.county;
//      signUp.complement = req.body.complement;
//      signUp.phone = req.body.phone;
//      signUp.cellPhone = req.body.cellPhone;

//      signUp.save().then(coin => {
//          res.json('Update complete');
//      })
//      .catch(err => {
//            res.status(400).send("unable to update the database");
//      });
//    }
//  });
// });

// // Defined delete | remove | destroy route
// signUpRoutes.route('/delete/:id').get(function (req, res) {
//   SignUp.findByIdAndRemove({_id: req.params.id}, function(err, signUp){
//        if(err) res.json(err);
//        else res.json('Successfully removed');
//    });
// });

app.use('/organization', organizations);
module.exports = app;
