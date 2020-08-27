//Authentication
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('../models/Users');

//done es un callback
//done(null, false, {message: 'Contraseña incorrecta.'})
//el primer espacio es para retornar un error, al devolver null no existen errores
//el segundo espacio es para retornar si existe un usuario, en este caso esta en false
//el message es para enviar un mensaje de vuelta 
//done(null, user);
//Null por que no existe un error y se devuelve el usuario si la pass hace match
passport.use(new LocalStrategy({
    usernameField: 'email'
}, async (email,password,done) =>{
    const user = await User.findOne({email:email});
    if (!user) {
        return done(null, false, {message: 'Usuario no encontrado.'});
    }else{
        const match = await user.matchPassword(password);
        if (match) {
            return done(null, user);
        }else{
            return done(null, false, {message: 'Contraseña incorrecta.'})
        }
    }
}));
//Almacenamos en sesion el id del usuario 
passport.serializeUser( (user,done) => {
    done(null, user.id);
});
//proceso inverso al anterior, toma un id y tiene un call back y genera un usuario para trabajar con sus datos
passport.deserializeUser( (id, done) => {
    //tomamos al id de la sesion, buscamos al usuario por el id, en la busqueda se pueden obtener 2 cosas
    //un error o puedo encontrar al usuario
    User.findById(id, (err,user) => {
        //entonces devolvemos con el callback los errores si existen y el usuario
        done(err, user);
    });
});