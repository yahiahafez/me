(function () {
    'use strict';

    angular
        .module('app')
        .factory('WorkService', Service);

    function Service($http, $q) {
        var service = {};

        service.Create = Create;
        service.GetAllByStudentId = GetAllByStudentId;

        return service;

        function Create(student,work) {
            return $http.post('/api/students/work', work).then(handleSuccess, handleError);
        }

        function GetAllByStudentId(student) {
            return $http.get('/api/students/works').then(handleSuccess, handleError);
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
