const express = require('express');
const router = express.Router();
const {isAuthenticated} = require('../helpers/auth');
// .. se usa para subir un nivel en las carpetas

const Note = require('../models/Note');

router.get('/notes/add', isAuthenticated,(req,res)=> {
    res.render('notes/new-notes');
});

router.post('/notes/new-notes', isAuthenticated,async (req,res) => {
    const {title, description} = req.body;
    const errors = [];
    if (!title) {
        errors.push({text: 'Por favor ingresa un titulo'});
    }
    if (!description) {
        errors.push({text: 'Por favor ingresa una descripción'});
    }
    if (errors.length > 0) {
        res.render('notes/new-notes', {
            errors,
            title,
            description
        });
    }else{
        const newNote = new Note({title, description});
        newNote.user = req.user.id;
        await newNote.save();
        req.flash('success_msg', 'Nota agregada exitosamente!');
        res.redirect('/notes');
    }
});
router.get('/notes', isAuthenticated,async (req, res) => {
    //res.send('Notas desde la bd');
    //se usa lean para mandar un objeto json, en vez de un objeto mongose
    const notes = await Note.find({user: req.user.id}).lean().sort({date: 'desc'});
    //console.log(notes);
    res.render('notes/all-notes',{notes});
});
router.get('/notes/edit/:id', isAuthenticated,async (req,res) => {
    const note = await Note.findById(req.params.id).lean();

    res.render('notes/edit-note',{note});
});
router.put('/notes/edit-note/:id', isAuthenticated,async (req, res) => {
    const {title, description} = req.body;
    await Note.findByIdAndUpdate(req.params.id,{title, description});
    req.flash('success_msg','Nota actualizada exitosamente!');
    res.redirect('/notes');
});
router.delete('/notes/delete/:id', isAuthenticated,async(req, res) => {
    await Note.findByIdAndDelete(req.params.id);
    req.flash('success_msg','Nota eliminada exitosamente!');

    res.redirect('/notes');
});

module.exports = router;