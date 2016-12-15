var express = require('express');
var router = express.Router();
var skill_dal = require('../model/skill_dal');
var resume_dal = require('../model/resume_dal');


// View All skills
router.get('/all', function(req, res) {
    skill_dal.getAll(function(err, result){
        if(err) {
            res.send(err);
        }
        else {
            res.render('skill/skillViewAll', { 'result':result });
        }
    });

});

// View the skill for the given id
router.get('/', function(req, res){
    if(req.query.skill_id == null) {
        res.send('skill_id is null');
    }
    else {
        skill_dal.getById(req.query.skill_id, function(err,result) {
           if (err) {
               res.send(err);
           }
           else {
               res.render('skill/skillViewById', {'result': result});
           }
        });
    }
});

// Return the add a new skill form
router.get('/add', function(req, res){
    // passing all the query parameters (req.query) to the insert function instead of each individually
    resume_dal.getAll(function(err,result) {
        if (err) {
            res.send(err);
        }
        else {
            res.render('skill/skillAdd', {'resume': result});
        }
    });
});

// View the skill for the given id
router.get('/insert', function(req, res){
    // simple validation
    if(req.query.skill_name == null) {
        res.send('skill Name must be provided.');
    }
    else if(req.query.resume_id == null) {
        res.send('At least one resume must be selected');
    }
    else {
        // passing all the query parameters (req.query) to the insert function instead of each individually
        skill_dal.insert(req.query, function(err,result) {
            if (err) {
                console.log(err)
                res.send(err);
            }
            else {
                //poor practice for redirecting the user to a different page, but we will handle it differently once we start using Ajax
                res.redirect(302, '/skill/all');
            }
        });
    }
});

router.get('/edit', function(req, res){
    if(req.query.skill_id == null) {
        res.send('A skill id is required');
    }
    else {
        skill_dal.edit(req.query.skill_id, function(err, result){
            console.log(result);
            res.render('skill/skillUpdate', {skill: result[0][0], resume: result[1]});
        });
    }

});

router.get('/edit2', function(req, res){
   if(req.query.skill_id == null) {
       res.send('A skill id is required');
   }
   else {
       skill_dal.getById(req.query.skill_id, function(err, skill){
           resume_dal.getAll(function(err, resume) {
               res.render('skill/skillUpdate', {skill: skill[0], resume: resume});
           });
       });
   }

});

router.get('/update', function(req, res) {
    skill_dal.update(req.query, function(err, result){
       res.redirect(302, '/skill/all');
    });
});

// Delete a skill for the given skill_id
router.get('/delete', function(req, res){
    if(req.query.skill_id == null) {
        res.send('skill_id is null');
    }
    else {
         skill_dal.delete(req.query.skill_id, function(err, result){
             if(err) {
                 res.send(err);
             }
             else {
                 //poor practice, but we will handle it differently once we start using Ajax
                 res.redirect(302, '/skill/all');
             }
         });
    }
});

module.exports = router;
