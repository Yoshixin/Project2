/**
 * Created by Daniel on 12/7/2016.
 */
var express = require('express');
var router = express.Router();
var resume_dal = require('../model/mastery_dal');
var company_dal = require('../model/champion_dal');
var school_dal = require('../model/rune_dal');


// View All resumes
router.get('/all', function(req, res) {
    resume_dal.getAll(function(err, result){
        if(err) {
            res.send(err);
        }
        else {
            res.render('rune/resumeViewAll', { 'result':result });
        }
    });

});

// View the rune for the given id
router.get('/', function(req, res){
    if(req.query.resume_id == null) {
        res.send('resume_id is null');
    }
    else {
        resume_dal.getById(req.query.resume_id, function(err,result) {
            if (err) {
                res.send(err);
            }
            else {
                res.render('rune/resumeViewById', {'result': result});
            }
        });
    }
});

// Return the add a new rune form
router.get('/add', function(req, res){
    // passing all the query parameters (req.query) to the insert function instead of each individually
    school_dal.getAll(function(err,result) {
        if (err) {
            res.send(err);
        }
        else {
            company_dal.getAll(function(err,result2) {
                if(err) {
                    res.send(err);
                }
                else {

                    res.render('rune/resumeAdd', {'resume': result, 'company': result2});
                }

            });
                }

            });

});

// View the rune for the given id
router.get('/insert', function(req, res){
    // simple validation
    if(req.query.resume_name == null) {
        res.send('Resume Name must be provided.');
    }
    else if(req.query.school_id == null) {
        res.send('At least one mastery must be selected');
    }
    else {
        // passing all the query parameters (req.query) to the insert function instead of each individually
        resume_dal.insert(req.query, function(err,result) {
            if (err) {
                console.log(err)
                res.send(err);
            }
            else {
                //poor practice for redirecting the user to a different page, but we will handle it differently once we start using Ajax
                res.redirect(302, '/rune/all');
            }
        });
    }
});

router.get('/edit', function(req, res){
    if(req.query.resume_id == null) {
        res.send('A rune id is required');
    }
    else {
        resume_dal.edit(req.query.resume_id, function(err, result){
            console.log(result);
            res.render('rune/resumeUpdate', {resume: result[0][0], school: result[1], company: result[2]});
        });
    }

});

router.get('/edit2', function(req, res){
    if(req.query.resume_id == null) {
        res.send('A rune id is required');
    }
    else {
        resume_dal.getById(req.query.resume_id, function(err, resume){
            school_dal.getAll(function(err, school) {
                res.render('rune/resumeUpdate', {resume: resume[0], school: school});
            });
        });
    }

});

router.get('/update', function(req, res) {
    resume_dal.update(req.query, function(err, result){
        res.redirect(302, '/rune/all');
    });
});

// Delete a rune for the given resume_id
router.get('/delete', function(req, res){
    if(req.query.resume_id == null) {
        res.send('resume_id is null');
    }
    else {
        resume_dal.delete(req.query.resume_id, function(err, result){
            if(err) {
                res.send(err);
            }
            else {
                //poor practice, but we will handle it differently once we start using Ajax
                res.redirect(302, '/rune/all');
            }
        });
    }
});

module.exports = router;