/**
 * Created by Daniel on 12/7/2016.
 */
var mysql   = require('mysql');
var db  = require('./db_connection.js');

/* DATABASE CONFIGURATION */
var connection = mysql.createConnection(db.config);

/*
 create or replace view resume_view as
 select r.resume_name, s.school_name, c.company_name, sk.name from rune_page r
 join resume_school rs on rs.resume_id = r.resume_id
 join rune s on s.school_id = rs.school_id
 join resume_company rc on r.resume_id = rc.company_id
 join champion c on c.company_id = rc.company_id
 join resume_skill rsk on rsk.resume_id = r.resume_id
 join ability sk on sk.skill_id = rsk.skill_id;
 */

exports.getAll = function(callback) {
    var query = 'SELECT * FROM rune_page; ';

    connection.query(query, function(err, result) {
        callback(err, result);
    });
};

exports.getById = function(rune_id, callback) {
    //var query = 'SELECT * FROM resume_view WHERE resume_id = ?';
    var query = 'select * from rune_page where rune_id = ?; ';
    var queryData = [rune_id];

    connection.query(query, queryData, function(err, result) {
        callback(err, result);
    });
};

exports.insert = function(params, callback) {
    var query = 'INSERT INTO rune_page (page_name, account_id, mark, seal, glyph, quintessence) VALUES (?,?, ?, ?, ?, ?) ';

    // the question marks in the sql query above will be replaced by the values of the
    // the data in queryData
    var queryData = [params.page_name, params.account_id, params.mark, params.seal, params.glyph, params.quintessence];

    connection.query(query, queryData, function(err, result) {
        callback(err, result);
    });

};


exports.update = function(params, callback) {
    var query = 'UPDATE rune_page SET page_name = ?, account_id = ?, mark = ?, seal = ?, glyph = ?, quintessence = ? WHERE rune_id = ?';
    var queryData = [params.page_name, params.account_id, params.mark, params.seal, params.glyph, params.quintessence, params.rune_id];

    connection.query(query, queryData, function(err, result) {
        callback(err, result);

    });
};

exports.edit = function(rune_id, callback) {
    var query = 'Select * from rune_page where rune_id = ?';
    var queryData = [rune_id];

    connection.query(query, queryData, function(err, result) {
        callback(err, result);
    });
};