
var express = require('express');
var app = express();
var signUpRoutes = express.Router();

// Require Item model in our routes module
var SignUp = require('../src/models/signUp');

// Defined store route
signUpRoutes.route('/add').post(function (req, res) {
  var signUp = new SignUp(req.body);
   signUp.save()
    .then(item => {
    res.status(200).json({'signUp': 'Sign-up added successfully'});
    })
    .catch(err => {
    res.status(400).send("unable to save to database");
    });
});

// Defined get data(index or listing) route
signUpRoutes.route('/').get(function (req, res) {
   SignUp.find(function (err, signUps){
    if(err){
      console.log(err);
    }
    else {
      res.json(signUps);
    }
  });
});

// Defined edit route
signUpRoutes.route('/edit/:id').get(function (req, res) {
  var id = req.params.id;
  SignUp.findById(id, function (err, signUp){
      res.json(signUp);
  });
});

//  Defined update route
signUpRoutes.route('/update/:id').post(function (req, res) {
   SignUp.findById(req.params.id, function(err, signUp) {
    if (!signUp)
      return next(new Error('Could not load Document'));
    else {
      signUp.email = req.body.email;
      signUp.password = req.body.password;
      signUp.cnpj = req.body.cnpj;
      signUp.fantasyName = req.body.fantasyName;
      signUp.classification = req.body.classification;
      signUp.cep = req.body.cep;
      signUp.publicPlace = req.body.publicPlace;
      signUp.neighborhood = req.body.neighborhood;
      signUp.number = req.body.number;
      signUp.county = req.body.county;
      signUp.complement = req.body.complement;
      signUp.phone = req.body.phone;
      signUp.cellPhone = req.body.cellPhone;

      signUp.save().then(coin => {
          res.json('Update complete');
      })
      .catch(err => {
            res.status(400).send("unable to update the database");
      });
    }
  });
});

// Defined delete | remove | destroy route
signUpRoutes.route('/delete/:id').get(function (req, res) {
   SignUp.findByIdAndRemove({_id: req.params.id}, function(err, signUp){
        if(err) res.json(err);
        else res.json('Successfully removed');
    });
});

module.exports = signUpRoutes;
