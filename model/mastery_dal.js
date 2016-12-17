/**
 * Created by Daniel on 12/7/2016.
 */
var mysql   = require('mysql');
var db  = require('./db_connection.js');

/* DATABASE CONFIGURATION */
var connection = mysql.createConnection(db.config);

/*
 create or replace view resume_view as
 select r.resume_name, s.school_name, c.company_name, sk.name from mastery_page r
 join resume_school rs on rs.resume_id = r.resume_id
 join mastery s on s.school_id = rs.school_id
 join resume_company rc on r.resume_id = rc.company_id
 join champion c on c.company_id = rc.company_id
 join resume_skill rsk on rsk.resume_id = r.resume_id
 join ability sk on sk.skill_id = rsk.skill_id;
 */

exports.getAll = function(callback) {
    var query = 'SELECT * FROM mastery_page; ';

    connection.query(query, function(err, result) {
        callback(err, result);
    });
};

exports.getById = function(mastery_id, callback) {
    //var query = 'SELECT * FROM resume_view WHERE resume_id = ?';
    var query = 'select * from mastery_page where mastery_id = ?; ';
    var queryData = [mastery_id];

    connection.query(query, queryData, function(err, result) {
        callback(err, result);
    });
};

exports.insert = function(params, callback) {
    var query = 'INSERT INTO mastery_page (page_name, account_id, num_ferocity, num_cunning, num_resolve) VALUES (?, ?, ?, ?, ?) ';

    // the question marks in the sql query above will be replaced by the values of the
    // the data in queryData
    var queryData = [params.page_name, params.account_id, params.num_ferocity, params.num_cunning, params.num_resolve];

    connection.query(query, queryData, function(err, result) {
        callback(err, result);
    });

};


exports.update = function(params, callback) {
    var query = 'UPDATE mastery_page SET page_name = ?, account_id = ?, num_ferocity = ?, num_cunning = ?, num_resolve = ? WHERE mastery_id = ?';
    var queryData = [params.page_name, params.account_id, params.num_ferocity, params.num_cunning, params.num_resolve, params.mastery_id];

    connection.query(query, queryData, function(err, result) {
        callback(err, result);

    });
};

exports.edit = function(mastery_id, callback) {
    var query = 'Select * from mastery_page where mastery_id = ?';
    var queryData = [mastery_id];

    connection.query(query, queryData, function(err, result) {
        callback(err, result);
    });
};