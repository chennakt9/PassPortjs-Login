const express = require('express');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const bodyParser = require('body-parser');
const expressLayouts = require('express-ejs-layouts');
const app = express();

//Requiring passport file
require('./config/passport');

//Connecting to mongoose
mongoose.connect('mongodb://localhost:27017/passport-login',{useNewUrlParser: true });

let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("mongoose connected");
});

//MiddleWares
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.set('view engine','ejs');
app.use(session({
    secret:'chenna',
    resave:true,
    saveUninitialized:true
}));
app.use(expressLayouts);

//Serving static files
app.use(express.static('public'));

//Initialize passport
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

//Routes Setup
app.use('/',require('./routes/index'));
app.use('/users',require('./routes/users'));

const port = 3200 || process.env.PORT;
app.listen(port,()=>{
    console.log("Im am listening to you on the port 3200");
});
