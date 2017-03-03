var express = require('express');
var router = express.Router();
var request = require('request');
var config = require('config.json');
var workService = require('services/work.service');
var studentService = require('services/student.service');

router.get('/', getAllWorks);
// router.get('/', function (req, res) {
// 	request.post({
//         url: 'http://localhost:3000/portofolio',
//         json: true
//     }, function (error, response, body) {
//         if (error) {
//             return res.render('home', { error: 'An error occurred' });
//         }

//         if (response.statusCode !== 200) {
//             return res.render('home', {
//                 error: response.body,
//                 // firstName: req.body.firstName,
//                 // lastName: req.body.lastName,
//                 // username: req.body.username
//             });
//         }

//         // return to login page with success message
//         return res.render('home', {works:req.body});
//     });

    
// });

function getAllWorks(req, res) {
    studentService.getAll()
        .then(function (students) {
            if (students) {
                for (var i = students.length - 1; i >= 0; i--) {
                    workService.getAllByStudentId(students[i]._id)
                    .then(function (works) {
                        if (works) {
                            students[i].works=works;
                        }
                        else
                        {
                            students[i].works=works;
                            
                        }
                    })
                    .catch(function (err) {
                        res.status(400).send(err);
                    });
                    
                };
                return res.render('home', { students: students});
                
            } else {
                return res.render('home', {
                 error: res.body});
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

// router.post('/', function (req, res) {
//     // register using api to maintain clean separation between layers
//     request.post({
//         url: config.apiUrl + '/students/allWorks',
//         form: req.body,
//         json: true
//     }, function (error, response, body) {
//         if (error) {
//             return res.render('home', { error: 'An error occurred' });
//         }

//         if (response.statusCode !== 200) {
//             return res.render('home', {
//                 error: response.body,
//                 // firstName: req.body.firstName,
//                 // lastName: req.body.lastName,
//                 // username: req.body.username
//             });
//         }

//         // return to login page with success message
//         return req.body;
//     });
// });

module.exports = router;