const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');

const users = require('./routes/api/users');
const profile = require('./routes/api/profile');
const posts = require('./routes/api/posts');

const app = express();

// Body parser middleware
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// DB config
const db = require('./config/keys').mongoURI;

// connect to MongoDB
mongoose
  .connect(db, { useNewUrlParser: true } )
  .then( () => console.log("MongoDB Coonected.") )
  .catch( err => console.log(err) );

// Passport middleware
app.use(passport.initialize());

// Passport Config
require('./config/passport.js')(passport);

app.use('/api/users', users);
app.use('/api/profile', profile);
app.use('/api/posts', posts);

// use PORT variable from HEROKU env if available
const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server is running on port ${port}`));