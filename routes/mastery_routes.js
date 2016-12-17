/**
 * Created by Daniel on 12/7/2016.
 */
var express = require('express');
var router = express.Router();
var mastery_dal = require('../model/mastery_dal');
var account_dal = require('../model/champion_dal');



// View All masterys
router.get('/all', function(req, res) {
    mastery_dal.getAll(function(err, result){
        if(err) {
            res.send(err);
        }
        else {
            res.render('mastery/masteryViewAll', { 'result':result });
        }
    });

});

// View the mastery for the given id
router.get('/', function(req, res){
    if(req.query.mastery_id == null) {
        res.send('mastery_id is null');
    }
    else {
        mastery_dal.getById(req.query.mastery_id, function(err,result) {
            if (err) {
                res.send(err);
            }
            else {
                res.render('mastery/masteryViewById', {'result': result});
            }
        });
    }
});

// Return the add a new mastery form
router.get('/add', function(req, res){
    // passing all the query parameters (req.query) to the insert function instead of each individually
    mastery_dal.getAll(function(err,result) {
        if (err) {
            res.send(err);
        }
        else {
            account_dal.getAll(function(err,result2) {
                if(err) {
                    res.send(err);
                }
                else {

                    res.render('mastery/masteryAdd', {'mastery': result, 'account': result2});
                }

            });
                }

            });

});

// View the mastery for the given id
router.get('/insert', function(req, res){
    // simple validation
    if(req.query.mastery_name == null) {
        res.send('Mastery name must be provided.');
    }
    else {
        // passing all the query parameters (req.query) to the insert function instead of each individually
        mastery_dal.insert(req.query, function(err,result) {
            if (err) {
                console.log(err)
                res.send(err);
            }
            else {
                //poor practice for redirecting the user to a different page, but we will handle it differently once we start using Ajax
                res.redirect(302, '/mastery/all');
            }
        });
    }
});

router.get('/edit', function(req, res){
    if(req.query.mastery_id == null) {
        res.send('A mastery id is required');
    }
    else {
        mastery_dal.edit(req.query.mastery_id, function(err, result){
            console.log(result);
            res.render('mastery/masteryUpdate', {mastery: result[0]});
        });
    }

});

router.get('/edit2', function(req, res){
    if(req.query.mastery_id == null) {
        res.send('A mastery id is required');
    }
    else {
        mastery_dal.getById(req.query.mastery_id, function(err, mastery){
            res.render('mastery/masteryUpdate', {mastery: mastery[0]});
        });
    }

});

router.get('/update', function(req, res) {
    mastery_dal.update(req.query, function(err, result){
        res.redirect(302, '/mastery/all');
    });
});

// Delete a mastery for the given mastery_id
router.get('/delete', function(req, res){
    if(req.query.mastery_id == null) {
        res.send('mastery_id is null');
    }
    else {
        mastery_dal.delete(req.query.mastery_id, function(err, result){
            if(err) {
                res.send(err);
            }
            else {
                //poor practice, but we will handle it differently once we start using Ajax
                res.redirect(302, '/mastery/all');
            }
        });
    }
});

module.exports = router;