const passport = require('passport');
const LocalStrategy = require('passport-local');
const bcrypt = require('bcryptjs');

const User = require('../models/User');

passport.serializeUser(function(user,done){
    done(null,user.id);
});

passport.deserializeUser(function(id,done){
    User.findById(id,function(err,user){
        
        done(err,user);
    });
});


//For signup validation
passport.use('local.signup',new LocalStrategy({
    usernameField:'email',
    passwordField:'password',
    passReqToCallback:true


},(req,email,password,done) => {
    let errors = [];

    if(req.body.password !==req.body.password2){
        errors.push('Passwords do not match');
        return done(null,false,req.flash('error',errors));
    }

    User.findOne({email:email}).then(user => {
        if(user){
            errors.push('User with this email already exists');
            return done(null,false,req.flash('error',errors));
        }

        const newUser = new User({
            name:req.body.name,
            email:req.body.email,
            password:req.body.password
        });

        

        //Hash Password
        bcrypt.genSalt(10,(err,salt)=>{
            bcrypt.hash(newUser.password,salt,(err,hash)=>{
                if(err) throw err;

                newUser.password=hash;
                newUser.save((err)=>{
                    if(err) throw err;
                    return done(null,newUser);
                })
            })
        })
    })

}));


//For login validation
passport.use('local.login',new LocalStrategy({
    usernameField:'email',
    passwordField:'password',
    passReqToCallback:true


},(req,email,password,done) => {
    let errors = [];

   
    User.findOne({email:email}).then(user => {
        if(!user){
            errors.push('User with this email doesnot exists');
            return done(null,false,req.flash('error',errors));
        }

        bcrypt.compare(password,user.password,(err,isMatch)=>{
            if(err) throw err;
            if(isMatch){
                return done(null,user);
            }else{
                errors.push('password is incorrect');
                return(null,false,req.flash('error',errors));
            }
        });

       

     
    });

}));