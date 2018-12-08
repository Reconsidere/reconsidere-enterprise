const express = require('express'),
  path = require('path'),
  bodyParser = require('body-parser'),
  cors = require('cors'),
  mongoose = require('mongoose'),
  config = require('./config/DB'),
  signUpRoutes = require('./expressRoutes/signUpRoutes');

mongoose.Promise = global.Promise;
mongoose.connect(config.DB).then(
  () => { console.log('Database is connected') },
  err => { console.log('Can not connect to the database' + err) }
);

const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cors());
const port = process.env.PORT || 3000;
app.use('/signUp', signUpRoutes);

const server = app.listen(port, function () {
  console.log('Listening on port ' + port);
});
