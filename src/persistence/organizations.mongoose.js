mongoose = require('mongoose');
//enviroment = require('../environments/environment.prod');
var OrganizationSchema = new mongoose.Schema({
  company: String,
  cnpj: String,
  tradingName: String,
  active: Boolean,
  class: String,
  phone: Number,
  email: String,
  classification: String,
  cellPhone: Number,
  creationDate: { type: Date, default: Date.now },
  activationDate: Date,
  verificationDate: Date,
  creditcard: {},
  supports: [
    {
      solid: {
        materials: {
          paper: {
            name: String,
            used: Boolean,
          },
          plastic: {
            name: String,
            used: Boolean
          },
          glass: {
            name: String,
            used: Boolean
          },
          metal: {
            name: String,
            used: Boolean
          },
          isopor: {
            name: String,
            used: Boolean
          },
          tetrapack: {
            name: String,
            used: Boolean
          }
        },
        semiSolid: {},
        liquid: {}
      },
    }
  ],
  units: [
    {
      name: String,
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
      profile: {
        name: String,
        access: [String]
      },
      password: String,
      active: Boolean
    }
  ],
  processingChain: [
    {
      name: String,
      description: String,
      hierarchy: [{}]
    }
  ],
  hierarchy: {
    solid: {
      materials: {
        paper: {
          name: String,
          used: Boolean,
          items: [{
            name: String, active: Boolean,
            princing: {
              price: [Number],
              date: [Date],
              weight: Number,
            },

          }]
        },
        plastic: {
          name: String,
          used: Boolean,
          items: [{ name: String, active: Boolean }]
        },
        glass: {
          name: String,
          used: Boolean,
          items: [{ name: String, active: Boolean }]
        },
        metal: {
          name: String,
          used: Boolean,
          items: [{ name: String, active: Boolean }]
        },
        isopor: {
          name: String,
          used: Boolean,
          items: [{ name: String, active: Boolean }]
        },
        tetrapack: {
          name: String,
          used: Boolean,
          items: [{ name: String, active: Boolean }]
        }
      },
      semisolid: {},
      liquid: {}
    }
  },
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
      archived: Boolean,
      status: String,
      schedules: [
        {
          date: Date,
          startTime: Date,
          endTime: Date,
          situation: String,
          archived: Boolean,
          vehicle: {
            carPlate: String,
            emptyVehicleWeight: Number,
            weightCapacity: Number,
            active: Boolean,
            fuel: Number,
            typeFuel: String
          }
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

const TestURL = `mongodb://localhost:27017/eowyn-reconsidere-enterprise`;
//const TestURL = 'mongodb://reconsidere-enterprise:by4yY5A4@ec2-18-216-31-156.us-east-2.compute.amazonaws.com:27017/reconsideredb'
const options = {
  autoIndex: false,
  reconnectTries: 30,
  reconnectInterval: 500,
  poolSize: 10,
  bufferMaxEntries: 0
};

mongoose.connect(TestURL, options).catch(err => {
  console.error('Erro ao conectar no banco: ' + err.stack);
});

organizations.route('/add').post(function (req, res) {
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
// organizations.route('/').get(function(req, res) {
//   organizationModel.find(function(err, org) {
//     if (err) {
//       console.log(err);
//     } else {
//       res.json(org);
//     }
//   });
// });

/**Return organization id only.  This parameter id, are the id of user*/
organizations.route('/organizationid/:id').get(function (req, res) {
  organizationModel.findOne({ 'users._id': req.params.id }, function (err, org) {
    if (!org) return next(new Error('Not found organization'));
    else {
      res.json(org._id);
    }
  });
});

/**Return organization object */
organizations.route('/:id').get(function (req, res) {
  organizationModel.find(function (err, org) {
    if (err) {
      console.log(err);
    } else {
      res.json(org);
    }
  });
});

// // Defined edit route
organizations.route('/edit/:id').get(function (req, res) {
  var id = req.params.id;
  organizationModel.findById(id, function (err, organization) {
    res.json(organization);
  });
});

// //  Defined update route
organizations.route('/update/:id').put(function (req, res, next) {
  organizationModel.findById(req.params.id, function (err, org) {
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
      org.units = req.body.units;
      org.vehicles = req.body.vehicles;
      org.georoutes = req.body.georoutes;
      org.users = req.body.users;
      org.hierarchy = req.body.hierarchy;

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

organizations.route('/:id/user').get(function (req, res) {
  organizationModel.findById(req.params.id, function (err, org) {
    if (err) {
      console.log(err);
    } else {
      res.json(org.users);
    }
  });
});

organizations.route('/user/authenticate').post(function (req, res, next) {
  organizationModel.findOne(
    { 'users.email': req.body.email },
    { 'users.$': 1 },
    function (err, org) {
      if (!org) return next(new Error('Login error.'));
      else {
        res.json(org.users[0]);
      }
    }
  );
});

organizations.route('/add/user/:id').post(function (req, res, next) {
  organizationModel.findOne(
    { _id: req.params.id, 'users.email': req.body.email },
    function (err, obj) {
      if (obj) {
        return res.status(400).send('Email already in use.');
      } else {
        organizationModel.findById(req.params.id, function (err, org) {
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

organizations.route('/update/user/:id').post(function (req, res, next) {
  organizationModel.findById(req.params.id, function (err, org) {
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
organizations.route('/vehicle/:id').get(function (req, res) {
  organizationModel.findById(req.params.id, function (err, org) {
    if (err) {
      console.log(err);
    } else {
      res.json(org.vehicles);
    }
  });
});

organizations.route('/add/vehicle/:id').post(function (req, res, next) {
  organizationModel.findById(req.params.id, function (err, org) {
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

organizations.route('/update/vehicle/:id').put(function (req, res, next) {
  organizationModel.findById(req.params.id, function (err, org) {
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

organizations
  .route('/remove/vehicle/:organizationId/:id')
  .delete(function (req, res) {
    organizationModel.findById(req.params.organizationId, function (err, org) {
      if (!org) return next(new Error('Could not load Document'));
      else {
        var vehicle = org.vehicles.id(req.params.id);
        if (vehicle) {
          vehicle.remove({ _id: req.params.id });
          org
            .update(org)
            .then(org => {
              res.json('remove complete');
            })
            .catch(err => {
              res.status(400).send('unable to delete schedule the database');
            });
        }
      }
    });
  });

//#endregion

//#region CRUD  - Scheduler

organizations.route('/scheduler/:id').get(function (req, res) {
  organizationModel.findById(req.params.id, function (err, org) {
    if (err) {
      console.log(err);
    } else {
      res.json(org.georoutes);
    }
  });
});

organizations.route('/add/scheduler/:id').post(function (req, res, next) {
  organizationModel.findById(req.params.id, function (err, org) {
    if (!org) return next(new Error('Could not load Document'));
    else {
      org.georoutes = req.body;
      org
        .save(org)
        .then(org => {
          res.json('Update complete');
        })
        .catch(err => {
          res.status(400).send('unable to update the database');
        });
    }
  });
});

organizations.route('/update/scheduler/:id').put(function (req, res, next) {
  organizationModel.findById(req.params.id, function (err, org) {
    if (!org) return next(new Error('Could not load Document'));
    else {
      var route = org.georoutes.id(req.body._id);
      if (!route) {
        org.georoutes = req.body;
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

organizations
  .route('/remove/scheduler/:organizationId/:id')
  .delete(function (req, res) {
    organizationModel.findById(req.params.organizationId, function (err, org) {
      if (!org) return next(new Error('Could not load Document'));
      else {
        var route = org.georoutes.id(req.params.id);
        if (route) {
          route.remove({ _id: req.params.id });
          org
            .update(org)
            .then(org => {
              res.json('remove complete');
            })
            .catch(err => {
              res.status(400).send('unable to delete schedule the database');
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


//#region CRUD - Material
organizations.route('/hierarchy/:id').get(function (req, res) {
  organizationModel.findById(req.params.id, function (err, org) {
    if (err) {
      console.log(err);
    } else {
      res.json(org.hierarchy);
    }
  });
});

organizations.route('/add/hierarchy/:id').post(function (req, res, next) {
  organizationModel.findById(req.params.id, function (err, org) {
    if (!org) return next(new Error('Could not load Document'));
    else {
      org.hierarchy = req.body;
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
//#endregion


//#region CRUD - pricing
organizations.route('/pricing/:id').get(function (req, res) {
  organizationModel.findById(req.params.id, function (err, org) {
    if (err) {
      console.log(err);
    } else {
      res.json(org.hierarchy);
    }
  });
});

//#endregion

app.use('/organization', organizations);
module.exports = app;
