var config = require('config.json');
var _ = require('lodash');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var Q = require('q');
var mongo = require('mongoskin');
var db = mongo.db(config.connectionString, { native_parser: true });
db.bind('students');

var service = {};

service.authenticate = authenticate;
service.getById = getById;
service.create = create;
service.update = update;
service.delete = _delete;
service.getAll = getAll;

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

function getById(_id) {
    var deferred = Q.defer();

    db.students.findById(_id, function (err, student) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        if (student) {
            // return student (without hashed password)
            deferred.resolve(_.omit(student, 'hash'));
        } else {
            // student not found
            deferred.resolve();
        }
    });
    return deferred.promise;
}

function create(studentParam) {
    var deferred = Q.defer();

    // validation
    db.students.findOne(
        { username: studentParam.username },
        function (err, student) {
            if (err) deferred.reject(err.name + ': ' + err.message);

            if (student) {
                // username already exists
                deferred.reject('Username "' + studentParam.username + '" is already taken');
            } else {
                createStudent();
            }
        });

    function createStudent() {
        // set student object to studentParam without the cleartext password
        var student = _.omit(studentParam, 'password');

        // add hashed password to student object
        student.hash = bcrypt.hashSync(studentParam.password, 10);

        db.students.insert(
            student,
            function (err, doc) {
                if (err) deferred.reject(err.name + ': ' + err.message);

                deferred.resolve();
            });
    }

    return deferred.promise;
}

function update(_id, studentParam) {
    var deferred = Q.defer();

    // validation
    db.students.findById(_id, function (err, student) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        if (student.username !== studentParam.username) {
            // username has changed so check if the new username is already taken
            db.students.findOne(
                { username: studentParam.username },
                function (err, student) {
                    if (err) deferred.reject(err.name + ': ' + err.message);

                    if (student) {
                        // username already exists
                        deferred.reject('Username "' + req.body.username + '" is already taken')
                    } else {
                        updateStudent();
                    }
                });
        } else {
            updateStudent();
        }
    });

    function updateStudent() {
        // fields to update
        var set = {
            firstName: studentParam.firstName,
            lastName: studentParam.lastName,
            username: studentParam.username,
        };

        // update password if it was entered
        if (studentParam.password) {
            set.hash = bcrypt.hashSync(studentParam.password, 10);
        }

        db.students.update(
            { _id: mongo.helper.toObjectID(_id) },
            { $set: set },
            function (err, doc) {
                if (err) deferred.reject(err.name + ': ' + err.message);

                deferred.resolve();
            });
    }

    return deferred.promise;
}

function _delete(_id) {
    var deferred = Q.defer();

    db.students.remove(
        { _id: mongo.helper.toObjectID(_id) },
        function (err) {
            if (err) deferred.reject(err.name + ': ' + err.message);

            deferred.resolve();
        });

    return deferred.promise;
}

function getAll() {
    var deferred = Q.defer();
    
    db.students.find().toArray(function (err, students) {
        
        if (err) deferred.reject(err.name + ': ' + err.message);

        if (students) {
            deferred.resolve(students);
        } else {
            deferred.resolve();
        }
    });
    return deferred.promise;
}