var express = require('express');
var router = express.Router();
var rune_dal = require('../model/rune_dal');
var account_dal = require('../model/ability_dal');


// View All runes
router.get('/all', function(req, res) {
    rune_dal.getAll(function(err, result){
        if(err) {
            res.send(err);
        }
        else {
            res.render('rune/runeViewAll', { 'result':result });
        }
    });

});

// View the rune for the given id
router.get('/', function(req, res){
    if(req.query.rune_id == null) {
        res.send('rune_id is null');
    }
    else {
        rune_dal.getById(req.query.rune_id, function(err,result) {
           if (err) {
               res.send(err);
           }
           else {
               res.render('rune/runeViewById', {'result': result});
           }
        });
    }
});

// Return the add a new rune form
router.get('/add', function(req, res){
    // passing all the query parameters (req.query) to the insert function instead of each individually
    account_dal.getAll(function(err,result) {
        if (err) {
            res.send(err);
        }
        else {
            res.render('rune/runeAdd', {'account': result});
        }
    });
});

// View the rune for the given id
router.get('/insert', function(req, res){
    // simple validation
    if(req.query.rune_name == null) {
        res.send('School Name must be provided.');
    }
    else if(req.query.account_id == null) {
        res.send('An Address must be selected');
    }
    else {
        // passing all the query parameters (req.query) to the insert function instead of each individually
        rune_dal.insert(req.query, function(err,result) {
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
    if(req.query.rune_id == null) {
        res.send('A rune id is required');
    }
    else {
        rune_dal.edit(req.query.rune_id, function(err, result){
            res.render('rune/runeUpdate', {rune: result[0]});
        });
    }

});

router.get('/edit2', function(req, res){
   if(req.query.rune_id == null) {
       res.send('A rune id is required');
   }
   else {
       rune_dal.getById(req.query.rune_id, function(err, rune){
           account_dal.getAll(function(err, account) {
               res.render('rune/runeUpdate', {rune: rune[0], account: account});
           });
       });
   }

});

router.get('/update', function(req, res){
    rune_dal.update(req.query, function(err, result){
       res.redirect(302, '/rune/all');
    });
});

// Delete a rune for the given rune_id
router.get('/delete', function(req, res){
    if(req.query.rune_id == null) {
        res.send('rune_id is null');
    }
    else {
         rune_dal.delete(req.query.rune_id, function(err, result){
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
