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
    var query = 'SELECT * FROM resume;';

    connection.query(query, function(err, result) {
        callback(err, result);
    });
};

exports.getById = function(resume_id, callback) {
    //var query = 'SELECT * FROM resume_view WHERE resume_id = ?';
    var query = 'call getOneResumeInfo(?)';
    var queryData = [resume_id];

    connection.query(query, queryData, function(err, result) {
        callback(err, result);
    });
};

exports.insert = function(params, callback) {
    var query = 'INSERT INTO resume (resume_name, user_account_id) VALUES (?, ?)';

    // the question marks in the sql query above will be replaced by the values of the
    // the data in queryData
    var queryData = [params.resume_name, params.user_account_id];

    connection.query(query, queryData, function(err, result) {
        callback(err, result);
    });

};

var resumeSchoolInsert = function(resume_id,schoolIDArray,callback) {
    var query = 'INSERT INTO resume_school (resume_id, school_id) VALUES ?';

    // TO BULK INSERT RECORDS WE CREATE A MULTIDIMENSIONAL ARRAY OF THE VALUES
    var resumeSchoolData = [];
    for(var i=0; i < schoolIDArray.length; i++) {
        resumeSchoolData.push([resume_id, schoolIDArray[i]]);
    }
    connection.query(query, [resumeSchoolData], function(err, result){
        callback(err, result);
    });
};
module.exports.resumeSchoolInsert = resumeSchoolInsert;

var resumeCompanyInsert = function(resume_id,companyIDArray,callback) {
    var query = 'INSERT INTO resume_company (resume_id, company_id) VALUES ?';

    // TO BULK INSERT RECORDS WE CREATE A MULTIDIMENSIONAL ARRAY OF THE VALUES
    var resumeCompanyData = [];
    for(var i=0; i < companyIDArray.length; i++) {
        resumeCompanyData.push([resume_id, companyIDArray[i]]);
    }
    connection.query(query, [resumeCompanyData], function(err, result){
        callback(err, result);
    });
};
module.exports.resumeCompanyInsert = resumeCompanyInsert;

var resumeSkillInsert = function(resume_id,skillIDArray,callback) {
    var query = 'INSERT INTO resume_skill (resume_id, skill_id) VALUES ?';

    // TO BULK INSERT RECORDS WE CREATE A MULTIDIMENSIONAL ARRAY OF THE VALUES
    var resumeSkillData = [];
    for(var i=0; i < skillIDArray.length; i++) {
        resumeSkillData.push([resume_id, skillIDArray[i]]);
    }
    connection.query(query, [resumeSkillData], function(err, result){
        callback(err, result);
    });
};
module.exports.resumeSkillInsert = resumeSkillInsert;

var resumeSchoolDeleteAll = function(resume_id, callback){
    var query = 'DELETE FROM resume_school WHERE resume_id = ?';
    var queryData = [resume_id];

    connection.query(query, queryData, function(err, result) {
        callback(err, result);
    });
};
module.exports.resumeSchoolDeleteAll = resumeSchoolDeleteAll;

var resumeCompanyDeleteAll = function(resume_id, callback){
    var query = 'DELETE FROM resume_company WHERE resume_id = ?';
    var queryData = [resume_id];

    connection.query(query, queryData, function(err, result) {
        callback(err, result);
    });
};
module.exports.resumeCompanyDeleteAll = resumeCompanyDeleteAll;

var resumeSkillDeleteAll = function(resume_id, callback){
    var query = 'DELETE FROM resume_skill WHERE resume_id = ?';
    var queryData = [resume_id];

    connection.query(query, queryData, function(err, result) {
        callback(err, result);
    });
};
module.exports.resumeSkillDeleteAll = resumeSkillDeleteAll;

exports.delete = function(resume_id, callback) {
    var query = 'DELETE FROM resume WHERE resume_id = ?';
    var queryData = [resume_id];

    connection.query(query, queryData, function(err, result) {
        callback(err, result);
    });

};

exports.update = function(params, callback) {
    var query = 'UPDATE resume SET resume_name = ?, user_account_id = ? WHERE resume_id = ?';
    var queryData = [params.resume_name, params.user_account_id, params.resume_id];

    connection.query(query, queryData, function(err, result) {
        //callback(err, result);
        
        //schools
        resumeSchoolDeleteAll(params.resume_id,function(err,result)
        {
            if (params.school_id != null) {
                resumeSchoolInsert(params.resume_id, params.school_id, function (err, result) {
                    //companies
                    resumeCompanyDeleteAll(params.resume_id,function(err,result)
                    {
                        if (params.company_id != null) {
                            resumeCompanyInsert(params.resume_id, params.company_id, function (err, result) {
                                //skills
                                resumeSkillDeleteAll(params.resume_id,function(err,result)
                                {
                                    if (params.skill_id != null) {
                                        resumeSkillInsert(params.resume_id, params.skill_id, function (err, result) {
                                            callback(err, result);
                                        });
                                    }
                                    else {
                                        callback(err,result); }
                                });
                            });
                        }
                        else {
                            callback(err,result); }
                    });
                });
            }
            else {
                callback(err,result); }
        });

    });
};


exports.edit = function(resume_id, callback) {
    var query = 'CALL resume_getinfo(?)';
    var queryData = [resume_id];

    connection.query(query, queryData, function(err, result) {
        callback(err, result);
    });
};