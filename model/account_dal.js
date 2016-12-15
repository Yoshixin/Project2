/**
 * Created by Daniel on 12/7/2016.
 */
var mysql   = require('mysql');
var db  = require('./db_connection.js');

/* DATABASE CONFIGURATION */
var connection = mysql.createConnection(db.config);

/*
 create or replace view resume_view as
 select r.resume_name, s.school_name, c.company_name, sk.name from resume r
 join resume_school rs on rs.resume_id = r.resume_id
 join school s on s.school_id = rs.school_id
 join resume_company rc on r.resume_id = rc.company_id
 join company c on c.company_id = rc.company_id
 join resume_skill rsk on rsk.resume_id = r.resume_id
 join skill sk on sk.skill_id = rsk.skill_id;
 */

exports.getAll = function(callback) {
    var query = 'SELECT * FROM account;';

    connection.query(query, function(err, result) {
        callback(err, result);
    });
};

exports.getById = function(account_id, callback) {
    //var query = 'SELECT * FROM resume_view WHERE resume_id = ?';
    var query = 'Select a.*, r.resume_name from account a ' +
        'Left Join resume r on r.user_account_id = a.account_id and a.account_id = ?';
    var queryData = [account_id];

    connection.query(query, queryData, function(err, result) {
        callback(err, result);
    });
};

exports.insert = function(params, callback) {
    var query = 'INSERT INTO account (email, first_name, last_name) VALUES (?, ?, ?)';

    // the question marks in the sql query above will be replaced by the values of the
    // the data in queryData
    var queryData = [params.email, params.first_name, params.last_name];

    connection.query(query, queryData, function(err, result) {
        callback(err, result);
    });
};

var resumeUpdate = function(account_id,resume_id,callback) {
    var query = 'UPDATE RESUME set user_account_id = ? where resume_id = ?';
    var queryData = [account_id, resume_id];

    connection.query(query, queryData, function(err, result){
        callback(err, result);
    });
};
module.exports.resumeUpdate = resumeUpdate;


exports.update = function(params, callback) {
    var query = 'UPDATE account SET email = ?, first_name = ?, last_name = ? WHERE account_id = ?';
    var queryData = [params.email, params.first_name, params.last_name, params.account_id];

    connection.query(query, queryData, function(err, result) {
        if(params.resume_id!=null) {
            resumeUpdate(params.account_id, params.resume_id, function (err, result) {
                callback(err, result);
            });
        }
        else {
            callback(err,result);
        }
    });
};


exports.edit = function(account_id, callback) {
    var query = 'CALL account_getinfo(?)';
    var queryData = [account_id];

    connection.query(query, queryData, function(err, result) {
        callback(err, result);
    });
};

exports.delete = function(account_id, callback) {
    var query = 'DELETE FROM account WHERE account_id = ?';
    var queryData = [account_id];

    connection.query(query, queryData, function(err, result) {
        callback(err, result);
    });

};