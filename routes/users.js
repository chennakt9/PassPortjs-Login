const express = require('express');
const passport = require('passport');
const router = express.Router();
const {check,validationResult} = require('express-validator/check');

//Register Get Route
router.get('/register',(req,res) => {
    res.render('register',{ messages : req.flash('error') });
});


//Register Post route with validation
router.post('/register',[
        check('name').not().isEmpty().withMessage('Name cannot be empty'),
        check('email').not().isEmpty().withMessage('Email Field cannot be empty'),
        check('email').isEmail().withMessage('Email is Invalid'),
        check('password').not().isEmpty().withMessage('Password field cannot be empty'),
        check('password').isLength({min:6}).withMessage('Password should be min 6 characters')
    ],(req,res,next) => {
    
        authValidationResult(req,res,next);
})

//Login get route
router.get('/login',(req,res) => {
    success_message = req.flash('success');
    res.render('login',{ success_messages : success_message, messages : req.flash('error')});
});

//Login post route
router.post('/login',(req,res,next) => {
    passport.authenticate('local.login',{
        successRedirect:'/dashboard',
        failureRedirect:'/users/login',
        failureFlash:true
    })(req,res,next);
});

//Logout Route
router.get('/logout',(req,res)=>{
    req.logout();
    req.flash('success','You are Logged out');
    res.redirect('/users/login');
})


//Express validation function
function authValidationResult(req,res,next){
    const errors = validationResult(req);

    if(errors.array().length > 0){
        const messages = [];
        errors.array().forEach((error) => {
            messages.push(error.msg);

        });

        req.flash('error',messages);
        res.redirect('/users/register');
    }else{
        passport.authenticate('local.signup',{
            successRedirect:'/users/login',
            failureRedirect:'/users/register',
            failureFlash:true
        })(req,res,next);

        req.flash('success','signup successful you  may now login');

        
    }
}


module.exports = router;
