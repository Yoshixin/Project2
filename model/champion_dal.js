var mysql   = require('mysql');
var db  = require('./db_connection.js');

/* DATABASE CONFIGURATION */
var connection = mysql.createConnection(db.config);

/*
 create or replace view champion_view as
 select s.*, a.street, a.zipcode from champion s
 join ability a on a.ability_id = s.ability_id;

 */

exports.getAll = function(callback) {
    var query = 'SELECT * FROM champion; ';

    connection.query(query, function(err, result) {
        callback(err, result);
    });
};

exports.getById = function(champion_id, callback) {
    var query = 'SELECT c.*, a.ability_name, a.description FROM champion c ' +
        'JOIN ability a on a.champion_id = c.champion_id ' +
        'WHERE c.champion_id = ? ';
    var queryData = [champion_id];
    console.log(query);

    connection.query(query, queryData, function(err, result) {

        callback(err, result);
    });
};

exports.insert = function(params, callback) {

    // FIRST INSERT THE COMPANY
    var query = 'INSERT INTO champion (name) VALUES (?) ';

    var queryData = [params.champion_name];

    connection.query(query, params.champion_name, function(err, result) {

        // THEN USE THE COMPANY_ID RETURNED AS insertId AND THE SELECTED ADDRESS_IDs INTO COMPANY_ADDRESS
        var champion_id = result.insertId;

        // NOTE THAT THERE IS ONLY ONE QUESTION MARK IN VALUES ?
        var query = 'INSERT INTO ability (champion_id, ability_name, description) VALUES ?, ?, ? ';

        // TO BULK INSERT RECORDS WE CREATE A MULTIDIMENSIONAL ARRAY OF THE VALUES
        var championAbilityData = [];
        for(var i=0; i < params.ability_id.length; i++) {
            championAbilityData.push([champion_id, params.abilty_name[i], params.description[i]]);
        }

        // NOTE THE EXTRA [] AROUND championAbilityData
        connection.query(query, [championAbilityData], function(err, result){
            callback(err, result);
        });
    });

};

exports.delete = function(champion_id, callback) {
    var query = 'DELETE FROM champion WHERE champion_id = ? ';
    var queryData = [champion_id];

    connection.query(query, queryData, function(err, result) {
        callback(err, result);
    });

};

//declare the function so it can be used locally
var abilityInsert = function(champion_id, abilityIdArray, callback){
    // NOTE THAT THERE IS ONLY ONE QUESTION MARK IN VALUES ?
    var query = 'Update ability  set champion_id = ? where ability_id = ? ';

    // TO BULK INSERT RECORDS WE CREATE A MULTIDIMENSIONAL ARRAY OF THE VALUES
    var abilityData = [];
    for(var i=0; i < abilityIdArray.length; i++) {
        abilityData.push([champion_id, abilityIdArray[i]]);
    }
    connection.query(query, [abilityData], function(err, result){
        callback(err, result);
    });
};
//export the same function so it can be used by external callers
module.exports.abilityInsert = abilityInsert;

//declare the function so it can be used locally
var abilityDeleteAll = function(ability_id, callback){
    var query = 'DELETE FROM ability WHERE ability_id = ? ';
    var queryData = [ability_id];

    connection.query(query, queryData, function(err, result) {
        callback(err, result);
    });
};
//export the same function so it can be used by external callers
module.exports.abilityDeleteAll = abilityDeleteAll;

exports.update = function(params, callback) {
    var query = 'UPDATE champion SET champion_name = ? WHERE champion_id = ? ';

    var queryData = [params.champion_name, params.champion_id];

    connection.query(query, queryData, function(err, result) {
        //delete champion_ability entries for this champion
        abilityDeleteAll(params.ability_id, function(err, result){

            if(params.ability_id != null) {
                //insert ability ids
                abilityInsert(params.champion_id, params.ability_id, function(err, result){
                    callback(err, result);
                });}
            else {
                callback(err, result);
            }
        });

    });
};

/*  Stored procedure used in this example
     DROP PROCEDURE IF EXISTS champion_getinfo;

     DELIMITER //
     CREATE PROCEDURE champion_getinfo (_champion_id int)
     BEGIN

     SELECT * FROM champion WHERE champion_id = _champion_id;

     SELECT a.*, s.champion_id FROM ability a
     LEFT JOIN champion_ability s on s.ability_id = a.ability_id AND champion_id = _champion_id
     ORDER BY a.street, a.zip_code;

     END //
     DELIMITER ;

     # Call the Stored Procedure
     CALL champion_getinfo (4);

 */

exports.edit = function(champion_id, callback) {
    var query = 'CALL champion_getinfo(?) ';
    var queryData = [champion_id];

    connection.query(query, queryData, function(err, result) {
        callback(err, result);
    });
};