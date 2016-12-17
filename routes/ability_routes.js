var express = require('express');
var router = express.Router();
var champion_dal = require('../model/champion_dal');
var ability_dal = require('../model/ability_dal');


// View All abilities
router.get('/all', function(req, res) {
    champion_dal.getAll(function(err, result){
        if(err) {
            res.send(err);
        }
        else {
            res.render('champion/championViewAll', { 'result':result });
        }
    });

});

// View the champion for the given id
router.get('/', function(req, res){
    if(req.query.champion_id == null) {
        res.send('champion_id is null');
    }
    else {
        champion_dal.getById(req.query.champion_id, function(err,result) {
           if (err) {
               res.send(err);
           }
           else {
               res.render('champion/championViewById', {'result': result});
           }
        });
    }
});

// Return the add a new champion form
router.get('/add', function(req, res){
    // passing all the query parameters (req.query) to the insert function instead of each individually
    ability_dal.getAll(function(err,result) {
        if (err) {
            res.send(err);
        }
        else {
            res.render('champion/championAdd', {'ability': result});
        }
    });
});

// View the champion for the given id
router.get('/insert', function(req, res){
    // simple validation
    if(req.query.champion_name == null) {
        res.send('Champion Name must be provided.');
    }
    else if(req.query.ability_id == null) {
        res.send('At least one ability must be selected');
    }
    else {
        // passing all the query parameters (req.query) to the insert function instead of each individually
        champion_dal.insert(req.query, function(err,result) {
            if (err) {
                console.log(err)
                res.send(err);
            }
            else {
                //poor practice for redirecting the user to a different page, but we will handle it differently once we start using Ajax
                res.redirect(302, '/champion/all');
            }
        });
    }
});

router.get('/edit', function(req, res){
    if(req.query.champion_id == null) {
        res.send('A champion id is required');
    }
    else {
        champion_dal.edit(req.query.champion_id, function(err, result){
            console.log(result);
            res.render('champion/championUpdate', {champion: result[0][0], ability: result[1]});
        });
    }

});

router.get('/edit2', function(req, res){
   if(req.query.champion_id == null) {
       res.send('A champion id is required');
   }
   else {
       champion_dal.getById(req.query.champion_id, function(err, champion){
           ability_dal.getAll(function(err, ability) {
               res.render('champion/championUpdate', {champion: champion[0], ability: ability});
           });
       });
   }

});

router.get('/update', function(req, res) {
    champion_dal.update(req.query, function(err, result){
       res.redirect(302, '/champion/all');
    });
});

// Delete a champion for the given champion_id
router.get('/delete', function(req, res){
    if(req.query.champion_id == null) {
        res.send('champion_id is null');
    }
    else {
         champion_dal.delete(req.query.champion_id, function(err, result){
             if(err) {
                 res.send(err);
             }
             else {
                 //poor practice, but we will handle it differently once we start using Ajax
                 res.redirect(302, '/champion/all');
             }
         });
    }
});

module.exports = router;
