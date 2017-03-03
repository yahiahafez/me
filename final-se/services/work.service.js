var config = require('config.json');
var _ = require('lodash');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var Q = require('q');
var mongo = require('mongoskin');
var db = mongo.db(config.connectionString, { native_parser: true });
db.bind('students');
db.bind('works');

var service = {};

service.authenticate = authenticate;
// service.getById = getById;
service.create = create;
service.getAllByStudentId = getAllByStudentId;
service.getAllWorks = getAllWorks;
// service.update = update;
// service.delete = _delete;

module.exports = service;

function authenticate(username, password) {
    var deferred = Q.defer();

    db.students.findOne({ username: username }, function (err, student) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        if (student && bcrypt.compareSync(password, student.hash)) {
            // authentication successful
            deferred.resolve(jwt.sign({ sub: student._id }, config.secret));
        } else {
            // authentication failed
            deferred.resolve();
        }
    });

    return deferred.promise;
}


function create(id, workParam) {
    var deferred = Q.defer();
        // fields to update
        var set = {
            workName: workParam.workName,
            url: workParam.url,
            repo: workParam.repo,
            screenshot: workParam.screenshot,
            studentId: id
        };
        db.works.insert(
            set,
            function (err, doc) {
                if (err) deferred.reject(err.name + ': ' + err.message);

                deferred.resolve();
            });

    return deferred.promise;
}

function getAllByStudentId(id) {
    var deferred = Q.defer();
    db.works.find({studentId:id}).toArray(function (err, works) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        if (works) {
            deferred.resolve(works);
        } else {
            deferred.resolve('done');
        }
    });
    return deferred.promise;
}

function getAllWorks() {
    var deferred = Q.defer();
    
    db.works.find().toArray(function (err, works) {
        
        if (err) deferred.reject(err.name + ': ' + err.message);

        if (works) {
            deferred.resolve(works);
        } else {
            deferred.resolve();
        }
    });
    return deferred.promise;
}
