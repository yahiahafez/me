(function () {
    'use strict';

    angular
        .module('app')
        .factory('StudentService', Service);

    function Service($http, $q) {
        var service = {};

        service.GetCurrent = GetCurrent;
        service.GetAll = GetAll;
        service.GetById = GetById;
        service.GetByUsername = GetByUsername;
        service.Create = Create;
        service.Update = Update;
        service.Delete = Delete;

        return service;

        function GetCurrent() {
            return $http.get('/api/students/current').then(handleSuccess, handleError);
        }

        function GetAll() {
            return $http.get('/api/students').then(handleSuccess, handleError);
        }

        function GetById(_id) {
            return $http.get('/api/students/' + _id).then(handleSuccess, handleError);
        }

        function GetByUsername(username) {
            return $http.get('/api/students/' + username).then(handleSuccess, handleError);
        }

        function Create(student) {
            return $http.post('/api/students', student).then(handleSuccess, handleError);
        }

        function Update(student) {
            return $http.put('/api/students/' + student._id, student).then(handleSuccess, handleError);
        }

        function Delete(_id) {
            return $http.delete('/api/students/' + _id).then(handleSuccess, handleError);
        }

        // private functions

        function handleSuccess(res) {
            return res.data;
        }

        function handleError(res) {
            return $q.reject(res.data);
        }
    }

})();
