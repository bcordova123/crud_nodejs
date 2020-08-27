const express = require('express');
const router = express.Router();
const User = require('../models/Users');
const passport = require('passport');
//para ingresar a la app
router.get('/users/singin', function(req, res){
    res.render('users/singin');
});

router.post('/users/singin', passport.authenticate('local', {
    successRedirect: '/notes',
    failureRedirect: '/users/singin',
    failureFlash: true
}));

router.get('/users/singup', function(req,res){
    res.render('users/singup');
});

router.post('/users/singup', async (req,res) => {
//console.log(req.body);
const {name, email, password, confirm_password} = req.body;
const errors = [];

if (name.length <= 0) {
    errors.push({text: 'ingrese un nombre'});
}
if (email.length <= 0) {
    errors.push({text: 'ingrese un correo'});
}
if (password.length <= 0) {
    errors.push({text: 'ingrese una contraseña'});
}
if (confirm_password.length <= 0) {
    errors.push({text: 'ingrese la confirmacion de su contraseña'});
}
if (password != confirm_password) {
    errors.push({text: 'Las contraseñas no coinciden'});
}
if (password.length < 4) {
     errors.push({text: 'La contraseña debe contener al menos 4 digitos'});
}
if (errors.length > 0) {
    res.render('users/singup', {errors, name, email, password, confirm_password});
}else{
    const emailUser = await User.findOne({email: email});
    if (emailUser) {
        req.flash('error_msg','El correo existe');
        res.redirect('/users/singup');
    }else{
        const newUser = new User({name, email, password});
        newUser.password = await newUser.encryptPassword(password);
        await newUser.save();
        req.flash('success_msg','Registro exitoso!');
        res.redirect('/users/singin');
    }
}
});

router.get('/users/logout', (req, res) => {
    req.logOut();
    res.redirect('/');
});

module.exports = router;