const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');
//Inicializaciones
const app = express();
const db = require('./database');

//Configuraciones 
app.set('port', process.env.PORT || 3000);
app.set('views',path.join(__dirname,'views'));
app.engine('.hbs', exphbs({
    defaultLayout: 'main',
    layoutDir: path.join(app.get('views'),'layouts'),
    partialDir: path.join(app.get('views'),'partials'),
    extname: '.hbs'
}));

app.set('view engine','.hbs');

//Funciones 

app.use(express.urlencoded({extended:true}));

app.use(methodOverride('_method'));
app.use(session({
    secret:'mysecretapp',
    resave: true,
    saveUninitialized: true
}));
app.use(flash())
//Variables globales
app.use((req,res,next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    next();
});
//Rutas

app.use(require('./routes/index'));
app.use(require('./routes/users'));
app.use(require('./routes/notes'));

//Archivos estaticos

app.use(express.static(path.join(__dirname,'public')));

//El servidor esta escuchando
app.listen(app.get('port'), () => {
    console.log('servidor en puerto:',app.get('port'));
});