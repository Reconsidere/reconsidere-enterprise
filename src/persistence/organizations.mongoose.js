mongoose = require('mongoose');
var OrganizationSchema = new mongoose.Schema({
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
      typeFuel: String
    }
  ],
  georoutes: [
    {
      name: String,
      schedules: [
        {
          startDate: Date,
          endDate: Date,
          turns: [{ startTime: Date, endTime: Date }]
        }
      ]
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
organizations.route('/').get(function(req, res) {
  organizationModel.find(function(err, org) {
    if (err) {
      console.log(err);
    } else {
      res.json(org);
    }
  });
});

// // Defined edit route
organizations.route('/edit/:id').get(function(req, res) {
  var id = req.params.id;
  organizationModel.findById(id, function(err, organization) {
    res.json(organization);
  });
});

// //  Defined update route
organizations.route('/update/:id').post(function(req, res, next) {
  organizationModel.findById(req.params.id, function(err, org) {
    if (!org) return next(new Error('Could not load Document'));
    else {
      org.email = req.body.email;
      org.company = req.body.company;
      org.tradingName = req.body.tradingName;
      org.password = req.body.password;
      org.cnpj = req.body.cnpj;
      org.phone = req.body.phone;
      org.cellPhone = req.body.cellPhone;
      org.classification = req.body.classification;
      org.location = req.body.location;
      org.vehicles = req.body.vehicles;
      org.georoutes = req.body.georoutes;
      org.users = req.body.users;

      org
        .save()
        .then(org => {
          res.json('Update complete');
        })
        .catch(err => {
          res.status(400).send('unable to update the database');
        });
    }
  });
});

//#region CRUD - User
organizations.route('/user/authenticate').post(function(req, res, next) {
  organizationModel.findOne(
    { 'users.email': req.body.email },
    { 'users.$': 1 },
    function(err, org) {
      if (!org) return next(new Error('Login error.'));
      else {
        res.json(org.users[0]);
      }
    }
  );
});

organizations.route('/add/user/:id').post(function(req, res, next) {
  organizationModel.findOne(
    { _id: req.params.id, 'users.email': req.body.email },
    function(err, obj) {
      if (obj) {
        return res.status(400).send('Email already in use.');
      } else {
        organizationModel.findById(req.params.id, function(err, org) {
          if (!org) return next(new Error('Could not load Document'));
          else {
            (req.body.password = req.body.password), 10;
            org.users.push(req.body);
            org
              .updateOne(org)
              .then(org => {
                res.json('save user complete');
              })
              .catch(err => {
                res.status(400).send('unable to save user');
              });
          }
        });
      }
    }
  );
});

organizations.route('/update/user/:id').post(function(req, res, next) {
  organizationModel.findById(req.params.id, function(err, org) {
    if (!org) return next(new Error('Could not load Document'));
    else {
      var user = org.users.id(req.body._id);
      if (!user) {
        org.users.push(req.body);
        org
          .update(org)
          .then(org => {
            res.json('Update complete');
          })
          .catch(err => {
            res.status(400).send('unable to update the database');
          });
      } else {
        user.set(req.body);
        org
          .update(org)
          .then(org => {
            res.json('Update complete');
          })
          .catch(err => {
            res.status(400).send('unable to update the database');
          });
      }
    }
  });
});

//#endregion

//#region CRUD  - Vehicle
organizations.route('/vehicle/:id').get(function(req, res) {
  organizationModel.findById(req.params.id, function(err, org) {
    if (err) {
      console.log(err);
    } else {
      res.json(org.vehicles);
    }
  });
});

organizations.route('/add/vehicle/:id').post(function(req, res, next) {
  organizationModel.findById(req.params.id, function(err, org) {
    if (!org) return next(new Error('Could not load Document'));
    else {
      org.vehicles.push(req.body);
      org
        .update(org)
        .then(org => {
          res.json('Update complete');
        })
        .catch(err => {
          res.status(400).send('unable to update the database');
        });
    }
  });
});

organizations.route('/update/vehicle/:id').post(function(req, res, next) {
  organizationModel.findById(req.params.id, function(err, org) {
    if (!org) return next(new Error('Could not load Document'));
    else {
      var vehicle = org.vehicles.id(req.body._id);
      if (!vehicle) {
        org.vehicles.push(req.body);
        org
          .update(org)
          .then(org => {
            res.json('Update complete');
          })
          .catch(err => {
            res.status(400).send('unable to update the database');
          });
      } else {
        vehicle.set(req.body);
        org
          .update(org)
          .then(org => {
            res.json('Update complete');
          })
          .catch(err => {
            res.status(400).send('unable to update the database');
          });
      }
    }
  });
});

//#endregion

//#region CRUD  - Scheduler

organizations.route('/scheduler/:id').get(function(req, res) {
  organizationModel.findById(req.params.id, function(err, org) {
    if (err) {
      console.log(err);
    } else {
      res.json(org.georoutes);
    }
  });
});

organizations.route('/add/scheduler/:id').post(function(req, res, next) {
  organizationModel.findById(req.params.id, function(err, org) {
    if (!org) return next(new Error('Could not load Document'));
    else {
      org.georoutes.push(req.body);
      org
        .update(org)
        .then(org => {
          res.json('Update complete');
        })
        .catch(err => {
          res.status(400).send('unable to update the database');
        });
    }
  });
});

organizations.route('/update/scheduler/:id').post(function(req, res, next) {
  organizationModel.findById(req.params.id, function(err, org) {
    if (!org) return next(new Error('Could not load Document'));
    else {
      var route = org.georoutes.id(req.body._id);
      if (!route) {
        org.georoutes.push(req.body);
        org
          .update(org)
          .then(org => {
            res.json('Update complete');
          })
          .catch(err => {
            res.status(400).send('unable to update the database');
          });
      } else {
        route.set(req.body);
        org
          .update(org)
          .then(org => {
            res.json('Update complete');
          })
          .catch(err => {
            res.status(400).send('unable to update the database');
          });
      }
    }
  });
});
//#endregion

// // Defined delete | remove | destroy route
// signUpRoutes.route('/delete/:id').get(function (req, res) {
//   SignUp.findByIdAndRemove({_id: req.params.id}, function(err, signUp){
//        if(err) res.json(err);
//        else res.json('Successfully removed');
//    });
// });

app.use('/organization', organizations);
module.exports = app;
