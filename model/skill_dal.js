var mysql   = require('mysql');
var db  = require('./db_connection.js');

/* DATABASE CONFIGURATION */
var connection = mysql.createConnection(db.config);

/*
 create or replace view skill_view as
 select s.*, a.street, a.zipcode from skill s
 join address a on a.address_id = s.address_id;

 */

exports.getAll = function(callback) {
    var query = 'SELECT * FROM skill;';

    connection.query(query, function(err, result) {
        callback(err, result);
    });
};

exports.getById = function(skill_id, callback) {
    var query = 'SELECT c.*, a.street, a.zipcode FROM skill c ' +
        'LEFT JOIN resume_skill ca on ca.skill_id = c.skill_id ' +
        'LEFT JOIN resume a on a.resume_id = ca.resume_id ' +
        'WHERE c.skill_id = ?';
    var queryData = [skill_id];
    console.log(query);

    connection.query(query, queryData, function(err, result) {

        callback(err, result);
    });
};

exports.insert = function(params, callback) {

    // FIRST INSERT THE skill
    var query = 'INSERT INTO skill (skill_name) VALUES (?)';

    var queryData = [params.skill_name];

    connection.query(query, params.skill_name, function(err, result) {

        // THEN USE THE skill_ID RETURNED AS insertId AND THE SELECTED ADDRESS_IDs INTO skill_ADDRESS
        var skill_id = result.insertId;

        // NOTE THAT THERE IS ONLY ONE QUESTION MARK IN VALUES ?
        var query = 'INSERT INTO resume_skill (skill_id, resume_id) VALUES ?';

        // TO BULK INSERT RECORDS WE CREATE A MULTIDIMENSIONAL ARRAY OF THE VALUES
        var skillAddressData = [];
        for(var i=0; i < params.address_id.length; i++) {
            skillAddressData.push([skill_id, params.address_id[i]]);
        }

        // NOTE THE EXTRA [] AROUND skillAddressData
        connection.query(query, [skillAddressData], function(err, result){
            callback(err, result);
        });
    });

};

exports.delete = function(skill_id, callback) {
    var query = 'DELETE FROM skill WHERE skill_id = ?';
    var queryData = [skill_id];

    connection.query(query, queryData, function(err, result) {
        callback(err, result);
    });

};

//declare the function so it can be used locally
var skillAddressInsert = function(skill_id, addressIdArray, callback){
    // NOTE THAT THERE IS ONLY ONE QUESTION MARK IN VALUES ?
    var query = 'INSERT INTO skill_resume (skill_id, resume_id) VALUES ?';

    // TO BULK INSERT RECORDS WE CREATE A MULTIDIMENSIONAL ARRAY OF THE VALUES
    var skillAddressData = [];
    for(var i=0; i < addressIdArray.length; i++) {
        skillAddressData.push([skill_id, addressIdArray[i]]);
    }
    connection.query(query, [skillAddressData], function(err, result){
        callback(err, result);
    });
};
//export the same function so it can be used by external callers
module.exports.skillAddressInsert = skillAddressInsert;

//declare the function so it can be used locally
var skillAddressDeleteAll = function(skill_id, callback){
    var query = 'DELETE FROM resume_skill WHERE skill_id = ?';
    var queryData = [skill_id];

    connection.query(query, queryData, function(err, result) {
        callback(err, result);
    });
};
//export the same function so it can be used by external callers
module.exports.skillAddressDeleteAll = skillAddressDeleteAll;

exports.update = function(params, callback) {
    var query = 'UPDATE skill SET skill_name = ? WHERE skill_id = ?';

    var queryData = [params.skill_name, params.skill_id];

    connection.query(query, queryData, function(err, result) {
        //delete skill_address entries for this skill
        skillAddressDeleteAll(params.skill_id, function(err, result){

            if(params.address_id != null) {
                //insert skill_address ids
                skillAddressInsert(params.skill_id, params.address_id, function(err, result){
                    callback(err, result);
                });}
            else {
                callback(err, result);
            }
        });

    });
};

/*  Stored procedure used in this example
     DROP PROCEDURE IF EXISTS skill_getinfo;

     DELIMITER //
     CREATE PROCEDURE skill_getinfo (_skill_id int)
     BEGIN

     SELECT * FROM skill WHERE skill_id = _skill_id;

     SELECT a.*, s.skill_id FROM address a
     LEFT JOIN skill_address s on s.address_id = a.address_id AND skill_id = _skill_id
     ORDER BY a.street, a.zipcode;

     END //
     DELIMITER ;

     # Call the Stored Procedure
     CALL skill_getinfo (4);

 */

exports.edit = function(skill_id, callback) {
    var query = 'CALL skill_getinfo(?)';
    var queryData = [skill_id];

    connection.query(query, queryData, function(err, result) {
        callback(err, result);
    });
};