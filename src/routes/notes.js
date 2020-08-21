const express = require('express');
const router = express.Router();

// .. se usa para subir un nivel en las carpetas

const Note = require('../models/Note');

router.get('/notes/add', (req,res)=> {
    res.render('notes/new-notes');
});

router.post('/notes/new-notes', async (req,res) => {
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
        await newNote.save();
        req.flash('success_msg', 'Nota agregada exitosamente!');
        res.redirect('/notes');
    }
});
router.get('/notes', async (req, res) => {
    //res.send('Notas desde la bd');
    //se usa lean para mandar un objeto json, en vez de un objeto mongose
    const notes = await Note.find().lean().sort({date: 'desc'});
    //console.log(notes);
    res.render('notes/all-notes',{notes});
});
router.get('/notes/edit/:id', async (req,res) => {
    const note = await Note.findById(req.params.id).lean();

    res.render('notes/edit-note',{note});
});
router.put('/notes/edit-note/:id', async (req, res) => {
    const {title, description} = req.body;
    await Note.findByIdAndUpdate(req.params.id,{title, description});
    req.flash('success_msg','Nota actualizada exitosamente!');
    res.redirect('/notes');
});
router.delete('/notes/delete/:id', async(req, res) => {
    await Note.findByIdAndDelete(req.params.id);
    req.flash('success_msg','Nota eliminada exitosamente!');

    res.redirect('/notes');
});

module.exports = router;