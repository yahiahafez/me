var config = require('config.json');
var express = require('express');
var router = express.Router();
var studentService = require('services/student.service');
var workService = require('services/work.service');

// routes
router.post('/authenticate', authenticateStudent);
router.post('/register', registerStudent);
router.get('/current', getCurrentStudent);
router.post('/work', createWork);
router.get('/works', getWorks);
router.put('/:_id', updateStudent);
router.delete('/:_id', deleteStudent);

module.exports = router;

function authenticateStudent(req, res) {
    studentService.authenticate(req.body.username, req.body.password)
        .then(function (token) {
            if (token) {
                // authentication successful
                res.send({ token: token });
            } else {
                // authentication failed
                res.status(401).send('Username or password is incorrect');
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function registerStudent(req, res) {
    studentService.create(req.body)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getCurrentStudent(req, res) {
    studentService.getById(req.user.sub)
        .then(function (student) {
            if (student) {
                res.send(student);
            } else {
                res.sendStatus(404);
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getWorks(req, res) {
    workService.getAllByStudentId(req.user.sub)
        .then(function (works) {
            if (works) {
                res.send(works);
            } else {
                res.sendStatus(404);
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}


function updateStudent(req, res) {
    var studentId = req.user.sub;
    if (req.params._id !== studentId) {
        // can only update own account
        return res.status(401).send('You can only update your own account');
    }

    studentService.update(studentId, req.body)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function createWork(req, res) {
    var studentId = req.user.sub;
    console.log(req.body);
    workService.create(studentId, req.body)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function deleteStudent(req, res) {
    var student = req.user.sub;
    if (req.params._id !== studentId) {
        // can only delete own account
        return res.status(401).send('You can only delete your own account');
    }

    studentService.delete(studentId)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}