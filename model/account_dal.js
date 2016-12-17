/**
 * Created by Daniel on 12/7/2016.
 */
var mysql   = require('mysql');
var db  = require('./db_connection.js');

/* DATABASE CONFIGURATION */
var connection = mysql.createConnection(db.config);

/*
 create or replace view resume_view as
 select r.resume_name, s.school_name, c.company_name, sk.name from rune r
 join resume_school rs on rs.resume_id = r.resume_id
 join mastery s on s.school_id = rs.school_id
 join resume_company rc on r.resume_id = rc.company_id
 join champion c on c.company_id = rc.company_id
 join resume_skill rsk on rsk.resume_id = r.resume_id
 join ability sk on sk.skill_id = rsk.skill_id;
 */

exports.getAll = function(callback) {
    var query = 'SELECT * FROM lol_account; ';

    connection.query(query, function(err, result) {
        callback(err, result);
    });
};

exports.getById = function(account_id, callback) {
    var query = 'Select * from lol_account where account_id = ? ';
    var queryData = [account_id];

    connection.query(query, queryData, function(err, result) {
        callback(err, result);
    });
};

exports.insert = function(params, callback) {
    var query = 'INSERT INTO lol_account (username, password, level, influence_points, riot_points) VALUES (?, ?, ?,?,?) ';

    // the question marks in the sql query above will be replaced by the values of the
    // the data in queryData
    var queryData = [params.username, params.password, params.level,params.influence_points,params.riot_points];

    connection.query(query, queryData, function(err, result) {
        callback(err, result);
    });
};

var runeUpdate = function(account_id,rune_id,callback) {
    var query = 'UPDATE rune_page set account_id = ? where rune_id = ? ';
    var queryData = [account_id, resume_id];

    connection.query(query, queryData, function(err, result){
        callback(err, result);
    });
};
module.exports.runeUpdate = runeUpdate;

var masteryUpdate = function(account_id,mastery_id,callback) {
    var query = 'UPDATE mastery_page set account_id = ? where mastery_id = ? ';
    var queryData = [account_id, resume_id];

    connection.query(query, queryData, function(err, result){
        callback(err, result);
    });
};
module.exports.masteryUpdate = masteryUpdate;


exports.update = function(params, callback) {
    var query = 'UPDATE lol_account SET username = ?, password = ?, level = ?, influence_points = ?, riot_points = ?, ' +
        'rank_division = ?, rank_tier = ? WHERE account_id = ? ';
    var queryData = [params.username, params.password, params.level, params.influence_points, params.riot_points,
        params.rank_divsion, params.rank_tier, params.account_id];

    connection.query(query, queryData, function(err, result) {
        if(params.rune_id!=null) {
            runeUpdate(params.account_id, params.resume_id, function (err, result) {
                if(params.mastery_id!=null) {
                    masteryUpdate(params.account_id,params.mastery_id, function(err, result) {
                        callback(err,result);
                    });
                }
                else
                    callback(err, result);
            });
        }
        else {
            callback(err,result);
        }
    });
};


exports.edit = function(account_id, callback) {
    var query = 'Select * from AccountRunesandMasteriesView where AccountRunesandMasteriesView.account_id = ? ';
    var queryData = [account_id];

    connection.query(query, queryData, function(err, result) {
        callback(err, result);
    });
};

exports.delete = function(account_id, callback) {
    var query = 'DELETE FROM lol_account WHERE account_id = ? ';
    var queryData = [account_id];

    connection.query(query, queryData, function(err, result) {
        callback(err, result);
    });

};